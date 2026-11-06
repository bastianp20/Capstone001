-- =====================================================================
-- AuraPet — 54: Horario, urgencias y UCI de los centros
--
-- Hasta ahora el horario de un centro solo se cargaba al crearlo el
-- superadmin, y no se sabía nada de urgencias ni de UCI. Aquí:
--   · guardar_horario_centro() y guardar_especialidades_centro(): el admin
--     del centro los edita desde "Mi centro" (todo o nada, en una transacción).
--   · centros.tiene_uci / centros.urgencias_24_7: lo fijo. urgencias_revisado_en
--     dice que el centro ya respondió esas preguntas (cuenta para el progreso).
--   · estado_uci_centros: lo que cambia en el momento (Disponible, Pocos cupos,
--     Sin cupos o No operativa con su motivo) y cuándo se actualizó. Va en
--     Supabase Realtime para que quien mire lo vea cambiar sin recargar.
--     Si pasan horas sin actualizar, el front lo muestra como "sin información
--     reciente" (la regla está en el front: lib/estadoUci.ts).
--   · progreso_perfil_centro(): qué le falta al perfil del centro.
-- =====================================================================


-- ---------- ¿Quién gestiona el centro? (admin o superadmin, centro activo) ----------
create function public.puedo_gestionar_centro(p_centro_id bigint)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select (public.es_admin_de_centro(p_centro_id) or public.es_superadmin())
     and exists (select 1 from public.centros where id = p_centro_id and desactivado_en is null);
$$;

revoke execute on function public.puedo_gestionar_centro from public, anon;
grant  execute on function public.puedo_gestionar_centro to authenticated;


-- ---------- Horario del centro ----------
-- p_horarios: [{"dia_semana":1,"abre":"09:00","cierra":"19:00",
--               "inicio_colacion":"14:00","fin_colacion":"15:00"}, ...]
-- Los días sin elemento quedan cerrados. Los checks de la tabla validan las horas.
create function public.guardar_horario_centro(p_centro_id bigint, p_horarios jsonb)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    raise exception 'No puedes editar este centro';
  end if;
  if jsonb_typeof(coalesce(p_horarios, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_horarios, '[]'::jsonb)) = 0 then
    raise exception 'Marca al menos un día de atención';
  end if;

  delete from public.horarios_centro where centro_id = p_centro_id;

  begin
    insert into public.horarios_centro (centro_id, dia_semana, abre, cierra, inicio_colacion, fin_colacion)
    select p_centro_id, h.dia_semana, h.abre, h.cierra, h.inicio_colacion, h.fin_colacion
    from jsonb_to_recordset(p_horarios) as h(
      dia_semana smallint, abre time, cierra time, inicio_colacion time, fin_colacion time
    );
  exception
    when unique_violation then raise exception 'Hay un día repetido en el horario';
    when check_violation then raise exception 'Revisa las horas: el cierre va después de la apertura y la colación dentro del horario';
    when not_null_violation then raise exception 'Hay un día del horario incompleto';
  end;
end;
$$;

revoke execute on function public.guardar_horario_centro from public, anon;
grant  execute on function public.guardar_horario_centro to authenticated;


-- ---------- Especialidades del centro ----------
create function public.guardar_especialidades_centro(p_centro_id bigint, p_especialidad_ids bigint[])
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    raise exception 'No puedes editar este centro';
  end if;

  delete from public.centro_especialidades where centro_id = p_centro_id;
  insert into public.centro_especialidades (centro_id, especialidad_id)
  select distinct p_centro_id, e.id
  from public.especialidades e
  where e.id = any (coalesce(p_especialidad_ids, '{}'));
end;
$$;

revoke execute on function public.guardar_especialidades_centro from public, anon;
grant  execute on function public.guardar_especialidades_centro to authenticated;


-- ---------- Urgencias y UCI: lo fijo ----------
alter table centros
  add column tiene_uci              boolean not null default false,
  add column urgencias_24_7         boolean not null default false,
  add column urgencias_revisado_en  timestamptz;

