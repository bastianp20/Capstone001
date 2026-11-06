-- =====================================================================
-- AuraPet — 16: Cambiar un centro a "de prueba" (o al revés) sin mezclar mundos
--
-- Un centro solo puede cambiar de tipo si todo su equipo (veterinarios y
-- admins) es del mismo tipo al que pasa. Si no, la base explica qué hacer.
-- (Es la misma idea de la migración 15, pero desde el lado del centro.)
-- =====================================================================

create function public.validar_cambio_centro_de_prueba()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.es_prueba is distinct from old.es_prueba and (
    -- ¿Algún veterinario del centro es del otro mundo?
    exists (
      select 1
      from public.veterinario_centros vc
      join public.veterinarios v on v.id = vc.veterinario_id
      join public.perfiles p on p.id = v.perfil_id
      where vc.centro_id = new.id and p.es_prueba <> new.es_prueba
    )
    -- ¿O algún admin del centro?
    or exists (
      select 1
      from public.admins_centro a
      join public.perfiles p on p.id = a.perfil_id
      where a.centro_id = new.id and p.es_prueba <> new.es_prueba
    )
  ) then
    raise exception '%',
      case when new.es_prueba
        then 'Este centro tiene veterinarios o admins con cuentas reales. Quítalos del centro (o márcalos como de prueba) antes de cambiarlo.'
        else 'Este centro tiene veterinarios o admins con cuentas de prueba. Quítalos del centro (o márcalos como reales) antes de cambiarlo.'
      end;
  end if;
  return new;
end;
$$;

create trigger cambio_centro_de_prueba
  before update of es_prueba on centros
  for each row execute function public.validar_cambio_centro_de_prueba();
