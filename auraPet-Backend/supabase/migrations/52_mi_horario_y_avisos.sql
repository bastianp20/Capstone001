-- =====================================================================
-- AuraPet — 52: Mi horario del veterinario y avisos de cambios de hora
--
-- Al veterinario le surge algo y necesita mover su agenda:
--   · Reagendar una cita suya (reagendar_cita_veterinario): cambia la hora,
--     la cita conserva su estado y queda marcada como reagendada.
--   · Cancelar una cita suya ya confirmada (cancelar_cita_veterinario):
--     queda "cancelada" con su motivo, igual que un rechazo.
--   · Bloquear un rango de horas (bloquear_mi_horario): en ese rango no se
--     pueden pedir ni mover citas con él. Si el rango tiene citas activas,
--     hay que reagendarlas o cancelarlas antes (o pedir que se cancelen al
--     bloquear, con p_cancelar_citas).
-- Cada cambio deja un aviso (tabla notificaciones) para el dueño de la
-- mascota y, si la cita es de un centro y el veterinario lo pide, para los
-- administradores de ese centro. Por ahora los avisos se ven dentro de
-- AuraPet; correo y push llegarán cuando estén listos.
-- =====================================================================


-- ---------- Citas: marca de reagendada ----------
alter table citas
  add column reagendada_en        timestamptz,   -- última vez que el veterinario cambió la hora
  add column fecha_hora_anterior  timestamptz;   -- la hora que tenía antes de ese cambio


-- ---------- Bloqueos de horario del veterinario ----------
-- Vale para todos los centros donde atiende y para su atención independiente:
-- si al veterinario le surgió algo, no está en ningún lado.
create table bloqueos_veterinario (
  id              bigint generated always as identity primary key,
  veterinario_id  bigint not null references veterinarios (id) on delete cascade,
  desde           timestamptz not null,
  hasta           timestamptz not null,
  motivo          text not null check (length(trim(motivo)) between 1 and 200),
  creado_en       timestamptz not null default now(),
  check (hasta > desde),
  check (hasta - desde <= interval '31 days')
);

create index on bloqueos_veterinario (veterinario_id, desde);

alter table bloqueos_veterinario enable row level security;

create policy "el veterinario ve sus bloqueos"
  on bloqueos_veterinario for select to authenticated
  using (veterinario_id = public.mi_veterinario_id() or public.es_superadmin());

-- Se escriben solo con las funciones de abajo.


-- ---------- Avisos (notificaciones dentro de la app) ----------
create table notificaciones (
  id              bigint generated always as identity primary key,
  destinatario    uuid not null references perfiles (id) on delete cascade,
  tipo            text not null check (tipo in ('cita_reagendada', 'cita_cancelada')),
  titulo          text not null,
  mensaje         text not null,
  cita_id         bigint references citas (id) on delete set null,
  centro_id       bigint references centros (id) on delete set null,  -- aviso para un centro: a cuál
  fecha_anterior  timestamptz,
  fecha_nueva     timestamptz,
  creada_por      uuid references perfiles (id) on delete set null,
  creada_en       timestamptz not null default now(),
  leida_en        timestamptz
);

create index on notificaciones (destinatario, creada_en desc);
create index on notificaciones (destinatario) where leida_en is null;

alter table notificaciones enable row level security;

create policy "cada uno ve sus avisos"
  on notificaciones for select to authenticated
  using (destinatario = auth.uid());

-- Marcarlos como leídos va por marcar_aviso_leido(); crearlos, por las
-- funciones de este archivo.


-- ---------- Ayudantes internos ----------

-- ¿La hora cae dentro de un bloqueo del veterinario?
create function public.hora_bloqueada(p_veterinario_id bigint, p_fecha_hora timestamptz)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.bloqueos_veterinario
    where veterinario_id = p_veterinario_id
      and p_fecha_hora >= desde and p_fecha_hora < hasta
  );
$$;

revoke execute on function public.hora_bloqueada from public, anon, authenticated;

