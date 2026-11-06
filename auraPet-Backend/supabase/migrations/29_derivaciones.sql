-- =====================================================================
-- AuraPet — 29: Derivaciones
--
-- Un veterinario deriva a su paciente a OTRO veterinario o a un CENTRO
-- (la tabla derivaciones existe desde la migración 01). Al derivar:
--   · se agrega un registro al historial ("Derivado a …: motivo"),
--   · el destino pasa a ver la ficha del paciente (es_mi_paciente),
--   · el destino la marca "realizada" con el resultado, o la rechaza;
--     quien derivó puede cancelarla mientras esté pendiente.
-- El dueño ve las derivaciones de sus mascotas y en qué quedaron.
-- =====================================================================

-- ---------- ¿Me derivaron esta mascota? ----------
-- A mí, o a un centro donde atiendo. Las canceladas no cuentan.
create function public.me_derivaron(p_mascota_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.derivaciones d
    join public.registros_medicos r on r.id = d.registro_id
    where r.mascota_id = p_mascota_id
      and d.estado <> 'cancelada'
      and (d.a_veterinario_id = public.mi_veterinario_id()
           or d.a_centro_id in (select vc.centro_id from public.veterinario_centros vc
                                where vc.veterinario_id = public.mi_veterinario_id()))
  );
$$;

revoke execute on function public.me_derivaron from public, anon;
grant  execute on function public.me_derivaron to authenticated;

-- es_mi_paciente (migración 19): ahora también si me lo derivaron.
-- Así el destino puede ver el historial, agregar registros y recetar.
create or replace function public.es_mi_paciente(p_mascota_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.citas
    where mascota_id = p_mascota_id
      and veterinario_id = public.mi_veterinario_id()
      and estado in ('confirmada', 'en_curso', 'completada')
  ) or public.me_derivaron(p_mascota_id);
$$;

-- El destino ve la mascota y el nombre/teléfono de su dueño (para la ficha)
create policy "el veterinario ve las mascotas que le derivaron"
  on mascotas for select to authenticated
  using (public.me_derivaron(id));

-- (con función security definer para no encadenar políticas perfiles → mascotas)
create function public.es_dueno_de_mis_derivados(p_perfil_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.mascotas m where m.dueno_id = p_perfil_id and public.me_derivaron(m.id));
$$;

revoke execute on function public.es_dueno_de_mis_derivados from public, anon;
grant  execute on function public.es_dueno_de_mis_derivados to authenticated;

create policy "el veterinario ve al dueño de las mascotas que le derivaron"
  on perfiles for select to authenticated
  using (public.es_dueno_de_mis_derivados(id));

