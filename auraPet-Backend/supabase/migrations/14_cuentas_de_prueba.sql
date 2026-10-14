-- =====================================================================
-- AuraPet — 14: Cuentas de prueba
--
-- Las cuentas marcadas como "de prueba" son del equipo de desarrollo.
--   · Ven los centros de prueba (los de AuraPet), además de lo normal.
--   · Solo se pueden asignar a centros de prueba (y las reales, solo a reales).
--   · Un dueño de prueba solo puede pedir hora en centros de prueba.
--   · Solo el superadmin puede marcar o desmarcar una cuenta como de prueba.
-- Así las pruebas de los devs nunca se mezclan con clínicas reales.
-- =====================================================================

alter table perfiles add column es_prueba boolean not null default false;

-- ¿La persona conectada es una cuenta de prueba?
create function public.es_cuenta_de_prueba()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select coalesce((select es_prueba from public.perfiles where id = auth.uid()), false);
$$;

-- ---------- Proteger rol y es_prueba ----------
-- Misma función de la migración 02, más la regla de es_prueba.
create or replace function public.proteger_cambio_de_rol()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.rol is distinct from old.rol
     and auth.uid() is not null          -- desde el panel de Supabase (sin sesión) sí se permite
     and not public.es_superadmin() then
    raise exception 'Solo un superadmin puede cambiar el rol de una cuenta';
  end if;

  if new.es_prueba is distinct from old.es_prueba
     and auth.uid() is not null
     and not public.es_superadmin() then
    raise exception 'Solo un superadmin puede marcar una cuenta como de prueba';
  end if;

  -- ¿Este cambio deja a la plataforma sin superadmins activos?
  if old.rol = 'superadmin' and old.desactivado_en is null
     and (new.rol <> 'superadmin' or new.desactivado_en is not null)
     and not exists (
       select 1 from public.perfiles
       where rol = 'superadmin' and desactivado_en is null and id <> old.id
     ) then
    raise exception 'No se puede quitar el último superadmin activo';
  end if;

  return new;
end;
$$;

-- ---------- Las cuentas de prueba ven los centros de prueba ----------
create policy "las cuentas de prueba ven los centros de prueba"
  on centros for select to authenticated
  using (es_prueba and estado_verificacion = 'aprobado' and public.es_cuenta_de_prueba());

-- ---------- No mezclar mundos al asignar ----------
-- Revisa que la cuenta y el centro sean los dos de prueba o los dos reales.
-- Se usa al asignar un veterinario a un centro y al nombrar un admin de centro.
create function public.validar_mundo_de_pruebas()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_cuenta_prueba boolean;
  v_centro_prueba boolean;
begin
  if tg_table_name = 'veterinario_centros' then
    select p.es_prueba into v_cuenta_prueba
    from public.veterinarios v join public.perfiles p on p.id = v.perfil_id
    where v.id = new.veterinario_id;
  else -- admins_centro
    select es_prueba into v_cuenta_prueba from public.perfiles where id = new.perfil_id;
  end if;

  select es_prueba into v_centro_prueba from public.centros where id = new.centro_id;

  if coalesce(v_cuenta_prueba, false) <> coalesce(v_centro_prueba, false) then
    raise exception 'Las cuentas de prueba solo van en centros de prueba, y las reales en centros reales';
  end if;
  return new;
end;
$$;

create trigger mismo_mundo_veterinario_centro
  before insert or update on veterinario_centros
  for each row execute function public.validar_mundo_de_pruebas();

create trigger mismo_mundo_admin_centro
  before insert or update on admins_centro
  for each row execute function public.validar_mundo_de_pruebas();

