-- =====================================================================
-- AuraPet — 17: "Pruebas AuraPet" pasa al mundo de pruebas
--
-- Problema: el seed creó el centro "Pruebas AuraPet" sin es_prueba = true,
-- o sea, para la base de datos era un centro REAL. Por eso:
--   · un dueño de prueba no lo veía al pedir hora,
--   · y no se podía marcar desde el panel, porque sus veterinarios/admins
--     eran cuentas reales (los triggers 15 y 16 se bloquean entre sí:
--     el centro no cambia porque tiene cuentas reales, y las cuentas no
--     cambian porque están en un centro real).
--
-- Solución (de una sola vez, dentro de esta migración):
--   1) Revisar que nadie del equipo del centro esté además en un centro real.
--   2) Apagar un momento esos dos triggers.
--   3) Marcar el centro y todo su equipo (veterinarios y admins) como de prueba.
--   4) Volver a encender los triggers.
-- Los dueños no están amarrados a un centro: cada dueño de prueba se marca
-- desde Superadmin → Usuarios → Editar.
-- =====================================================================

-- Todo va dentro de un bloque "do" para que sea una sola operación:
-- si algo falla, no queda nada a medias.
do $$
declare
  v_centro_id  bigint;
  v_equipo     uuid[];  -- ids de los perfiles del equipo del centro (veterinarios + admins)
  v_mezclados  text;
begin
  select id into v_centro_id from public.centros where nombre = 'Pruebas AuraPet';
  if v_centro_id is null then
    raise notice 'No existe el centro "Pruebas AuraPet"; no hay nada que cambiar.';
    return;
  end if;

  -- Personas del equipo del centro
  select coalesce(array_agg(distinct perfil_id), '{}') into v_equipo
  from (
    select v.perfil_id
    from public.veterinario_centros vc
    join public.veterinarios v on v.id = vc.veterinario_id
    where vc.centro_id = v_centro_id and v.perfil_id is not null
    union
    select a.perfil_id
    from public.admins_centro a
    where a.centro_id = v_centro_id
  ) equipo;

  -- 1) Si alguien del equipo también trabaja en otro centro real, paramos:
  --    marcarlo como de prueba mezclaría los mundos. Hay que quitarlo de uno de los dos primero.
  select string_agg(distinct p.nombre, ', ') into v_mezclados
  from public.perfiles p
  where p.id = any (v_equipo)
    and (
      exists (
        select 1
        from public.veterinarios v
        join public.veterinario_centros vc on vc.veterinario_id = v.id
        join public.centros c on c.id = vc.centro_id
        where v.perfil_id = p.id and c.id <> v_centro_id and not c.es_prueba
      )
      or exists (
        select 1
        from public.admins_centro a
        join public.centros c on c.id = a.centro_id
        where a.perfil_id = p.id and c.id <> v_centro_id and not c.es_prueba
      )
    );

  if v_mezclados is not null then
    raise exception 'Estas cuentas están en "Pruebas AuraPet" y también en centros reales: %. Quítalas de uno de los dos y vuelve a correr la migración.', v_mezclados;
  end if;

  -- 2) Apagamos los triggers que se bloquean entre sí (solo durante este bloque)
  alter table public.perfiles disable trigger cambio_cuenta_de_prueba;
  alter table public.centros  disable trigger cambio_centro_de_prueba;

  -- 3) El centro y su equipo pasan al mundo de pruebas
  update public.centros  set es_prueba = true where id = v_centro_id;
  update public.perfiles set es_prueba = true where id = any (v_equipo);

  -- 4) Encendemos los triggers de nuevo
  alter table public.perfiles enable trigger cambio_cuenta_de_prueba;
  alter table public.centros  enable trigger cambio_centro_de_prueba;
end;
$$;
