-- =====================================================================
-- AuraPet — 34: Datos de la ficha médica para el PDF
--
-- Todo lo que lleva la ficha descargable (ficha completa, resumen y
-- recetas) en un solo JSON: paciente, tutor, historial, recetas con sus
-- medicamentos y derivaciones, con los nombres de quién atendió y dónde.
-- La pueden pedir el dueño de la mascota, sus veterinarios tratantes (o a
-- quienes se la derivaron) y el superadmin.
-- =====================================================================

create function public.ficha_pdf(p_mascota_id bigint)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not (public.es_mi_mascota(p_mascota_id) or public.es_mi_paciente(p_mascota_id) or public.es_superadmin()) then
    raise exception 'No puedes ver la ficha de esta mascota';
  end if;

  return (
    select jsonb_build_object(
      'mascota', jsonb_build_object(
        'id', m.id, 'nombre', m.nombre, 'especie', m.especie, 'raza', m.raza, 'sexo', m.sexo,
        'fecha_nacimiento', m.fecha_nacimiento, 'peso_kg', m.peso_kg, 'esterilizado', m.esterilizado,
        'microchip', m.microchip, 'alergias', m.alergias, 'condiciones_cronicas', m.condiciones_cronicas),
      'tutor', jsonb_build_object('nombre', d.nombre, 'telefono', d.telefono),
      'historial', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', r.id, 'fecha', r.fecha, 'tipo', r.tipo, 'descripcion', r.descripcion,
          'tratamiento', r.tratamiento, 'proxima_dosis', r.proxima_dosis,
          'veterinario', pv.nombre, 'centro', c.nombre) order by r.fecha desc, r.id desc)
        from public.registros_medicos r
        left join public.veterinarios v on v.id = r.veterinario_id
        left join public.perfiles pv on pv.id = v.perfil_id
        left join public.centros c on c.id = r.centro_id
        where r.mascota_id = m.id), '[]'::jsonb),
      'recetas', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', re.id, 'fecha', re.creada_en, 'indicaciones', re.indicaciones,
          'proximo_control', re.proximo_control, 'veterinario', pv.nombre,
          'colegiado', v.numero_colegiado, 'centro', c.nombre,
          'medicamentos', coalesce((
            select jsonb_agg(jsonb_build_object('nombre', rm.nombre, 'dosis', rm.dosis,
                                                'frecuencia', rm.frecuencia, 'duracion', rm.duracion) order by rm.id)
            from public.receta_medicamentos rm where rm.receta_id = re.id), '[]'::jsonb)
        ) order by re.creada_en desc)
        from public.recetas re
        left join public.veterinarios v on v.id = re.veterinario_id
        left join public.perfiles pv on pv.id = v.perfil_id
        left join public.citas ci on ci.id = re.cita_id
        left join public.centros c on c.id = ci.centro_id
        where re.mascota_id = m.id), '[]'::jsonb),
      'derivaciones', coalesce((
        select jsonb_agg(jsonb_build_object(
          'fecha', dv.creada_en, 'origen', po.nombre, 'destino', coalesce(pd.nombre, cd.nombre),
          'motivo', dv.motivo, 'estado', dv.estado, 'resultado', dv.resultado) order by dv.creada_en desc)
        from public.derivaciones dv
        join public.registros_medicos r on r.id = dv.registro_id
        left join public.veterinarios vo on vo.id = r.veterinario_id
        left join public.perfiles po on po.id = vo.perfil_id
        left join public.veterinarios vd on vd.id = dv.a_veterinario_id
        left join public.perfiles pd on pd.id = vd.perfil_id
        left join public.centros cd on cd.id = dv.a_centro_id
        where r.mascota_id = m.id), '[]'::jsonb)
    )
    from public.mascotas m
    left join public.perfiles d on d.id = m.dueno_id
    where m.id = p_mascota_id
  );
end;
$$;

revoke execute on function public.ficha_pdf from public, anon;
grant  execute on function public.ficha_pdf to authenticated;