-- ---------- solicitar_cita: mismo mundo ----------
-- Igual que en la migración 13, pero el centro debe ser del mismo mundo que la cuenta.
create or replace function public.solicitar_cita(
  p_mascota_id      bigint,
  p_centro_id       bigint,
  p_fecha_hora      timestamptz,
  p_motivo          text,
  p_sintomas        text[] default '{}',
  p_veterinario_id  bigint default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_local   timestamp := p_fecha_hora at time zone 'America/Santiago'; -- hora de Chile
  v_dia     smallint  := extract(isodow from v_local);                  -- 1 = lunes ... 7 = domingo
  v_hora    time      := v_local::time;
  v_horario public.horarios_centro%rowtype;
  v_cita_id bigint;
begin
  if not public.es_mi_mascota(p_mascota_id) then
    raise exception 'La mascota no es tuya';
  end if;

  if coalesce(trim(p_motivo), '') = '' then
    raise exception 'Cuéntanos el motivo de la consulta';
  end if;

  if p_fecha_hora <= now() then
    raise exception 'Elige una fecha y hora futura';
  end if;

  -- El centro debe estar aprobado y ser del mismo "mundo" que la cuenta:
  -- cuentas de prueba -> centros de prueba; cuentas reales -> centros reales.
  if not exists (
    select 1 from public.centros
    where id = p_centro_id and estado_verificacion = 'aprobado'
      and es_prueba = public.es_cuenta_de_prueba()
  ) then
    raise exception 'El centro no está disponible';
  end if;

  -- Horario del centro: si el centro registró horarios, la hora debe calzar
  if exists (select 1 from public.horarios_centro where centro_id = p_centro_id) then
    select * into v_horario
    from public.horarios_centro
    where centro_id = p_centro_id and dia_semana = v_dia;

    if not found then
      raise exception 'El centro no atiende ese día';
    end if;
    if v_hora < v_horario.abre or v_hora >= v_horario.cierra then
      raise exception 'El centro atiende ese día de % a %',
        to_char(v_horario.abre, 'HH24:MI'), to_char(v_horario.cierra, 'HH24:MI');
    end if;
    if v_horario.inicio_colacion is not null
       and v_hora >= v_horario.inicio_colacion and v_hora < v_horario.fin_colacion then
      raise exception 'Esa hora cae en la colación del centro (% a %)',
        to_char(v_horario.inicio_colacion, 'HH24:MI'), to_char(v_horario.fin_colacion, 'HH24:MI');
    end if;
  end if;

  if p_veterinario_id is not null and not exists (
    select 1 from public.veterinario_centros vc
    join public.veterinarios v on v.id = vc.veterinario_id
    where vc.centro_id = p_centro_id and vc.veterinario_id = p_veterinario_id
      and v.estado_verificacion = 'aprobado'
  ) then
    raise exception 'Ese veterinario no atiende en este centro';
  end if;

  begin
    insert into public.citas (mascota_id, centro_id, veterinario_id, fecha_hora, motivo, sintomas_reportados)
    values (p_mascota_id, p_centro_id, p_veterinario_id, p_fecha_hora, trim(p_motivo),
            coalesce(p_sintomas, '{}'))
    returning id into v_cita_id;
  exception when unique_violation then
    -- índice citas_sin_choque_horario: el veterinario ya tiene una cita a esa hora
    raise exception 'El veterinario ya tiene una cita a esa hora. Prueba con otra.';
  end;

  return v_cita_id;
end;
$$;

-- ---------- listar_usuarios ahora también dice si la cuenta es de prueba ----------
-- (Cambia lo que devuelve, por eso se borra y se vuelve a crear.)
drop function public.listar_usuarios();

create function public.listar_usuarios()
returns table (
  id              uuid,
  nombre          text,
  email           text,
  rol             public.rol_usuario,
  telefono        bigint,
  es_prueba       boolean,
  desactivado_en  timestamptz,
  creado_en       timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede ver la lista de usuarios';
  end if;

  return query
    select p.id, p.nombre, u.email::text, p.rol, p.telefono, p.es_prueba, p.desactivado_en, p.creado_en
    from public.perfiles p
    join auth.users u on u.id = p.id
    order by p.creado_en desc;
end;
$$;

revoke execute on function public.listar_usuarios from public, anon;
grant  execute on function public.listar_usuarios to authenticated;
