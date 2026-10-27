-- =====================================================================
-- AuraPet — 35: Veterinarios independientes al pedir hora + especialidad
--
-- · Un veterinario "independiente" es uno aprobado que no trabaja en ningún
--   centro. Ahora el dueño puede pedirle hora directamente: la cita queda
--   SIN centro (citas.centro_id = null = atención independiente).
-- · Al elegir profesional se muestra su especialidad, también la que
--   escribió a mano ("Otra": etología, etc.).
-- · Las funciones que listaban citas con un join obligatorio a centros
--   (listar_citas, detalle_usuario, mis_datos) pasan a left join, para no
--   esconder las citas independientes.
-- =====================================================================

alter table citas alter column centro_id drop not null;

-- Especialidad para mostrar: la del catálogo o la que escribió ("Otra")
create function public.especialidad_de_veterinario(p_veterinario_id bigint)
returns text
language sql stable security definer set search_path = ''
as $$
  select coalesce(e.nombre, nullif(trim(v.especialidad_otra), ''))
  from public.veterinarios v
  left join public.especialidades e on e.id = v.especialidad_id
  where v.id = p_veterinario_id;
$$;

revoke execute on function public.especialidad_de_veterinario from public, anon;
grant  execute on function public.especialidad_de_veterinario to authenticated;

-- ---------- Veterinarios de un centro (migración 13), ahora con "Otra" especialidad ----------
create or replace function public.veterinarios_de_centro(p_centro_id bigint)
returns table (id bigint, nombre text, especialidad text)
language sql stable
security definer set search_path = ''
as $$
  select v.id, p.nombre, public.especialidad_de_veterinario(v.id)
  from public.veterinario_centros vc
  join public.veterinarios v on v.id = vc.veterinario_id
  join public.perfiles p on p.id = v.perfil_id
  where vc.centro_id = p_centro_id
    and v.estado_verificacion = 'aprobado'
    and p.desactivado_en is null
  order by p.nombre;
$$;

-- ---------- Veterinarios independientes (sin centro), del mismo "mundo" que la cuenta ----------
create function public.veterinarios_independientes()
returns table (id bigint, nombre text, especialidad text)
language sql stable
security definer set search_path = ''
as $$
  select v.id, p.nombre, public.especialidad_de_veterinario(v.id)
  from public.veterinarios v
  join public.perfiles p on p.id = v.perfil_id
  where v.estado_verificacion = 'aprobado'
    and p.desactivado_en is null
    and p.es_prueba = public.es_cuenta_de_prueba()
    and not exists (select 1 from public.veterinario_centros vc where vc.veterinario_id = v.id)
  order by p.nombre;
$$;

revoke execute on function public.veterinarios_independientes from public, anon;
grant  execute on function public.veterinarios_independientes to authenticated;

-- ---------- solicitar_cita (migración 14): centro o veterinario independiente ----------
-- Misma firma: p_centro_id = null significa "atención independiente" y
-- entonces el veterinario es obligatorio y debe ser independiente.
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

  if p_centro_id is null then
    -- Atención independiente: el veterinario es obligatorio, aprobado, sin
    -- centro y del mismo "mundo" (real / prueba) que la cuenta
    if p_veterinario_id is null then
      raise exception 'Elige el veterinario independiente que te atenderá';
    end if;
    if not exists (select 1 from public.veterinarios_independientes() vi where vi.id = p_veterinario_id) then
      raise exception 'Ese veterinario no está disponible para atención independiente';
    end if;
  else
    -- El centro debe estar aprobado y ser del mismo "mundo" que la cuenta
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

-- Atajo para el front: pedir hora con un veterinario independiente (sin
-- centro). Existe para no tener que mandar p_centro_id = null a mano.
create function public.solicitar_cita_independiente(
  p_mascota_id      bigint,
  p_veterinario_id  bigint,
  p_fecha_hora      timestamptz,
  p_motivo          text,
  p_sintomas        text[] default '{}'
)
returns bigint
language sql
security definer
set search_path = ''
as $$
  select public.solicitar_cita(p_mascota_id, null, p_fecha_hora, p_motivo, p_sintomas, p_veterinario_id);
