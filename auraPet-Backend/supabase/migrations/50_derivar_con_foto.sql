-- =====================================================================
-- 50 · App, fase 2: derivar viendo la cara y dónde atiende cada colega
-- ---------------------------------------------------------------------
-- destinos_derivacion (migración 46) suma:
--   · avatar_url: la foto de perfil del veterinario (ruta del bucket "avatares");
--   · lugar: los centros donde atiende ("Clínica VetSur, Hospital Ñuñoa"),
--     o null si es independiente. Para un centro, null.
-- Cambia lo que devuelve, por eso se borra y se vuelve a crear.
-- =====================================================================

drop function public.destinos_derivacion();

create function public.destinos_derivacion()
returns table (tipo text, id bigint, nombre text, detalle text, especialidad_ids bigint[], avatar_url text, lugar text)
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
                     where ve.veterinario_id = v.id), '{}'),
           p.avatar_url,
           (select string_agg(c.nombre, ', ' order by c.nombre)
            from public.veterinario_centros vc join public.centros c on c.id = vc.centro_id
            where vc.veterinario_id = v.id and c.desactivado_en is null)
    from public.veterinarios v
    join public.perfiles p on p.id = v.perfil_id
    where v.estado_verificacion = 'aprobado'
      and v.id <> public.mi_veterinario_id()
      and p.desactivado_en is null
      and p.es_prueba = public.es_cuenta_de_prueba()
    union all
    select 'centro'::text, c.id, c.nombre, c.comuna,
           coalesce((select array_agg(ce.especialidad_id) from public.centro_especialidades ce
                     where ce.centro_id = c.id), '{}'),
           null::text, null::text
    from public.centros c
    where c.estado_verificacion = 'aprobado'
      and c.desactivado_en is null
      and c.es_prueba = public.es_cuenta_de_prueba()
    order by 1 desc, 3;
end;
$$;

revoke execute on function public.destinos_derivacion from public, anon;
grant  execute on function public.destinos_derivacion to authenticated;
