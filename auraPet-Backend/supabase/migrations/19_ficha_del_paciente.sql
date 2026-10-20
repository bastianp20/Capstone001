-- =====================================================================
-- AuraPet — 19: La ficha del paciente para el veterinario
--
-- La "ficha" de una mascota no es una tabla aparte: son sus datos clínicos
-- (en mascotas) + su historial (registros_medicos). Esta migración deja que
-- el veterinario TRATANTE la use:
--   · Ver el historial completo de la mascota, incluso lo que registraron
--     otros veterinarios o centros (función historial_de_paciente).
--   · Agregar registros al historial (función agregar_registro_medico).
--     No se pueden editar ni borrar: una corrección es un registro nuevo.
--   · Actualizar los datos clínicos: peso, alergias, condiciones crónicas,
--     esterilizado y microchip (función actualizar_datos_clinicos).
--     Nombre, dueño, especie, etc. siguen siendo cosa del dueño.
--
-- "Tratante" = tiene con esa mascota al menos una cita confirmada, en curso
-- o completada. Una solicitud pendiente o rechazada NO da acceso.
-- Igual que en la migración 12, no se da UPDATE/INSERT directo: las
-- funciones solo tocan lo necesario y revisan los permisos.
-- =====================================================================

-- ¿Atiendo (o atendí) a esta mascota?
create function public.es_mi_paciente(p_mascota_id bigint)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.citas
    where mascota_id = p_mascota_id
      and veterinario_id = public.mi_veterinario_id()
      and estado in ('confirmada', 'en_curso', 'completada')
  );
$$;

revoke execute on function public.es_mi_paciente from public, anon;
grant  execute on function public.es_mi_paciente to authenticated;

-- ---------- Historial completo del paciente ----------
-- Con el nombre de quién atendió y dónde, sin abrir las tablas perfiles
-- ni veterinarios al resto de los veterinarios.
create function public.historial_de_paciente(p_mascota_id bigint)
returns table (
  id             bigint,
  fecha          date,
  tipo           public.tipo_registro,
  descripcion    text,
  tratamiento    text,
  proxima_dosis  date,
  veterinario    text,
  centro         text,
  es_mio         boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.es_mi_paciente(p_mascota_id) then
    raise exception 'Esta mascota no es tu paciente';
  end if;

  return query
    select r.id, r.fecha, r.tipo, r.descripcion, r.tratamiento, r.proxima_dosis,
           p.nombre, c.nombre,
           r.veterinario_id = public.mi_veterinario_id()
    from public.registros_medicos r
    left join public.veterinarios v on v.id = r.veterinario_id
    left join public.perfiles p     on p.id = v.perfil_id
    left join public.centros c      on c.id = r.centro_id
    where r.mascota_id = p_mascota_id
    order by r.fecha desc, r.id desc;
end;
$$;

revoke execute on function public.historial_de_paciente from public, anon;
grant  execute on function public.historial_de_paciente to authenticated;

-- ---------- Agregar un registro al historial ----------
-- El veterinario y el centro los pone la base (no se pueden falsear):
-- el centro es el de la cita indicada o, si no se indica, el de la última
-- cita que tuvo con esta mascota.
create function public.agregar_registro_medico(
  p_mascota_id     bigint,
  p_tipo           public.tipo_registro,
  p_descripcion    text,
  p_tratamiento    text default null,
  p_proxima_dosis  date default null,
  p_fecha          date default current_date,
  p_cita_id        bigint default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_centro_id  bigint;
  v_id         bigint;
begin
  if not public.es_mi_paciente(p_mascota_id) then
    raise exception 'Esta mascota no es tu paciente';
  end if;

  if nullif(trim(p_descripcion), '') is null then
    raise exception 'Debes escribir una descripción';
  end if;

  if p_fecha > current_date then
    raise exception 'La fecha del registro no puede ser futura';
  end if;

  if p_proxima_dosis is not null and p_proxima_dosis <= p_fecha then
    raise exception 'La próxima dosis debe ser posterior a la fecha del registro';
  end if;

  if p_cita_id is not null then
    select centro_id into v_centro_id
    from public.citas
    where id = p_cita_id
      and mascota_id = p_mascota_id
      and veterinario_id = public.mi_veterinario_id();
    if not found then
      raise exception 'La cita no corresponde a esta mascota';
    end if;
  else
    select centro_id into v_centro_id
    from public.citas
    where mascota_id = p_mascota_id
      and veterinario_id = public.mi_veterinario_id()
      and estado in ('confirmada', 'en_curso', 'completada')
    order by fecha_hora desc
    limit 1;
  end if;

  insert into public.registros_medicos
    (mascota_id, cita_id, veterinario_id, centro_id, fecha, tipo, descripcion, tratamiento, proxima_dosis)
  values
    (p_mascota_id, p_cita_id, public.mi_veterinario_id(), v_centro_id, p_fecha, p_tipo,
     trim(p_descripcion), nullif(trim(p_tratamiento), ''), p_proxima_dosis)
  returning id into v_id;

  return v_id;
end;
$$;

revoke execute on function public.agregar_registro_medico from public, anon;
grant  execute on function public.agregar_registro_medico to authenticated;

-- ---------- Actualizar datos clínicos ----------
-- null = "no cambiar". Para borrar un texto (p. ej. ya no tiene alergias)
-- se manda '' (texto vacío).
create function public.actualizar_datos_clinicos(
  p_mascota_id            bigint,
  p_peso_kg               numeric default null,
  p_alergias              text    default null,
  p_condiciones_cronicas  text    default null,
  p_esterilizado          boolean default null,
  p_microchip             text    default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.es_mi_paciente(p_mascota_id) then
    raise exception 'Esta mascota no es tu paciente';
  end if;

  if p_peso_kg is not null and p_peso_kg <= 0 then
    raise exception 'El peso debe ser mayor a 0';
  end if;

  update public.mascotas
  set peso_kg              = coalesce(p_peso_kg, peso_kg),
      alergias             = case when p_alergias is null then alergias
                                  else nullif(trim(p_alergias), '') end,
      condiciones_cronicas = case when p_condiciones_cronicas is null then condiciones_cronicas
                                  else nullif(trim(p_condiciones_cronicas), '') end,
      esterilizado         = coalesce(p_esterilizado, esterilizado),
      microchip            = case when p_microchip is null then microchip
                                  else nullif(trim(p_microchip), '') end
  where id = p_mascota_id;
exception
  when unique_violation then
    raise exception 'Ese microchip ya está registrado en otra mascota';
end;
$$;

revoke execute on function public.actualizar_datos_clinicos from public, anon;
grant  execute on function public.actualizar_datos_clinicos to authenticated;
