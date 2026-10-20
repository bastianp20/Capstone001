-- =====================================================================
-- AuraPet — 25: Detalle completo de un usuario (solo superadmin)
--
-- Para el botón "Ver detalles" de Superadmin → Usuarios. Junta en UNA
-- llamada todo lo relacionado con la cuenta:
--   · cuenta: correo, teléfono, rol, estado, registro, último acceso
--     (correo y último acceso viven en auth.users: por eso es una función)
--   · ficha profesional (si es veterinario): verificación, especialidad,
--     colegiatura, quién la revisó, centro que pidió al registrarse
--   · centros donde atiende y centros que administra
--   · mascotas (si es dueño)
--   · actividad: conteo de citas y recetas, y sus últimas 5 citas
-- Devuelve jsonb: se lee y se le da forma en Api/getInfo.tsx (getDetalleUsuario).
-- =====================================================================

create function public.detalle_usuario(p_perfil_id uuid)
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
          'mascota', m.nombre, 'centro', ce.nombre, 'veterinario', pv.nombre
        ) as x
        from public.citas c
        join public.mascotas m        on m.id = c.mascota_id
        join public.centros ce        on ce.id = c.centro_id
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

revoke execute on function public.detalle_usuario from public, anon;
grant  execute on function public.detalle_usuario to authenticated;