-- Ninguna cita activa (nueva o movida) puede caer en un horario bloqueado.
-- Cubre solicitar_cita, solicitar_cita_independiente y reagendar.
create function public.cita_fuera_de_bloqueo()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.estado <> 'cancelada' and new.veterinario_id is not null
     and (tg_op = 'INSERT' or new.fecha_hora is distinct from old.fecha_hora
          or new.veterinario_id is distinct from old.veterinario_id)
     and public.hora_bloqueada(new.veterinario_id, new.fecha_hora) then
    raise exception 'El veterinario no atiende en ese horario. Prueba con otra hora.';
  end if;
  return new;
end;
$$;

create trigger citas_fuera_de_bloqueo
  before insert or update on citas
  for each row execute function public.cita_fuera_de_bloqueo();

-- Revisa que la hora calce con el horario del centro (si registró horarios).
-- Mismas reglas que solicitar_cita.
create function public.revisar_horario_centro(p_centro_id bigint, p_fecha_hora timestamptz)
returns void
language plpgsql stable
security definer set search_path = ''
as $$
declare
  v_local   timestamp := p_fecha_hora at time zone 'America/Santiago';
  v_dia     smallint  := extract(isodow from v_local);
  v_hora    time      := v_local::time;
  v_horario public.horarios_centro%rowtype;
begin
  if p_centro_id is null
     or not exists (select 1 from public.horarios_centro where centro_id = p_centro_id) then
    return;
  end if;

  select * into v_horario from public.horarios_centro
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
end;
$$;

revoke execute on function public.revisar_horario_centro from public, anon, authenticated;

-- Deja el aviso de un cambio de hora: siempre al dueño de la mascota y,
-- si p_avisar_centro, a los administradores del centro de la cita
-- (menos al mismo veterinario, si también administra ese centro).
create function public.avisar_cambio_de_cita(
  p_cita_id        bigint,
  p_tipo           text,
  p_mensaje        text,
  p_fecha_anterior timestamptz,
  p_fecha_nueva    timestamptz,
  p_avisar_centro  boolean
)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  v_mascota  text;
  v_dueno    uuid;
  v_centro   bigint;
  v_vet      text;
  v_titulo   text;
  v_mensaje  text := left(trim(coalesce(p_mensaje, '')), 600);
begin
  select m.nombre, m.dueno_id, c.centro_id into v_mascota, v_dueno, v_centro
  from public.citas c join public.mascotas m on m.id = c.mascota_id
  where c.id = p_cita_id;

  select nombre into v_vet from public.perfiles where id = auth.uid();

  if v_mensaje = '' then
    v_mensaje := case p_tipo
      when 'cita_reagendada' then coalesce(v_vet, 'El veterinario') || ' cambió la hora de ' || v_mascota || '.'
      else coalesce(v_vet, 'El veterinario') || ' canceló la hora de ' || v_mascota || '.'
    end;
  end if;

  -- Al dueño (si la mascota todavía tiene dueño)
  if v_dueno is not null then
    v_titulo := case p_tipo
      when 'cita_reagendada' then 'Se cambió la hora de ' || v_mascota
      else 'Se canceló la hora de ' || v_mascota
    end;
    insert into public.notificaciones (destinatario, tipo, titulo, mensaje, cita_id, fecha_anterior, fecha_nueva, creada_por)
    values (v_dueno, p_tipo, v_titulo, v_mensaje, p_cita_id, p_fecha_anterior, p_fecha_nueva, auth.uid());
  end if;

  -- Al centro
  if p_avisar_centro and v_centro is not null then
    v_titulo := coalesce(v_vet, 'Un veterinario')
      || case p_tipo when 'cita_reagendada' then ' reagendó la hora de ' else ' canceló la hora de ' end
      || v_mascota;
    insert into public.notificaciones (destinatario, tipo, titulo, mensaje, cita_id, centro_id, fecha_anterior, fecha_nueva, creada_por)
    select a.perfil_id, p_tipo, v_titulo, v_mensaje, p_cita_id, v_centro, p_fecha_anterior, p_fecha_nueva, auth.uid()
    from public.admins_centro a
    where a.centro_id = v_centro and a.perfil_id <> auth.uid();
  end if;
