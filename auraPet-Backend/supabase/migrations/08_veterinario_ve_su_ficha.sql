-- =====================================================================
-- AuraPet — 08: Cada veterinario ve su ficha y sus centros
--                + el superadmin asigna y quita centros
--
-- Problema: con solo la migración 07, un veterinario no podía leer su
-- propia fila de veterinarios ni la de veterinario_centros. Su panel
-- recibía "nada" y lo mostraba como "Atención independiente", aunque
-- estuviera asignado a un centro.
--
-- (Los centros ya los puede ver por la migración 04: es_veterinario_de_centro.)
-- =====================================================================

create policy "cada veterinario ve su propia ficha"
  on veterinarios for select to authenticated
  using (perfil_id = auth.uid());

-- mi_veterinario_id() es security definer, así evitamos que esta política
-- tenga que pasar por el RLS de veterinarios.
create policy "cada veterinario ve sus centros asignados"
  on veterinario_centros for select to authenticated
  using (veterinario_id = public.mi_veterinario_id());

-- El superadmin corrige asignaciones desde su panel.
-- Ojo: quitar un centro borra también los horarios del veterinario en ese
-- centro (horarios_veterinario tiene on delete cascade).
create policy "el superadmin asigna centros a veterinarios"
  on veterinario_centros for insert to authenticated
  with check (public.es_superadmin());

create policy "el superadmin quita centros a veterinarios"
  on veterinario_centros for delete to authenticated
  using (public.es_superadmin());