create function public.guardar_urgencias_centro(p_centro_id bigint, p_tiene_uci boolean, p_urgencias_24_7 boolean)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    raise exception 'No puedes editar este centro';
  end if;

  update public.centros
  set tiene_uci = coalesce(p_tiene_uci, false),
      urgencias_24_7 = coalesce(p_urgencias_24_7, false),
      urgencias_revisado_en = now()
  where id = p_centro_id;

  -- Sin UCI no hay estado que mostrar
  if not coalesce(p_tiene_uci, false) then
    delete from public.estado_uci_centros where centro_id = p_centro_id;
  end if;
end;
$$;


-- ---------- Estado de la UCI: lo que cambia en el momento ----------
create table estado_uci_centros (
  centro_id        bigint primary key references centros (id) on delete cascade,
  estado           text not null check (estado in ('disponible', 'pocos_cupos', 'sin_cupos', 'no_operativa')),
  motivo           text check (motivo in ('faltan_profesionales', 'falta_instrumental', 'otro')),
  detalle          text check (length(detalle) <= 200),
  actualizado_en   timestamptz not null default now(),
  actualizado_por  uuid references perfiles (id) on delete set null,
  check ((estado = 'no_operativa') = (motivo is not null))
);

alter table estado_uci_centros enable row level security;

-- Lo ve quien puede ver el centro (la política de centros se aplica en el exists)
create policy "todos ven el estado de UCI de centros visibles"
  on estado_uci_centros for select to anon, authenticated
  using (exists (select 1 from centros c where c.id = centro_id));
-- Se escribe solo con actualizar_estado_uci().

create function public.actualizar_estado_uci(
  p_centro_id  bigint,
  p_estado     text,
  p_motivo     text default null,
  p_detalle    text default null
)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  v_motivo text := case when p_estado = 'no_operativa' then coalesce(p_motivo, 'otro') end;
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    raise exception 'No puedes editar este centro';
  end if;
  if not exists (select 1 from public.centros where id = p_centro_id and tiene_uci) then
    raise exception 'Primero marca que el centro tiene UCI';
  end if;
  if p_estado not in ('disponible', 'pocos_cupos', 'sin_cupos', 'no_operativa') then
    raise exception 'Ese estado no existe';
  end if;

  insert into public.estado_uci_centros (centro_id, estado, motivo, detalle, actualizado_en, actualizado_por)
  values (p_centro_id, p_estado, v_motivo,
          case when p_estado = 'no_operativa' then nullif(left(trim(coalesce(p_detalle, '')), 200), '') end,
          now(), auth.uid())
  on conflict (centro_id) do update
    set estado = excluded.estado,
        motivo = excluded.motivo,
        detalle = excluded.detalle,
        actualizado_en = excluded.actualizado_en,
        actualizado_por = excluded.actualizado_por;
end;
$$;

revoke execute on function public.guardar_urgencias_centro, public.actualizar_estado_uci from public, anon;
grant  execute on function public.guardar_urgencias_centro, public.actualizar_estado_uci to authenticated;

-- Realtime: los cambios de estado llegan al instante a quien esté mirando
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.estado_uci_centros;
  end if;
end $$;


-- ---------- Progreso del perfil del centro ----------
create function public.progreso_perfil_centro(p_centro_id bigint)
returns jsonb
language plpgsql stable
security definer set search_path = ''
as $$
declare
  v_centro public.centros%rowtype;
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    return null;
  end if;
  select * into v_centro from public.centros where id = p_centro_id;

  return jsonb_build_object(
    'telefono', v_centro.telefono is not null,
    'horario', exists (select 1 from public.horarios_centro where centro_id = p_centro_id),
    'especialidades', exists (select 1 from public.centro_especialidades where centro_id = p_centro_id),
    'equipo', exists (select 1 from public.veterinario_centros where centro_id = p_centro_id),
    'urgencias', v_centro.urgencias_revisado_en is not null
  );
end;
$$;

revoke execute on function public.progreso_perfil_centro from public, anon;
grant  execute on function public.progreso_perfil_centro to authenticated;