-- ---------- A quién se puede derivar ----------
-- Veterinarios y centros aprobados, del mismo "mundo" (real / prueba), sin uno mismo.
create function public.destinos_derivacion()
returns table (tipo text, id bigint, nombre text, detalle text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if public.mi_veterinario_id() is null then
    raise exception 'Solo los veterinarios pueden derivar';
  end if;

  return query
    select 'veterinario'::text, v.id, p.nombre, coalesce(e.nombre, v.especialidad_otra, 'Medicina general')
    from public.veterinarios v
    join public.perfiles p on p.id = v.perfil_id
    left join public.especialidades e on e.id = v.especialidad_id
    where v.estado_verificacion = 'aprobado'
      and v.id <> public.mi_veterinario_id()
      and p.desactivado_en is null
      and p.es_prueba = public.es_cuenta_de_prueba()
    union all
    select 'centro'::text, c.id, c.nombre, c.comuna
    from public.centros c
    where c.estado_verificacion = 'aprobado'
      and c.es_prueba = public.es_cuenta_de_prueba()
    order by 1 desc, 3;
end;
$$;

revoke execute on function public.destinos_derivacion from public, anon;
grant  execute on function public.destinos_derivacion to authenticated;

-- ---------- Derivar ----------
create function public.crear_derivacion(
  p_mascota_id       bigint,
  p_motivo           text,
  p_a_veterinario_id bigint default null,
  p_a_centro_id      bigint default null
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_destino     text;
  v_registro_id bigint;
  v_id          bigint;
begin
  if not public.es_mi_paciente(p_mascota_id) then
    raise exception 'Esta mascota no es tu paciente';
  end if;
  if num_nonnulls(p_a_veterinario_id, p_a_centro_id) <> 1 then
    raise exception 'Elige un veterinario o un centro (solo uno)';
  end if;
  if nullif(trim(p_motivo), '') is null then
    raise exception 'Escribe el motivo de la derivación';
  end if;
  if p_a_veterinario_id = public.mi_veterinario_id() then
    raise exception 'No puedes derivarte a ti mismo';
  end if;

  if p_a_veterinario_id is not null then
    select p.nombre into v_destino
    from public.veterinarios v join public.perfiles p on p.id = v.perfil_id
    where v.id = p_a_veterinario_id and v.estado_verificacion = 'aprobado';
  else
    select c.nombre into v_destino
    from public.centros c where c.id = p_a_centro_id and c.estado_verificacion = 'aprobado';
  end if;
  if v_destino is null then
    raise exception 'Ese destino no existe o no está verificado';
  end if;

  if exists (
    select 1 from public.derivaciones d join public.registros_medicos r on r.id = d.registro_id
    where r.mascota_id = p_mascota_id and d.estado = 'pendiente'
      and (d.a_veterinario_id = p_a_veterinario_id or d.a_centro_id = p_a_centro_id)
  ) then
    raise exception 'Ya hay una derivación pendiente de esta mascota a %', v_destino;
  end if;

  -- El registro en el historial (veterinario y centro los pone agregar_registro_medico)
  v_registro_id := public.agregar_registro_medico(
    p_mascota_id, 'otro', 'Derivado a ' || v_destino || ': ' || left(trim(p_motivo), 500)
  );

  insert into public.derivaciones (registro_id, a_veterinario_id, a_centro_id, motivo)
  values (v_registro_id, p_a_veterinario_id, p_a_centro_id, left(trim(p_motivo), 500))
  returning id into v_id;

  return v_id;
end;
$$;

revoke execute on function public.crear_derivacion from public, anon;
grant  execute on function public.crear_derivacion to authenticated;

-- ---------- Responder / cancelar ----------
-- p_realizada = true  → el destino la marca realizada (resultado obligatorio)
-- p_realizada = false → el destino la rechaza, o quien derivó la cancela
create function public.responder_derivacion(p_derivacion_id bigint, p_realizada boolean, p_resultado text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_d           public.derivaciones%rowtype;
  v_origen      bigint;
  v_soy_destino boolean;
begin
  select * into v_d from public.derivaciones where id = p_derivacion_id for update;
  if not found or v_d.estado <> 'pendiente' then
    raise exception 'Esa derivación ya no está pendiente';
  end if;

  select r.veterinario_id into v_origen from public.registros_medicos r where r.id = v_d.registro_id;

  v_soy_destino := v_d.a_veterinario_id = public.mi_veterinario_id()
    or v_d.a_centro_id in (select vc.centro_id from public.veterinario_centros vc
                           where vc.veterinario_id = public.mi_veterinario_id());

  if p_realizada then
    if not coalesce(v_soy_destino, false) then
      raise exception 'Solo el destino puede marcarla como realizada';
    end if;
    if nullif(trim(p_resultado), '') is null then
      raise exception 'Escribe el resultado de la atención';
    end if;
  elsif not (coalesce(v_soy_destino, false) or v_origen = public.mi_veterinario_id()) then
    raise exception 'Esta derivación no es tuya';
  end if;

  update public.derivaciones
     set estado = case when p_realizada then 'realizada'::public.estado_derivacion else 'cancelada'::public.estado_derivacion end,
         resultado = nullif(left(trim(p_resultado), 1000), '')
   where id = p_derivacion_id;
end;
$$;

revoke execute on function public.responder_derivacion from public, anon;
grant  execute on function public.responder_derivacion to authenticated;

-- ---------- Listados ----------
-- Todas las derivaciones de un paciente (ficha) o de las mascotas del dueño
-- (p_mascota_id null = todas mis mascotas, vista del dueño).
create function public.listar_derivaciones(p_mascota_id bigint default null)
returns table (
  id           bigint,
  mascota_id   bigint,
  mascota      text,
  creada_en    timestamptz,
  origen       text,                 -- quién derivó
  destino      text,
  destino_tipo text,                 -- 'veterinario' | 'centro'
  motivo       text,
  estado       public.estado_derivacion,
  resultado    text,
  puedo_responder boolean,           -- soy el destino y está pendiente
  puedo_cancelar  boolean            -- la hice yo y está pendiente
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if p_mascota_id is null then
    -- Dueño: todas las de sus mascotas
    return query
      select d.id, m.id, m.nombre, d.creada_en, po.nombre,
             coalesce(pd.nombre, c.nombre), case when d.a_veterinario_id is not null then 'veterinario' else 'centro' end,
             d.motivo, d.estado, d.resultado, false, false
      from public.derivaciones d
      join public.registros_medicos r on r.id = d.registro_id
      join public.mascotas m on m.id = r.mascota_id
      left join public.veterinarios vo on vo.id = r.veterinario_id
      left join public.perfiles po on po.id = vo.perfil_id
      left join public.veterinarios vd on vd.id = d.a_veterinario_id
      left join public.perfiles pd on pd.id = vd.perfil_id
      left join public.centros c on c.id = d.a_centro_id
      where m.dueno_id = auth.uid()
      order by d.creada_en desc;
    return;
  end if;

  if not (public.es_mi_paciente(p_mascota_id) or public.es_mi_mascota(p_mascota_id) or public.es_superadmin()) then
    raise exception 'No puedes ver las derivaciones de esta mascota';
  end if;

  return query
    select d.id, m.id, m.nombre, d.creada_en, po.nombre,
           coalesce(pd.nombre, c.nombre), case when d.a_veterinario_id is not null then 'veterinario' else 'centro' end,
           d.motivo, d.estado, d.resultado,
           d.estado = 'pendiente' and (d.a_veterinario_id = public.mi_veterinario_id()
             or d.a_centro_id in (select vc.centro_id from public.veterinario_centros vc where vc.veterinario_id = public.mi_veterinario_id())),
           d.estado = 'pendiente' and r.veterinario_id = public.mi_veterinario_id()
    from public.derivaciones d
    join public.registros_medicos r on r.id = d.registro_id
    join public.mascotas m on m.id = r.mascota_id
    left join public.veterinarios vo on vo.id = r.veterinario_id
    left join public.perfiles po on po.id = vo.perfil_id
    left join public.veterinarios vd on vd.id = d.a_veterinario_id
    left join public.perfiles pd on pd.id = vd.perfil_id
    left join public.centros c on c.id = d.a_centro_id
    where m.id = p_mascota_id
    order by d.creada_en desc;
end;
$$;

revoke execute on function public.listar_derivaciones from public, anon;
grant  execute on function public.listar_derivaciones to authenticated;

-- Las del veterinario: recibidas (a mí o a mis centros) y enviadas por mí
create function public.mis_derivaciones()
returns table (
  id           bigint,
  direccion    text,                 -- 'recibida' | 'enviada'
  mascota_id   bigint,
  mascota      text,
  especie      public.especie_mascota,
  dueno        text,
  creada_en    timestamptz,
  origen       text,
  destino      text,
  motivo       text,
  estado       public.estado_derivacion,
  resultado    text
)
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_yo bigint := public.mi_veterinario_id();
begin
  if v_yo is null then
    raise exception 'Solo los veterinarios tienen derivaciones';
  end if;

  return query
    select d.id,
           case when r.veterinario_id = v_yo then 'enviada' else 'recibida' end,
           m.id, m.nombre, m.especie, pdu.nombre, d.creada_en, po.nombre,
           coalesce(pd.nombre, c.nombre), d.motivo, d.estado, d.resultado
    from public.derivaciones d
    join public.registros_medicos r on r.id = d.registro_id
    join public.mascotas m on m.id = r.mascota_id
    left join public.perfiles pdu on pdu.id = m.dueno_id
    left join public.veterinarios vo on vo.id = r.veterinario_id
    left join public.perfiles po on po.id = vo.perfil_id
    left join public.veterinarios vd on vd.id = d.a_veterinario_id
    left join public.perfiles pd on pd.id = vd.perfil_id
    left join public.centros c on c.id = d.a_centro_id
    where r.veterinario_id = v_yo
       or d.a_veterinario_id = v_yo
       or d.a_centro_id in (select vc.centro_id from public.veterinario_centros vc where vc.veterinario_id = v_yo)
    order by (d.estado <> 'pendiente'), d.creada_en desc;
end;
$$;

revoke execute on function public.mis_derivaciones from public, anon;
grant  execute on function public.mis_derivaciones to authenticated;
