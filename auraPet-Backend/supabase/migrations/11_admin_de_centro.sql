-- =====================================================================
-- AuraPet — 11: Lo que puede ver el admin de un centro
--
-- "Admin de centro" es un CARGO (tabla admins_centro), no un rol:
-- lo puede tener un veterinario o una cuenta administrativa.
-- Todas las reglas usan es_admin_de_centro(centro_id), que ya existe.
-- =====================================================================

-- ¿Este perfil tiene relación con algún centro que yo administro?
-- (veterinario de mi centro, otro admin de mi centro, o dueño de una
-- mascota con cita en mi centro). security definer para revisar las
-- tablas sin pasar por su RLS y evitar políticas que se llaman entre sí.
create function public.perfil_relacionado_con_mis_centros(p_perfil_id uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    -- veterinario de un centro que administro
    select 1
    from public.veterinarios v
    join public.veterinario_centros vc on vc.veterinario_id = v.id
    where v.perfil_id = p_perfil_id and public.es_admin_de_centro(vc.centro_id)
  ) or exists (
    -- otro admin de un centro que administro
    select 1 from public.admins_centro a
    where a.perfil_id = p_perfil_id and public.es_admin_de_centro(a.centro_id)
  ) or exists (
    -- dueño de una mascota con cita en un centro que administro
    select 1
    from public.mascotas m
    join public.citas c on c.mascota_id = m.id
    where m.dueno_id = p_perfil_id and public.es_admin_de_centro(c.centro_id)
  );
$$;

create policy "el admin del centro ve los perfiles relacionados con su centro"
  on perfiles for select to authenticated
  using (public.perfil_relacionado_con_mis_centros(id));

-- Equipo del centro
create policy "el admin del centro ve qué veterinarios atienden en su centro"
  on veterinario_centros for select to authenticated
  using (public.es_admin_de_centro(centro_id));

create policy "el admin del centro ve las fichas de los veterinarios de su centro"
  on veterinarios for select to authenticated
  using (exists (
    select 1 from public.veterinario_centros vc
    where vc.veterinario_id = veterinarios.id and public.es_admin_de_centro(vc.centro_id)
  ));

-- Citas del centro (y las mascotas de esas citas)
create policy "el admin del centro ve las citas de su centro"
  on citas for select to authenticated
  using (public.es_admin_de_centro(centro_id));

create policy "el admin del centro ve las mascotas con citas en su centro"
  on mascotas for select to authenticated
  using (exists (
    select 1 from public.citas c
    where c.mascota_id = mascotas.id and public.es_admin_de_centro(c.centro_id)
  ));