$$;

revoke execute on function public.solicitar_cita_independiente from public, anon;
grant  execute on function public.solicitar_cita_independiente to authenticated;

-- ---------- Listados de citas: las independientes ya no se esconden ----------
create or replace function public.listar_citas(
  p_busqueda  text default null,
  p_estado    public.estado_cita default null,
  p_urgencia  public.urgencia_cita default null,
  p_desde     timestamptz default null,
  p_hasta     timestamptz default null,
  p_orden     text default 'recientes',
  p_limite    int default 20,
  p_offset    int default 0
)
returns table (
  id              bigint,
  fecha_hora      timestamptz,
  estado          public.estado_cita,
  urgencia        public.urgencia_cita,
  motivo          text,
  mascota         text,
  especie         public.especie_mascota,
  dueno           text,
  veterinario     text,
  centro          text,
  es_prueba       boolean,
  total           bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_busqueda text := nullif(trim(p_busqueda), '');
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede ver todas las citas';
  end if;

  return query
    select c.id, c.fecha_hora, c.estado,
           coalesce(c.urgencia, c.urgencia_sugerida) as urgencia,
           c.motivo, m.nombre, m.especie, pd.nombre, pv.nombre,
           coalesce(ce.nombre, 'Atención independiente'), coalesce(ce.es_prueba, pv.es_prueba, false),
           count(*) over () as total
    from public.citas c
    join public.mascotas m        on m.id = c.mascota_id
    left join public.perfiles pd  on pd.id = m.dueno_id
    left join public.veterinarios v on v.id = c.veterinario_id
    left join public.perfiles pv  on pv.id = v.perfil_id
    left join public.centros ce   on ce.id = c.centro_id      -- null = atención independiente
    where (p_estado is null or c.estado = p_estado)
      and (p_urgencia is null or coalesce(c.urgencia, c.urgencia_sugerida) = p_urgencia)
      and (p_desde is null or c.fecha_hora >= p_desde)
      and (p_hasta is null or c.fecha_hora < p_hasta)
      and (v_busqueda is null
           or m.nombre  ilike '%' || v_busqueda || '%'
           or pd.nombre ilike '%' || v_busqueda || '%'
           or pv.nombre ilike '%' || v_busqueda || '%'
           or ce.nombre ilike '%' || v_busqueda || '%')
    order by
      case when p_orden = 'proximas' then c.fecha_hora end asc,
      case when p_orden <> 'proximas' then c.fecha_hora end desc
    limit greatest(1, least(p_limite, 100))
    offset greatest(0, p_offset);
end;
$$;

create or replace function public.detalle_usuario(p_perfil_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_vet_id    bigint;
  v_resultado jsonb;
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede ver el detalle de un usuario';
  end if;

  select id into v_vet_id from public.veterinarios where perfil_id = p_perfil_id;

  select jsonb_build_object(
    -- ---------- Cuenta ----------
    'cuenta', (
      select jsonb_build_object(
        'id', p.id, 'nombre', p.nombre, 'email', u.email, 'rol', p.rol, 'telefono', p.telefono,
        'es_prueba', p.es_prueba, 'desactivado_en', p.desactivado_en, 'creado_en', p.creado_en,
        'ultimo_acceso', u.last_sign_in_at, 'correo_confirmado', u.email_confirmed_at is not null
      )
      from public.perfiles p
      join auth.users u on u.id = p.id
      where p.id = p_perfil_id
    ),

    -- ---------- Ficha profesional ----------
    'veterinario', (
      select jsonb_build_object(
        'estado', v.estado_verificacion,
        'especialidad', coalesce(e.nombre, v.especialidad_otra),
        'numero_colegiado', v.numero_colegiado,
        'revisado_por', r.nombre,
        'revisado_en', v.revisado_en,
        'motivo_rechazo', v.motivo_rechazo,
        'centro_solicitado', cs.nombre,
        'centro_mencionado', v.centro_mencionado,
        'centro_mencionado_comuna', v.centro_mencionado_comuna
      )
      from public.veterinarios v
      left join public.especialidades e on e.id = v.especialidad_id
      left join public.perfiles r       on r.id = v.revisado_por
      left join public.centros cs       on cs.id = v.centro_solicitado_id
      where v.id = v_vet_id
    ),

    -- ---------- Centros ----------
    'centros_atiende', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'nombre', c.nombre, 'comuna', c.comuna, 'es_prueba', c.es_prueba) order by c.nombre)
      from public.veterinario_centros vc
      join public.centros c on c.id = vc.centro_id
      where vc.veterinario_id = v_vet_id
    ), '[]'::jsonb),
    'centros_administra', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'nombre', c.nombre, 'comuna', c.comuna, 'es_prueba', c.es_prueba) order by c.nombre)
      from public.admins_centro a
      join public.centros c on c.id = a.centro_id
      where a.perfil_id = p_perfil_id
    ), '[]'::jsonb),

    -- ---------- Mascotas (dueño) ----------
    'mascotas', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'nombre', m.nombre, 'especie', m.especie, 'raza', m.raza,
        'sexo', m.sexo, 'fecha_nacimiento', m.fecha_nacimiento
      ) order by m.nombre)
      from public.mascotas m
      where m.dueno_id = p_perfil_id
    ), '[]'::jsonb),

    -- ---------- Actividad ----------
    -- Citas "suyas": las que atiende (veterinario) o las de sus mascotas (dueño)
    'citas', (
      select jsonb_build_object(
        'total', count(*),
        'proximas', count(*) filter (where c.fecha_hora >= now() and c.estado in ('pendiente', 'confirmada')),
        'completadas', count(*) filter (where c.estado = 'completada'),
        'canceladas', count(*) filter (where c.estado = 'cancelada')
      )
      from public.citas c
      where c.veterinario_id = v_vet_id
         or c.mascota_id in (select id from public.mascotas where dueno_id = p_perfil_id)
    ),
    'ultimas_citas', coalesce((
      select jsonb_agg(x order by x->>'fecha_hora' desc)
      from (
        select jsonb_build_object(
          'id', c.id, 'fecha_hora', c.fecha_hora, 'estado', c.estado,
          'mascota', m.nombre, 'centro', coalesce(ce.nombre, 'Atención independiente'), 'veterinario', pv.nombre
        ) as x
        from public.citas c
        join public.mascotas m        on m.id = c.mascota_id
        left join public.centros ce   on ce.id = c.centro_id
        left join public.veterinarios v on v.id = c.veterinario_id
        left join public.perfiles pv  on pv.id = v.perfil_id
        where c.veterinario_id = v_vet_id
           or c.mascota_id in (select id from public.mascotas where dueno_id = p_perfil_id)
        order by c.fecha_hora desc
        limit 5
      ) ultimas
    ), '[]'::jsonb),
    'recetas_emitidas', (
      select count(*) from public.recetas where veterinario_id = v_vet_id
    )
  ) into v_resultado;

  if v_resultado->'cuenta' is null or v_resultado->'cuenta' = 'null'::jsonb then
    raise exception 'El usuario no existe';
  end if;

  return v_resultado;
