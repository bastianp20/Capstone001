-- =====================================================================
-- AuraPet — 26: Detalle completo de un centro (solo superadmin)
--
-- Para el botón "Ver detalles" de Superadmin → Centros. Junta en UNA llamada:
--   · datos del centro, verificación (quién y cuándo) y tipo (real / prueba)
--   · horario por día y especialidades
--   · suscripción (plan, estado, fin de la prueba) — migración 24
--   · administradores (con su correo) y veterinarios que atienden ahí
--   · actividad: citas (total, hoy, próximas, completadas, canceladas),
--     pacientes distintos y últimas 5 citas
--   · solicitud de origen, si el centro llegó por /solicitar-centro (migración 20)
-- Devuelve jsonb: se le da forma en Api/getInfo.tsx (getDetalleCentro).
-- =====================================================================

create function public.detalle_centro(p_centro_id bigint)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_resultado jsonb;
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede ver el detalle de un centro';
  end if;

  select jsonb_build_object(
    -- ---------- Datos ----------
    'centro', (
      select jsonb_build_object(
        'id', c.id, 'nombre', c.nombre, 'direccion', c.direccion, 'comuna', c.comuna, 'telefono', c.telefono,
        'estado', c.estado_verificacion, 'es_prueba', c.es_prueba, 'creado_en', c.creado_en,
        'revisado_por', r.nombre, 'revisado_en', c.revisado_en, 'motivo_rechazo', c.motivo_rechazo
      )
      from public.centros c
      left join public.perfiles r on r.id = c.revisado_por
      where c.id = p_centro_id
    ),

    -- ---------- Horario y especialidades ----------
    'horarios', coalesce((
      select jsonb_agg(jsonb_build_object(
        'dia', h.dia_semana, 'abre', h.abre, 'cierra', h.cierra,
        'inicio_colacion', h.inicio_colacion, 'fin_colacion', h.fin_colacion
      ) order by h.dia_semana)
      from public.horarios_centro h where h.centro_id = p_centro_id
    ), '[]'::jsonb),
    'especialidades', coalesce((
      select jsonb_agg(e.nombre order by e.nombre)
      from public.centro_especialidades ce
      join public.especialidades e on e.id = ce.especialidad_id
      where ce.centro_id = p_centro_id
    ), '[]'::jsonb),

    -- ---------- Suscripción ----------
    'suscripcion', (
      select jsonb_build_object(
        'plan', pl.nombre, 'precio', pl.precio_mensual, 'estado', s.estado,
        'fin_prueba', s.fin_prueba, 'renovacion', s.renovacion,
        'plan_solicitado', (select p2.nombre from public.solicitudes_plan sp
                            join public.planes p2 on p2.id = sp.plan_id
                            where sp.centro_id = p_centro_id and sp.estado = 'pendiente' limit 1)
      )
      from public.suscripciones_centro s
      join public.planes pl on pl.id = s.plan_id
      where s.centro_id = p_centro_id
    ),

    -- ---------- Personas ----------
    'administradores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'nombre', p.nombre, 'email', u.email, 'rol', p.rol, 'desde', a.asignado_en
      ) order by p.nombre)
      from public.admins_centro a
      join public.perfiles p on p.id = a.perfil_id
      join auth.users u     on u.id = p.id
      where a.centro_id = p_centro_id
    ), '[]'::jsonb),
    'veterinarios', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'nombre', coalesce(p.nombre, 'Veterinario sin cuenta'),
        'especialidad', coalesce(e.nombre, v.especialidad_otra),
        'numero_colegiado', v.numero_colegiado, 'estado', v.estado_verificacion
      ) order by p.nombre)
      from public.veterinario_centros vc
      join public.veterinarios v        on v.id = vc.veterinario_id
      left join public.perfiles p       on p.id = v.perfil_id
      left join public.especialidades e on e.id = v.especialidad_id
      where vc.centro_id = p_centro_id
    ), '[]'::jsonb),

    -- ---------- Actividad ----------
    'citas', (
      select jsonb_build_object(
        'total', count(*),
        'hoy', count(*) filter (where c.fecha_hora::date = current_date and c.estado <> 'cancelada'),
        'proximas', count(*) filter (where c.fecha_hora >= now() and c.estado in ('pendiente', 'confirmada')),
        'completadas', count(*) filter (where c.estado = 'completada'),
        'canceladas', count(*) filter (where c.estado = 'cancelada'),
        'pacientes', count(distinct c.mascota_id)
      )
      from public.citas c where c.centro_id = p_centro_id
    ),
    'ultimas_citas', coalesce((
      select jsonb_agg(x order by x->>'fecha_hora' desc)
      from (
        select jsonb_build_object(
          'id', c.id, 'fecha_hora', c.fecha_hora, 'estado', c.estado,
          'mascota', m.nombre, 'dueno', pd.nombre, 'veterinario', pv.nombre
        ) as x
        from public.citas c
        join public.mascotas m          on m.id = c.mascota_id
        left join public.perfiles pd    on pd.id = m.dueno_id
        left join public.veterinarios v on v.id = c.veterinario_id
        left join public.perfiles pv    on pv.id = v.perfil_id
        where c.centro_id = p_centro_id
        order by c.fecha_hora desc
        limit 5
      ) ultimas
    ), '[]'::jsonb),

    -- ---------- Origen (si llegó por /solicitar-centro) ----------
    'solicitud_origen', (
      select jsonb_build_object(
        'nombre_responsable', sc.nombre_responsable, 'cargo', sc.cargo, 'correo', sc.correo,
        'telefono', sc.telefono_responsable, 'sitio_web', sc.sitio_web, 'mensaje', sc.mensaje,
        'creado_en', sc.creado_en
      )
      from public.solicitudes_centro sc
      where sc.centro_id = p_centro_id
      order by sc.creado_en desc
      limit 1
    )
  ) into v_resultado;

  if v_resultado->'centro' is null or v_resultado->'centro' = 'null'::jsonb then
    raise exception 'El centro no existe';
  end if;

  return v_resultado;
end;
$$;

revoke execute on function public.detalle_centro from public, anon;
grant  execute on function public.detalle_centro to authenticated;
