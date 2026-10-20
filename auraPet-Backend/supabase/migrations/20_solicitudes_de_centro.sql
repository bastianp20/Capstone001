-- =====================================================================
-- AuraPet — 20: Solicitudes de centros que quieren unirse
--
-- Desde la página pública /solicitar-centro, un centro SIN cuenta deja sus
-- datos y los del responsable. La solicitud queda "pendiente" para que un
-- superadmin la revise.
--
-- Va en una tabla aparte (y no directo en centros) porque:
--   · quien la envía no tiene cuenta (centros.creado_por queda vacío),
--   · hay que guardar los datos de contacto del responsable,
--   · y así no aparecen centros "a medias" en la app mientras nadie los revisa.
--
-- Nadie inserta directo en la tabla: se usa solicitar_centro(), que valida
-- todo y no deja más de una solicitud pendiente por correo (anti-spam).
-- =====================================================================

create table solicitudes_centro (
  id                    bigint generated always as identity primary key,
  -- Datos del centro
  nombre_centro         text not null,
  direccion             text not null,
  comuna                text not null,
  telefono_centro       bigint not null,
  especialidad_ids      bigint[] not null default '{}',
  sitio_web             text,
  -- Datos del responsable
  nombre_responsable    text not null,
  cargo                 text not null check (cargo in ('dueno', 'director_medico', 'administrador', 'otro')),
  correo                text not null,
  telefono_responsable  bigint not null,
  mensaje               text,
  -- Revisión del superadmin
  estado                estado_verificacion not null default 'pendiente',
  revisado_por          uuid references perfiles (id) on delete set null,
  revisado_en           timestamptz,
  motivo_rechazo        text,
  centro_id             bigint references centros (id) on delete set null,  -- el centro creado al aprobar
  creado_en             timestamptz not null default now(),
  check (estado <> 'rechazado' or motivo_rechazo is not null)
);

-- Una sola solicitud pendiente por correo
create unique index solicitudes_centro_un_pendiente_por_correo
  on solicitudes_centro (lower(correo)) where estado = 'pendiente';

create index on solicitudes_centro (estado, creado_en desc);

alter table solicitudes_centro enable row level security;

-- Solo el superadmin las ve y las resuelve
create policy "el superadmin ve las solicitudes de centro"
  on solicitudes_centro for select to authenticated
  using (public.es_superadmin());

create policy "el superadmin resuelve las solicitudes de centro"
  on solicitudes_centro for update to authenticated
  using (public.es_superadmin())
  with check (public.es_superadmin());

-- ---------- Enviar una solicitud (página pública) ----------
create function public.solicitar_centro(
  p_nombre_centro         text,
  p_direccion             text,
  p_comuna                text,
  p_telefono_centro       bigint,
  p_nombre_responsable    text,
  p_cargo                 text,
  p_correo                text,
  p_telefono_responsable  bigint,
  p_especialidad_ids      bigint[] default '{}',
  p_sitio_web             text default null,
  p_mensaje               text default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id bigint;
begin
  if nullif(trim(p_nombre_centro), '') is null
     or nullif(trim(p_direccion), '') is null
     or nullif(trim(p_comuna), '') is null
     or nullif(trim(p_nombre_responsable), '') is null then
    raise exception 'Faltan datos obligatorios';
  end if;

  if p_cargo not in ('dueno', 'director_medico', 'administrador', 'otro') then
    raise exception 'Cargo inválido';
  end if;

  if trim(p_correo) !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'El correo no es válido';
  end if;

  -- Teléfonos chilenos: 9 dígitos (sin el +56)
  if p_telefono_centro not between 100000000 and 999999999
     or p_telefono_responsable not between 100000000 and 999999999 then
    raise exception 'El teléfono debe tener 9 dígitos';
  end if;

  if length(coalesce(p_mensaje, '')) > 500 then
    raise exception 'El mensaje no puede superar los 500 caracteres';
  end if;

  if exists (
    select 1 from public.solicitudes_centro
    where lower(correo) = lower(trim(p_correo)) and estado = 'pendiente'
  ) then
    raise exception 'Ya hay una solicitud pendiente con ese correo. Te contactaremos pronto.';
  end if;

  insert into public.solicitudes_centro (
    nombre_centro, direccion, comuna, telefono_centro, especialidad_ids, sitio_web,
    nombre_responsable, cargo, correo, telefono_responsable, mensaje
  ) values (
    left(trim(p_nombre_centro), 120), left(trim(p_direccion), 200), left(trim(p_comuna), 80), p_telefono_centro,
    -- solo especialidades que existen
    coalesce((select array_agg(e.id) from public.especialidades e where e.id = any (p_especialidad_ids)), '{}'),
    nullif(left(trim(p_sitio_web), 200), ''),
    left(trim(p_nombre_responsable), 120), p_cargo, lower(trim(p_correo)), p_telefono_responsable,
    nullif(trim(p_mensaje), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Se puede llamar sin sesión (anon): es un formulario público
revoke execute on function public.solicitar_centro from public;
grant  execute on function public.solicitar_centro to anon, authenticated;
