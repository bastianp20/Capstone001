-- =====================================================================
-- 46 · Derivar filtrando por especialidad
-- ---------------------------------------------------------------------
-- destinos_derivacion (migraciones 29, 41 y 43) ahora también devuelve
-- especialidad_ids: las del veterinario (migración 45) o las del centro
-- (centro_especialidades), para filtrar en "Derivar paciente".
-- El detalle del veterinario muestra todas sus especialidades.
-- Cambia lo que devuelve, por eso se borra y se vuelve a crear.
-- =====================================================================

drop function public.destinos_derivacion();

create function public.destinos_derivacion()
returns table (tipo text, id bigint, nombre text, detalle text, especialidad_ids bigint[])
language plpgsql stable security definer set search_path = ''
as $$
begin
  if public.mi_veterinario_id() is null then
    raise exception 'Solo los veterinarios pueden derivar';
  end if;

  return query
    select 'veterinario'::text, v.id, p.nombre,
           coalesce(public.especialidad_de_veterinario(v.id), 'Medicina general'),
           coalesce((select array_agg(ve.especialidad_id) from public.veterinario_especialidades ve
                     where ve.veterinario_id = v.id), '{}')
    from public.veterinarios v
    join public.perfiles p on p.id = v.perfil_id
    where v.estado_verificacion = 'aprobado'
      and v.id <> public.mi_veterinario_id()
      and p.desactivado_en is null
      and p.es_prueba = public.es_cuenta_de_prueba()
    union all
    select 'centro'::text, c.id, c.nombre, c.comuna,
           coalesce((select array_agg(ce.especialidad_id) from public.centro_especialidades ce
                     where ce.centro_id = c.id), '{}')
    from public.centros c
    where c.estado_verificacion = 'aprobado'
      and c.desactivado_en is null
      and c.es_prueba = public.es_cuenta_de_prueba()
    order by 1 desc, 3;
end;
$$;

revoke execute on function public.destinos_derivacion from public, anon;
grant  execute on function public.destinos_derivacion to authenticated;
