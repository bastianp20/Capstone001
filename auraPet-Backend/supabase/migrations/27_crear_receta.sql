-- =====================================================================
-- AuraPet — 27: El veterinario guarda recetas
--
-- Una receta son varias filas que deben guardarse juntas (recetas +
-- receta_medicamentos): esta función lo hace en UNA transacción.
-- Solo para pacientes del veterinario (es_mi_paciente, migración 19).
--
-- p_medicamentos: [{"nombre":"Amoxicilina","dosis":"250 mg","frecuencia":"cada 12 h","duracion":"7 días"}, ...]
-- =====================================================================

create function public.crear_receta(
  p_mascota_id       bigint,
  p_medicamentos     jsonb,
  p_indicaciones     text default null,
  p_proximo_control  date default null,
  p_cita_id          bigint default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_receta_id bigint;
begin
  if not public.es_mi_paciente(p_mascota_id) then
    raise exception 'Esta mascota no es tu paciente';
  end if;

  if jsonb_typeof(p_medicamentos) <> 'array' or jsonb_array_length(p_medicamentos) = 0 then
    raise exception 'La receta debe tener al menos un medicamento';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_medicamentos) m
    where nullif(trim(m->>'nombre'), '') is null or nullif(trim(m->>'dosis'), '') is null
       or nullif(trim(m->>'frecuencia'), '') is null or nullif(trim(m->>'duracion'), '') is null
  ) then
    raise exception 'Completa medicamento, dosis, frecuencia y duración en cada fila';
  end if;

  if p_proximo_control is not null and p_proximo_control < current_date then
    raise exception 'El próximo control no puede ser en el pasado';
  end if;

  insert into public.recetas (mascota_id, veterinario_id, cita_id, indicaciones, proximo_control)
  values (p_mascota_id, public.mi_veterinario_id(), p_cita_id, nullif(trim(p_indicaciones), ''), p_proximo_control)
  returning id into v_receta_id;

  insert into public.receta_medicamentos (receta_id, nombre, dosis, frecuencia, duracion)
  select v_receta_id, left(trim(m->>'nombre'), 120), left(trim(m->>'dosis'), 60),
         left(trim(m->>'frecuencia'), 60), left(trim(m->>'duracion'), 60)
  from jsonb_array_elements(p_medicamentos) m;

  return v_receta_id;
end;
$$;

revoke execute on function public.crear_receta from public, anon;
grant  execute on function public.crear_receta to authenticated;
