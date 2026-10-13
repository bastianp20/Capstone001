-- =====================================================================
-- AuraPet — 07: El superadmin ve veterinarios, mascotas y citas
--
-- Estas tablas tenían RLS activo pero sin políticas, así que nadie podía
-- leerlas desde la app (ni el superadmin). Esto agrega SOLO lo que necesita
-- el panel de superadmin:
--   · ver veterinarios, en qué centros atienden, mascotas y citas
--   · aprobar o rechazar veterinarios
-- Las reglas para dueños y veterinarios van en la matriz de permisos aparte.
-- =====================================================================

create policy "el superadmin ve todos los veterinarios"
  on veterinarios for select to authenticated
  using (public.es_superadmin());

create policy "el superadmin edita veterinarios (aprobar / rechazar)"
  on veterinarios for update to authenticated
  using (public.es_superadmin())
  with check (public.es_superadmin());

create policy "el superadmin ve en qué centros atiende cada veterinario"
  on veterinario_centros for select to authenticated
  using (public.es_superadmin());

create policy "el superadmin ve todas las mascotas"
  on mascotas for select to authenticated
  using (public.es_superadmin());

create policy "el superadmin ve todas las citas"
  on citas for select to authenticated
  using (public.es_superadmin());