end;
$$;

create or replace function public.mis_datos()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_yo   uuid := auth.uid();
  v_vet  bigint := public.mi_veterinario_id();
begin
  if v_yo is null then
    raise exception 'Debes iniciar sesión';
  end if;

  return jsonb_build_object(
    'generado_en', now(),
    'cuenta', (
      select jsonb_build_object(
        'nombre', p.nombre, 'correo', u.email, 'rol', p.rol, 'telefono', p.telefono,
        'creada_en', p.creado_en, 'ultimo_ingreso', u.last_sign_in_at)
      from public.perfiles p join auth.users u on u.id = p.id
      where p.id = v_yo
    ),
    'mascotas', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nombre', m.nombre, 'especie', m.especie, 'raza', m.raza, 'sexo', m.sexo,
        'fecha_nacimiento', m.fecha_nacimiento, 'peso_kg', m.peso_kg, 'esterilizado', m.esterilizado,
        'alergias', m.alergias, 'condiciones_cronicas', m.condiciones_cronicas, 'microchip', m.microchip,
        'citas', coalesce((
          select jsonb_agg(jsonb_build_object(
            'fecha_hora', c.fecha_hora, 'centro', coalesce(ce.nombre, 'Atención independiente'), 'motivo', c.motivo, 'estado', c.estado,
            'motivo_cancelacion', c.motivo_cancelacion) order by c.fecha_hora desc)
          from public.citas c left join public.centros ce on ce.id = c.centro_id
          where c.mascota_id = m.id), '[]'::jsonb),
        'historial', coalesce((
          select jsonb_agg(jsonb_build_object(
            'fecha', r.fecha, 'tipo', r.tipo, 'descripcion', r.descripcion,
            'tratamiento', r.tratamiento, 'proxima_dosis', r.proxima_dosis) order by r.fecha desc)
          from public.registros_medicos r where r.mascota_id = m.id), '[]'::jsonb),
        'recetas', coalesce((
          select jsonb_agg(jsonb_build_object(
            'fecha', re.creada_en, 'indicaciones', re.indicaciones, 'proximo_control', re.proximo_control,
            'medicamentos', coalesce((
              select jsonb_agg(jsonb_build_object('nombre', rm.nombre, 'dosis', rm.dosis,
                                                  'frecuencia', rm.frecuencia, 'duracion', rm.duracion))
              from public.receta_medicamentos rm where rm.receta_id = re.id), '[]'::jsonb)
          ) order by re.creada_en desc)
          from public.recetas re where re.mascota_id = m.id), '[]'::jsonb),
        'derivaciones', coalesce((
          select jsonb_agg(jsonb_build_object(
            'fecha', d.creada_en, 'motivo', d.motivo, 'estado', d.estado, 'resultado', d.resultado)
            order by d.creada_en desc)
          from public.derivaciones d join public.registros_medicos r on r.id = d.registro_id
          where r.mascota_id = m.id), '[]'::jsonb)
      ) order by m.nombre)
      from public.mascotas m where m.dueno_id = v_yo
    ), '[]'::jsonb),
    'ficha_profesional', case when v_vet is null then null else (
      select jsonb_build_object(
        'numero_colegiado', v.numero_colegiado, 'especialidad', coalesce(e.nombre, v.especialidad_otra),
        'estado_verificacion', v.estado_verificacion,
        'centros', coalesce((
          select jsonb_agg(c.nombre order by c.nombre)
          from public.veterinario_centros vc join public.centros c on c.id = vc.centro_id
          where vc.veterinario_id = v.id), '[]'::jsonb),
        'citas_atendidas', (select count(*) from public.citas c where c.veterinario_id = v.id and c.estado = 'completada'),
        'registros_creados', (select count(*) from public.registros_medicos r where r.veterinario_id = v.id),
        'recetas_emitidas', (select count(*) from public.recetas re where re.veterinario_id = v.id))
      from public.veterinarios v left join public.especialidades e on e.id = v.especialidad_id
      where v.id = v_vet
    ) end,
    'mensajes_de_contacto', coalesce((
      select jsonb_agg(jsonb_build_object('fecha', mc.creado_en, 'asunto', mc.asunto, 'mensaje', mc.mensaje, 'estado', mc.estado)
                       order by mc.creado_en desc)
      from public.mensajes_contacto mc
      where lower(mc.correo) = lower((select email from auth.users where id = v_yo))
    ), '[]'::jsonb)
  );
end;
$$;
