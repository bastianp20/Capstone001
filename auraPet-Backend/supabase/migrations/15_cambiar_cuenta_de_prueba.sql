-- =====================================================================
-- AuraPet — 15: Cambiar una cuenta a "de prueba" (o al revés) sin mezclar mundos
--
-- Si una cuenta es veterinario o admin de algún centro, solo se puede
-- marcar como de prueba si TODOS sus centros son de prueba (y para quitarle
-- la marca, todos sus centros deben ser reales). Si no, la base explica qué hacer.
-- =====================================================================

create function public.validar_cambio_cuenta_de_prueba()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.es_prueba is distinct from old.es_prueba and (
    -- ¿Es veterinario de algún centro del otro mundo?
    exists (
      select 1
      from public.veterinarios v
      join public.veterinario_centros vc on vc.veterinario_id = v.id
      join public.centros c on c.id = vc.centro_id
      where v.perfil_id = new.id and c.es_prueba <> new.es_prueba
    )
    -- ¿O admin de algún centro del otro mundo?
    or exists (
      select 1
      from public.admins_centro a
      join public.centros c on c.id = a.centro_id
      where a.perfil_id = new.id and c.es_prueba <> new.es_prueba
    )
  ) then
    raise exception '%',
      case when new.es_prueba
        then 'Esta cuenta está asignada a centros reales. Quítala de esos centros antes de marcarla como de prueba.'
        else 'Esta cuenta está asignada a centros de prueba. Quítala de esos centros antes de marcarla como real.'
      end;
  end if;
  return new;
end;
$$;

create trigger cambio_cuenta_de_prueba
  before update of es_prueba on perfiles
  for each row execute function public.validar_cambio_cuenta_de_prueba();