end;
$$;

revoke execute on function public.avisar_cambio_de_cita from public, anon, authenticated;


-- ---------- Reagendar una cita (veterinario) ----------
create function public.reagendar_cita_veterinario(
  p_cita_id        bigint,
  p_nueva_fecha    timestamptz,
  p_mensaje        text default null,
  p_avisar_centro  boolean default true
)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  v_cita public.citas%rowtype;
begin
  select * into v_cita from public.citas
  where id = p_cita_id and veterinario_id = public.mi_veterinario_id()
  for update;

  if not found then
    raise exception 'La cita no existe o no es tuya';
  end if;
  if v_cita.estado not in ('pendiente', 'confirmada') then
    raise exception 'Solo se pueden reagendar citas pendientes o confirmadas';
  end if;
  if v_cita.fecha_hora <= now() then
    raise exception 'Esta cita ya pasó: no se puede reagendar';
  end if;
  if p_nueva_fecha <= now() then
    raise exception 'Elige una fecha y hora futura';
  end if;
  if p_nueva_fecha = v_cita.fecha_hora then
    raise exception 'Elige una hora distinta a la actual';
  end if;

  perform public.revisar_horario_centro(v_cita.centro_id, p_nueva_fecha);

  begin
    update public.citas
    set fecha_hora = p_nueva_fecha,
        fecha_hora_anterior = v_cita.fecha_hora,
        reagendada_en = now()
    where id = p_cita_id;
  exception when unique_violation then
    raise exception 'Ya tienes una cita a esa hora. Prueba con otra.';
  end;

  perform public.avisar_cambio_de_cita(p_cita_id, 'cita_reagendada', p_mensaje,
                                       v_cita.fecha_hora, p_nueva_fecha, coalesce(p_avisar_centro, true));
end;
$$;

revoke execute on function public.reagendar_cita_veterinario from public, anon;
grant  execute on function public.reagendar_cita_veterinario to authenticated;


-- ---------- Cancelar una cita (veterinario) ----------
-- Para pendientes sigue existiendo rechazar_cita; esta sirve para las dos y
-- además avisa. El motivo (obligatorio) lo ve el dueño, igual que un rechazo.
create function public.cancelar_cita_veterinario(
  p_cita_id        bigint,
  p_motivo         text,
  p_mensaje        text default null,
  p_avisar_centro  boolean default true
)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  v_cita public.citas%rowtype;
begin
  if nullif(trim(p_motivo), '') is null then
    raise exception 'Debes indicar el motivo de la cancelación';
  end if;

  select * into v_cita from public.citas
  where id = p_cita_id and veterinario_id = public.mi_veterinario_id()
  for update;

  if not found then
    raise exception 'La cita no existe o no es tuya';
  end if;
  if v_cita.estado not in ('pendiente', 'confirmada') then
    raise exception 'Solo se pueden cancelar citas pendientes o confirmadas';
  end if;

  update public.citas
  set estado = 'cancelada',
      cancelada_por = auth.uid(),
      motivo_cancelacion = left(trim(p_motivo), 500)
  where id = p_cita_id;

  perform public.avisar_cambio_de_cita(p_cita_id, 'cita_cancelada', p_mensaje,
                                       v_cita.fecha_hora, null, coalesce(p_avisar_centro, true));
end;
$$;

revoke execute on function public.cancelar_cita_veterinario from public, anon;
grant  execute on function public.cancelar_cita_veterinario to authenticated;


