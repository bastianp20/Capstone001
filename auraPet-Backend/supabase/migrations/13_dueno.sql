-- =====================================================================
-- AuraPet — 13: Lo que necesita el panel del dueño
--
-- · Ver, registrar y editar SUS mascotas.
-- · Ver las citas, el historial médico y las recetas de sus mascotas.
-- · Ver el nombre de los centros donde tiene citas.
-- · Solicitar y cancelar citas (funciones solicitar_cita y cancelar_mi_cita).
-- · Elegir veterinario al pedir hora (función veterinarios_de_centro).
-- =====================================================================

-- ¿Esta mascota es mía? security definer: revisa mascotas sin pasar por su
-- RLS. Así las políticas de citas/recetas/historial no se llaman en círculo
-- con las de mascotas.
create function public.es_mi_mascota(p_mascota_id bigint)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.mascotas
    where id = p_mascota_id and dueno_id = auth.uid()
  );
$$;

-- ---------- Mascotas ----------
create policy "el dueño ve sus mascotas"
  on mascotas for select to authenticated
  using (dueno_id = auth.uid());

create policy "el dueño registra sus mascotas"
  on mascotas for insert to authenticated
  with check (dueno_id = auth.uid());

create policy "el dueño edita sus mascotas"
  on mascotas for update to authenticated
  using (dueno_id = auth.uid())
  with check (dueno_id = auth.uid());

-- ---------- Citas, historial y recetas de sus mascotas ----------
create policy "el dueño ve las citas de sus mascotas"
  on citas for select to authenticated
  using (public.es_mi_mascota(mascota_id));

create policy "el dueño ve el historial de sus mascotas"
  on registros_medicos for select to authenticated
  using (public.es_mi_mascota(mascota_id));

create policy "el dueño ve las recetas de sus mascotas"
  on recetas for select to authenticated
  using (public.es_mi_mascota(mascota_id));

create policy "el dueño ve los medicamentos de las recetas de sus mascotas"
  on receta_medicamentos for select to authenticated
  using (exists (
    select 1 from public.recetas r
    where r.id = receta_id and public.es_mi_mascota(r.mascota_id)
  ));

-- El nombre del centro de sus citas (aunque sea un centro de pruebas)
create policy "el dueño ve los centros donde tiene citas"
  on centros for select to authenticated
  using (exists (
    select 1 from public.citas c
    where c.centro_id = centros.id and public.es_mi_mascota(c.mascota_id)
  ));

-- ---------- Veterinarios de un centro (para elegir al pedir hora) ----------
-- Devuelve solo id, nombre y especialidad de los veterinarios verificados.
-- No abre la tabla perfiles completa (que tiene teléfonos).
create function public.veterinarios_de_centro(p_centro_id bigint)
returns table (id bigint, nombre text, especialidad text)
language sql stable
security definer set search_path = ''
as $$
  select v.id, p.nombre, e.nombre
  from public.veterinario_centros vc
  join public.veterinarios v on v.id = vc.veterinario_id
  join public.perfiles p on p.id = v.perfil_id
  left join public.especialidades e on e.id = v.especialidad_id
  where vc.centro_id = p_centro_id
    and v.estado_verificacion = 'aprobado'
    and p.desactivado_en is null
  order by p.nombre;
$$;

grant execute on function public.veterinarios_de_centro to anon, authenticated;

-- ---------- Solicitar cita ----------
-- Crea la cita en estado 'pendiente' (el veterinario la confirma después).
-- Revisa: que la mascota sea mía, que el centro esté aprobado, que la fecha
-- sea futura, que caiga dentro del horario del centro (fuera de colación) y,
-- si se eligió veterinario, que atienda en ese centro y no tenga otra cita a esa hora.
create function public.solicitar_cita(
  p_mascota_id      bigint,
  p_centro_id       bigint,
  p_fecha_hora      timestamptz,
  p_motivo          text,
  p_sintomas        text[] default '{}',
  p_veterinario_id  bigint default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_local   timestamp := p_fecha_hora at time zone 'America/Santiago'; -- hora de Chile
  v_dia     smallint  := extract(isodow from v_local);                  -- 1 = lunes ... 7 = domingo
  v_hora    time      := v_local::time;
  v_horario public.horarios_centro%rowtype;
  v_cita_id bigint;
begin
  if not public.es_mi_mascota(p_mascota_id) then
    raise exception 'La mascota no es tuya';
  end if;

  if coalesce(trim(p_motivo), '') = '' then
    raise exception 'Cuéntanos el motivo de la consulta';
  end if;

  if p_fecha_hora <= now() then
    raise exception 'Elige una fecha y hora futura';
  end if;

  if not exists (
    select 1 from public.centros where id = p_centro_id and estado_verificacion = 'aprobado'
  ) then
    raise exception 'El centro no está disponible';
  end if;

  -- Horario del centro: si el centro registró horarios, la hora debe calzar
  if exists (select 1 from public.horarios_centro where centro_id = p_centro_id) then
    select * into v_horario
    from public.horarios_centro
    where centro_id = p_centro_id and dia_semana = v_dia;

    if not found then
      raise exception 'El centro no atiende ese día';
    end if;
    if v_hora < v_horario.abre or v_hora >= v_horario.cierra then
      raise exception 'El centro atiende ese día de % a %',
        to_char(v_horario.abre, 'HH24:MI'), to_char(v_horario.cierra, 'HH24:MI');
    end if;
    if v_horario.inicio_colacion is not null
       and v_hora >= v_horario.inicio_colacion and v_hora < v_horario.fin_colacion then
      raise exception 'Esa hora cae en la colación del centro (% a %)',
        to_char(v_horario.inicio_colacion, 'HH24:MI'), to_char(v_horario.fin_colacion, 'HH24:MI');
    end if;
  end if;

  if p_veterinario_id is not null and not exists (
    select 1 from public.veterinario_centros vc
    join public.veterinarios v on v.id = vc.veterinario_id
    where vc.centro_id = p_centro_id and vc.veterinario_id = p_veterinario_id
      and v.estado_verificacion = 'aprobado'
  ) then
    raise exception 'Ese veterinario no atiende en este centro';
  end if;

  begin
    insert into public.citas (mascota_id, centro_id, veterinario_id, fecha_hora, motivo, sintomas_reportados)
    values (p_mascota_id, p_centro_id, p_veterinario_id, p_fecha_hora, trim(p_motivo),
            coalesce(p_sintomas, '{}'))
    returning id into v_cita_id;
  exception when unique_violation then
    -- índice citas_sin_choque_horario: el veterinario ya tiene una cita a esa hora
    raise exception 'El veterinario ya tiene una cita a esa hora. Prueba con otra.';
  end;

  return v_cita_id;
end;
$$;

-- ---------- Cancelar cita ----------
create function public.cancelar_mi_cita(p_cita_id bigint, p_motivo text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.citas
  set estado = 'cancelada',
      cancelada_por = auth.uid(),
      motivo_cancelacion = coalesce(nullif(trim(p_motivo), ''), 'Cancelada por el dueño')
  where id = p_cita_id
    and public.es_mi_mascota(mascota_id)
    and estado in ('pendiente', 'confirmada');   -- una cita en curso o completada ya no se cancela

  if not found then
    raise exception 'No se puede cancelar esta cita';
  end if;
end;
$$;

revoke execute on function public.solicitar_cita, public.cancelar_mi_cita from public, anon;
grant  execute on function public.solicitar_cita, public.cancelar_mi_cita to authenticated;
