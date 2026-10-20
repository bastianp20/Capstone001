-- =====================================================================
-- AuraPet — 23: Al registrarse, el veterinario dice dónde trabaja y su especialidad
--
-- En el registro (público o desde el superadmin) el veterinario indica:
--   · Dónde trabaja:
--       - de forma independiente (sin centro),
--       - en un centro que ya está en AuraPet, o
--       - en un centro que TODAVÍA no está en AuraPet (nombre y comuna en texto:
--         sirve para invitar a ese centro más adelante).
--   · Su especialidad, además de medicina general: del catálogo o escrita
--     a mano si no está (p. ej. "Etología").
--
-- Si se registra solo, NO queda asignado al centro de inmediato (cualquiera
-- podría decir que trabaja en cualquier parte): queda como "centro solicitado"
-- y se asigna recién cuando el superadmin aprueba su cuenta.
-- =====================================================================

alter table veterinarios
  add column especialidad_otra        text check (length(especialidad_otra) <= 80),
  add column centro_solicitado_id     bigint references centros (id) on delete set null,
  add column centro_mencionado        text check (length(centro_mencionado) <= 120),
  add column centro_mencionado_comuna text check (length(centro_mencionado_comuna) <= 80);

comment on column veterinarios.centro_solicitado_id is
  'Centro de AuraPet donde dice trabajar al registrarse; se asigna al aprobar su cuenta.';
comment on column veterinarios.centro_mencionado is
  'Centro que aún no está en AuraPet (texto libre), para invitarlo más adelante.';

-- ---------- La ficha automática ahora guarda lo que puso al registrarse ----------
-- (reemplaza la de la migración 22). Los datos vienen en los metadatos del
-- signUp: especialidad_id, especialidad_otra, centro_id, centro_nombre, centro_comuna.
create or replace function public.crear_ficha_veterinario_pendiente()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  d                jsonb;
  v_especialidad   bigint;
  v_centro         bigint;
begin
  if new.rol <> 'veterinario' then
    return new;
  end if;

  select coalesce(raw_user_meta_data, '{}'::jsonb) into d from auth.users where id = new.id;
  d := coalesce(d, '{}'::jsonb);

  -- Solo ids que existen (y centros aprobados y reales)
  if d ->> 'especialidad_id' ~ '^[0-9]+$' then
    select id into v_especialidad from public.especialidades where id = (d ->> 'especialidad_id')::bigint;
  end if;
  if d ->> 'centro_id' ~ '^[0-9]+$' then
    select id into v_centro from public.centros
    where id = (d ->> 'centro_id')::bigint and estado_verificacion = 'aprobado' and not es_prueba;
  end if;

  insert into public.veterinarios (
    perfil_id, estado_verificacion, especialidad_id, especialidad_otra,
    centro_solicitado_id, centro_mencionado, centro_mencionado_comuna
  ) values (
    new.id, 'pendiente', v_especialidad,
    nullif(left(trim(d ->> 'especialidad_otra'), 80), ''),
    v_centro,
    case when v_centro is null then nullif(left(trim(d ->> 'centro_nombre'), 120), '') end,
    case when v_centro is null then nullif(left(trim(d ->> 'centro_comuna'), 80), '') end
  )
  on conflict (perfil_id) do nothing;

  return new;
end;
$$;

-- ---------- La ficha del superadmin reemplaza a cualquier automática sin revisar ----------
-- (reemplaza la de la migración 22: ahora la automática puede traer especialidad)
create or replace function public.reemplazar_ficha_automatica()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  delete from public.veterinarios
  where perfil_id = new.perfil_id
    and estado_verificacion = 'pendiente'
    and revisado_por is null;
  return new;
end;
$$;

-- ---------- Al aprobarlo, queda asignado al centro que pidió ----------
create function public.asignar_centro_solicitado()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.estado_verificacion = 'aprobado'
     and old.estado_verificacion is distinct from 'aprobado'
     and new.centro_solicitado_id is not null then
    insert into public.veterinario_centros (veterinario_id, centro_id)
    values (new.id, new.centro_solicitado_id)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger al_aprobar_veterinario
  after update of estado_verificacion on veterinarios
  for each row execute function public.asignar_centro_solicitado();