-- ---------- Bloquear un rango de horas ----------
-- Si el rango tiene citas activas (pendientes o confirmadas):
--   · p_cancelar_citas = false -> error con cuántas hay (el front las muestra
--     para reagendarlas o cancelarlas una por una);
--   · p_cancelar_citas = true  -> se cancelan con el motivo del bloqueo y se
--     avisa a cada dueño (y al centro, si p_avisar_centro).
-- Devuelve el id del bloqueo.
create function public.bloquear_mi_horario(
  p_desde           timestamptz,
  p_hasta           timestamptz,
  p_motivo          text,
  p_cancelar_citas  boolean default false,
  p_mensaje         text default null,
  p_avisar_centro   boolean default true
)
returns bigint
language plpgsql
security definer set search_path = ''
as $$
declare
  v_vet      bigint := public.mi_veterinario_id();
  v_cita     record;
  v_cuantas  int;
  v_id       bigint;
begin
  if v_vet is null then
    raise exception 'Solo un veterinario puede bloquear su horario';
  end if;
  if nullif(trim(p_motivo), '') is null then
    raise exception 'Indica el motivo del bloqueo';
  end if;
  if p_hasta <= p_desde then
    raise exception 'La hora de término debe ser posterior a la de inicio';
  end if;
  if p_hasta <= now() then
    raise exception 'Ese horario ya pasó';
  end if;
  if p_hasta - p_desde > interval '31 days' then
    raise exception 'Un bloqueo puede durar como máximo 31 días';
  end if;
  if exists (
    select 1 from public.bloqueos_veterinario
    where veterinario_id = v_vet and desde < p_hasta and hasta > p_desde
  ) then
    raise exception 'Ya tienes un bloqueo que se cruza con ese horario';
  end if;

  select count(*) into v_cuantas from public.citas
  where veterinario_id = v_vet and estado in ('pendiente', 'confirmada')
    and fecha_hora >= p_desde and fecha_hora < p_hasta;

  if v_cuantas > 0 and not coalesce(p_cancelar_citas, false) then
    raise exception 'Ese horario tiene % cita(s). Reagéndalas o cancélalas antes de bloquear.', v_cuantas;
  end if;

  for v_cita in
    select id, fecha_hora from public.citas
    where veterinario_id = v_vet and estado in ('pendiente', 'confirmada')
      and fecha_hora >= p_desde and fecha_hora < p_hasta
    for update
  loop
    update public.citas
    set estado = 'cancelada',
        cancelada_por = auth.uid(),
        motivo_cancelacion = left(trim(p_motivo), 500)
    where id = v_cita.id;

    perform public.avisar_cambio_de_cita(v_cita.id, 'cita_cancelada', p_mensaje,
                                         v_cita.fecha_hora, null, coalesce(p_avisar_centro, true));
  end loop;

  insert into public.bloqueos_veterinario (veterinario_id, desde, hasta, motivo)
  values (v_vet, p_desde, p_hasta, left(trim(p_motivo), 200))
  returning id into v_id;

  return v_id;
end;
$$;

revoke execute on function public.bloquear_mi_horario from public, anon;
grant  execute on function public.bloquear_mi_horario to authenticated;

-- Quitar un bloqueo propio (las horas vuelven a quedar disponibles).
create function public.quitar_bloqueo(p_bloqueo_id bigint)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  delete from public.bloqueos_veterinario
  where id = p_bloqueo_id and veterinario_id = public.mi_veterinario_id();

  if not found then
    raise exception 'El bloqueo no existe o no es tuyo';
  end if;
end;
$$;

revoke execute on function public.quitar_bloqueo from public, anon;
grant  execute on function public.quitar_bloqueo to authenticated;


-- ---------- Avisos: marcar como leídos ----------
-- p_aviso_id null = todos los avisos sin leer de la persona.
create function public.marcar_aviso_leido(p_aviso_id bigint default null)
returns void
language sql
security definer set search_path = ''
as $$
  update public.notificaciones
  set leida_en = now()
  where destinatario = auth.uid()
    and leida_en is null
    and (p_aviso_id is null or id = p_aviso_id);
$$;

revoke execute on function public.marcar_aviso_leido from public, anon;
grant  execute on function public.marcar_aviso_leido to authenticated;
