-- =====================================================================
-- AuraPet — 12: Lo que necesita la pantalla de inicio del veterinario
--
-- · Ver SUS citas, las mascotas de esas citas y el nombre/teléfono del dueño.
-- · Ver SUS recetas (controles próximos y últimas recetas).
-- · Avanzar el estado de SU cita (confirmar, iniciar, finalizar) y confirmar
--   la urgencia, mediante la función actualizar_mi_cita().
--
-- No se le da permiso de UPDATE directo sobre citas: con eso podría cambiar
-- cualquier columna (fecha, mascota, centro...). La función solo toca
-- estado y urgencia, y revisa que la cita sea suya.
-- =====================================================================

-- ¿Este perfil es dueño de alguna mascota que atiendo?
-- security definer para revisar mascotas y citas sin pasar por su RLS.
create function public.es_dueno_de_mis_pacientes(p_perfil_id uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.mascotas m
    join public.citas c on c.mascota_id = m.id
    where m.dueno_id = p_perfil_id
      and c.veterinario_id = public.mi_veterinario_id()
  );
$$;

create policy "el veterinario ve sus citas"
  on citas for select to authenticated
  using (veterinario_id = public.mi_veterinario_id());

create policy "el veterinario ve las mascotas que atiende"
  on mascotas for select to authenticated
  using (exists (
    select 1 from public.citas c
    where c.mascota_id = mascotas.id and c.veterinario_id = public.mi_veterinario_id()
  ));

create policy "el veterinario ve el perfil de los dueños de sus pacientes"
  on perfiles for select to authenticated
  using (public.es_dueno_de_mis_pacientes(id));

create policy "el veterinario ve sus recetas"
  on recetas for select to authenticated
  using (veterinario_id = public.mi_veterinario_id());

-- Avanza el estado y/o fija la urgencia de una cita propia.
-- Pasos permitidos: pendiente -> confirmada -> en_curso -> completada
-- (también pendiente -> en_curso, si el paciente llegó sin confirmar).
-- Cancelar NO va aquí: requiere motivo y quién canceló.
create function public.actualizar_mi_cita(
  p_cita_id   bigint,
  p_estado    public.estado_cita  default null,
  p_urgencia  public.urgencia_cita default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_estado_actual public.estado_cita;
begin
  select estado into v_estado_actual
  from public.citas
  where id = p_cita_id and veterinario_id = public.mi_veterinario_id();

  if not found then
    raise exception 'La cita no existe o no es tuya';
  end if;

  if p_estado is not null and not (
       (v_estado_actual = 'pendiente'  and p_estado in ('confirmada', 'en_curso'))
    or (v_estado_actual = 'confirmada' and p_estado = 'en_curso')
    or (v_estado_actual = 'en_curso'   and p_estado = 'completada')
  ) then
    raise exception 'No se puede pasar de % a %', v_estado_actual, p_estado;
  end if;

  update public.citas
  set estado   = coalesce(p_estado, estado),
      urgencia = coalesce(p_urgencia, urgencia)
  where id = p_cita_id;
end;
$$;

revoke execute on function public.actualizar_mi_cita from public, anon;
grant  execute on function public.actualizar_mi_cita to authenticated;
