-- =====================================================================
-- AuraPet — 04: Centro de pruebas
--
-- Un centro marcado como "de pruebas" (es_prueba = true) no aparece para
-- visitantes, dueños ni veterinarios de otros centros. Solo lo ven:
--   · el superadmin
--   · los admins de ese centro
--   · los veterinarios asignados a ese centro
-- Sus horarios y especialidades se ocultan solos, porque sus políticas
-- dicen "se ven si el centro es visible".
-- =====================================================================

-- 1) Nueva columna: ¿es un centro de pruebas? (por defecto, no)
alter table centros add column es_prueba boolean not null default false;

-- 2) ¿La persona conectada es veterinario de este centro?
--    (security definer para poder leer veterinario_centros sin chocar con su RLS)
create function public.es_veterinario_de_centro(p_centro_id bigint)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.veterinario_centros
    where centro_id = p_centro_id
      and veterinario_id = public.mi_veterinario_id()
  );
$$;

-- 3) Reemplazamos la regla de quién ve centros
drop policy "todos ven centros aprobados; admins y superadmin, los suyos" on centros;

create policy "todos ven centros aprobados (menos los de prueba); admins, sus vets y superadmin, los suyos"
  on centros for select to anon, authenticated
  using (
    (estado_verificacion = 'aprobado' and not es_prueba)
    or public.es_superadmin()
    or public.es_admin_de_centro(id)
    or public.es_veterinario_de_centro(id)
  );
