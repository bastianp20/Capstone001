-- =====================================================================
-- AuraPet — 32: Solicitudes de eliminación de cuenta
--
-- La persona la pide desde Configuración → Privacidad y datos. El
-- superadmin la ve en "Eliminaciones" y:
--   · la aprueba → la cuenta se DESACTIVA (no se borra: el historial
--     médico de las mascotas se conserva y borrar usuarios de Auth
--     requiere la clave de servicio). Una cuenta desactivada ya no entra.
--   · o la rechaza, con una respuesta que la persona ve.
-- =====================================================================

create table solicitudes_eliminacion (
  id            bigint generated always as identity primary key,
  perfil_id     uuid not null references perfiles (id) on delete cascade,
  motivo        text check (length(motivo) <= 500),
  estado        text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  respuesta     text check (length(respuesta) <= 500),
  creada_en     timestamptz not null default now(),
  resuelta_por  uuid references perfiles (id) on delete set null,
  resuelta_en   timestamptz
);

-- Una sola solicitud pendiente por persona
create unique index solicitudes_eliminacion_una_pendiente
  on solicitudes_eliminacion (perfil_id) where estado = 'pendiente';

alter table solicitudes_eliminacion enable row level security;

create policy "cada uno ve sus solicitudes; el superadmin ve todas"
  on solicitudes_eliminacion for select to authenticated
  using (perfil_id = auth.uid() or public.es_superadmin());

-- ---------- Pedir la eliminación de la propia cuenta ----------
create function public.solicitar_eliminacion_cuenta(p_motivo text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if exists (select 1 from public.solicitudes_eliminacion
             where perfil_id = auth.uid() and estado = 'pendiente') then
    raise exception 'Ya tienes una solicitud de eliminación en revisión';
  end if;

  insert into public.solicitudes_eliminacion (perfil_id, motivo)
  values (auth.uid(), nullif(left(trim(p_motivo), 500), ''));
end;
$$;

revoke execute on function public.solicitar_eliminacion_cuenta from public, anon;
grant  execute on function public.solicitar_eliminacion_cuenta to authenticated;

-- ---------- Lista para el superadmin (el correo vive en auth.users) ----------
create function public.listar_solicitudes_eliminacion()
returns table (
  id          bigint,
  perfil_id   uuid,
  nombre      text,
  correo      text,
  rol         text,
  motivo      text,
  estado      text,
  respuesta   text,
  creada_en   timestamptz,
  resuelta_en timestamptz
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin ve estas solicitudes';
  end if;

  return query
    select s.id, s.perfil_id, p.nombre, u.email::text, p.rol::text,
           s.motivo, s.estado, s.respuesta, s.creada_en, s.resuelta_en
    from public.solicitudes_eliminacion s
    join public.perfiles p on p.id = s.perfil_id
    join auth.users u on u.id = s.perfil_id
    order by (s.estado <> 'pendiente'), s.creada_en desc;   -- pendientes primero
end;
$$;

revoke execute on function public.listar_solicitudes_eliminacion from public, anon;
grant  execute on function public.listar_solicitudes_eliminacion to authenticated;

-- ---------- Aprobar (desactiva la cuenta) o rechazar ----------
create function public.resolver_solicitud_eliminacion(
  p_solicitud_id bigint, p_aprobar boolean, p_respuesta text default null
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_perfil uuid;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin resuelve estas solicitudes';
  end if;

  select perfil_id into v_perfil from public.solicitudes_eliminacion
  where id = p_solicitud_id and estado = 'pendiente' for update;
  if not found then
    raise exception 'Esa solicitud ya no está pendiente';
  end if;

  if p_aprobar then
    if v_perfil = auth.uid() then
      raise exception 'No puedes desactivar tu propia cuenta desde aquí';
    end if;
    update public.perfiles set desactivado_en = now() where id = v_perfil;
  end if;

  update public.solicitudes_eliminacion
     set estado = case when p_aprobar then 'aprobada' else 'rechazada' end,
         respuesta = nullif(left(trim(p_respuesta), 500), ''),
         resuelta_por = auth.uid(),
         resuelta_en = now()
   where id = p_solicitud_id;
end;
$$;

revoke execute on function public.resolver_solicitud_eliminacion from public, anon;
grant  execute on function public.resolver_solicitud_eliminacion to authenticated;
