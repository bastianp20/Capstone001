-- =====================================================================
-- AuraPet — 18: El veterinario rechaza una solicitud de cita
--
-- Cuando un dueño pide hora y elige veterinario, la cita llega "pendiente".
-- El veterinario la confirma con actualizar_mi_cita() (migración 12) o la
-- rechaza con esta función.
--
-- No se agrega un estado nuevo: la cita queda "cancelada", igual que cuando
-- cancela el dueño (cancelar_mi_cita, migración 13). Se distingue por
-- cancelada_por = perfil del veterinario, y el motivo (obligatorio) queda en
-- motivo_cancelacion para mostrárselo al dueño.
-- =====================================================================

create function public.rechazar_cita(p_cita_id bigint, p_motivo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_estado_actual public.estado_cita;
begin
  if nullif(trim(p_motivo), '') is null then
    raise exception 'Debes indicar el motivo del rechazo';
  end if;

  select estado into v_estado_actual
  from public.citas
  where id = p_cita_id and veterinario_id = public.mi_veterinario_id()
  for update;

  if not found then
    raise exception 'La cita no existe o no es tuya';
  end if;

  if v_estado_actual <> 'pendiente' then
    raise exception 'Solo se pueden rechazar citas pendientes';
  end if;

  update public.citas
  set estado = 'cancelada',
      cancelada_por = auth.uid(),
      motivo_cancelacion = left(trim(p_motivo), 500)
  where id = p_cita_id;
end;
$$;

revoke execute on function public.rechazar_cita from public, anon;
grant  execute on function public.rechazar_cita to authenticated;
