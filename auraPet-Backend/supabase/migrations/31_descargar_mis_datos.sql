-- =====================================================================
-- AuraPet — 31: "Descargar mis datos" (Configuración → Privacidad y datos)
--
-- Devuelve en un solo JSON lo que AuraPet guarda de la persona conectada
-- (Ley 19.628 / derecho de acceso): su cuenta y, según corresponda, sus
-- mascotas con citas, historial, recetas y derivaciones, y su ficha
-- profesional. Solo los datos propios: siempre se usa auth.uid().
-- =====================================================================

create function public.mis_datos()
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
            'fecha_hora', c.fecha_hora, 'centro', ce.nombre, 'motivo', c.motivo, 'estado', c.estado,
            'motivo_cancelacion', c.motivo_cancelacion) order by c.fecha_hora desc)
          from public.citas c join public.centros ce on ce.id = c.centro_id
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

revoke execute on function public.mis_datos from public, anon;
grant  execute on function public.mis_datos to authenticated;
