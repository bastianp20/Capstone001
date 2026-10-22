-- =====================================================================
-- AuraPet — 24: Suscripciones de los centros
--
-- Los dueños usan AuraPet gratis; los centros tienen un plan mensual:
--   · inicial      — gratis / 30 días de prueba, hasta 2 veterinarios
--   · profesional  — equipo ilimitado, fichas, IA, reportes
--   · gestion      — todo + el equipo de AuraPet apoya la operación
--
-- Por ahora NO hay pagos en línea: el admin del centro SOLICITA un cambio de
-- plan (solicitar_cambio_plan) y el superadmin lo activa a mano.
-- Cada centro nuevo parte automáticamente con 30 días de prueba del plan inicial.
-- =====================================================================

create type estado_suscripcion as enum ('prueba', 'activa', 'vencida', 'cancelada');

-- ---------- Catálogo de planes ----------
create table planes (
  id                   text primary key,                 -- 'inicial' | 'profesional' | 'gestion'
  nombre               text not null,
  precio_mensual       integer not null check (precio_mensual >= 0),  -- CLP
  limite_veterinarios  integer check (limite_veterinarios > 0),       -- null = ilimitado
  orden                smallint not null
);

insert into planes (id, nombre, precio_mensual, limite_veterinarios, orden) values
  ('inicial',     'Inicial',          0,     2,    1),
  ('profesional', 'Profesional',      29990, null, 2),
  ('gestion',     'Gestión asistida', 59990, null, 3);

-- ---------- Suscripción de cada centro (una por centro) ----------
create table suscripciones_centro (
  centro_id      bigint primary key references centros (id) on delete cascade,
  plan_id        text not null references planes (id),
  estado         estado_suscripcion not null default 'prueba',
  inicio         date not null default current_date,
  fin_prueba     date,                                    -- solo si está en prueba
  renovacion     date,                                    -- próxima renovación (si está activa)
  actualizado_en timestamptz not null default now()
);

-- ---------- Historial (activaciones, cambios, solicitudes) ----------
create table historial_suscripcion (
  id         bigint generated always as identity primary key,
  centro_id  bigint not null references centros (id) on delete cascade,
  accion     text not null,                               -- "Activación de prueba", "Solicitud de cambio de plan"...
  detalle    text,                                        -- "Plan Inicial", "A Profesional"...
  estado     text not null default 'completado' check (estado in ('completado', 'pendiente', 'rechazado')),
  creado_en  timestamptz not null default now()
);

create index on historial_suscripcion (centro_id, creado_en desc);

-- ---------- Solicitudes de cambio de plan ----------
create table solicitudes_plan (
  id             bigint generated always as identity primary key,
  centro_id      bigint not null references centros (id) on delete cascade,
  plan_id        text not null references planes (id),
  mensaje        text check (length(mensaje) <= 500),
  solicitado_por uuid references perfiles (id) on delete set null,
  estado         text not null default 'pendiente' check (estado in ('pendiente', 'atendida', 'rechazada')),
  creado_en      timestamptz not null default now()
);

-- Una sola solicitud pendiente por centro
create unique index solicitudes_plan_una_pendiente on solicitudes_plan (centro_id) where estado = 'pendiente';

-- ---------- Permisos ----------
alter table planes                enable row level security;
alter table suscripciones_centro  enable row level security;
alter table historial_suscripcion enable row level security;
alter table solicitudes_plan      enable row level security;

create policy "todos ven los planes"
  on planes for select to anon, authenticated using (true);

create policy "el admin del centro o el superadmin ven la suscripción"
  on suscripciones_centro for select to authenticated
  using (public.es_admin_de_centro(centro_id) or public.es_superadmin());

create policy "el superadmin cambia suscripciones"
  on suscripciones_centro for update to authenticated
  using (public.es_superadmin()) with check (public.es_superadmin());

create policy "el admin del centro o el superadmin ven el historial"
  on historial_suscripcion for select to authenticated
  using (public.es_admin_de_centro(centro_id) or public.es_superadmin());

create policy "el admin del centro o el superadmin ven las solicitudes de plan"
  on solicitudes_plan for select to authenticated
  using (public.es_admin_de_centro(centro_id) or public.es_superadmin());

create policy "el superadmin atiende solicitudes de plan"
  on solicitudes_plan for update to authenticated
  using (public.es_superadmin()) with check (public.es_superadmin());

-- ---------- Cada centro nuevo parte con 30 días de prueba ----------
create function public.iniciar_prueba_centro()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.suscripciones_centro (centro_id, plan_id, estado, inicio, fin_prueba)
  values (new.id, 'inicial', 'prueba', current_date, current_date + 30)
  on conflict (centro_id) do nothing;

  insert into public.historial_suscripcion (centro_id, accion, detalle)
  values (new.id, 'Activación de prueba', 'Plan Inicial · 30 días');
  return new;
end;
$$;

create trigger al_crear_centro_iniciar_prueba
  after insert on centros
  for each row execute function public.iniciar_prueba_centro();

-- Los centros que ya existen también parten con su prueba
insert into suscripciones_centro (centro_id, plan_id, estado, inicio, fin_prueba)
select id, 'inicial', 'prueba', current_date, current_date + 30 from centros
on conflict (centro_id) do nothing;

insert into historial_suscripcion (centro_id, accion, detalle)
select id, 'Activación de prueba', 'Plan Inicial · 30 días' from centros;

-- ---------- Resumen de la suscripción (pantalla "Suscripción") ----------
-- Plan, estado, fechas y uso real del centro (veterinarios y citas del mes).
create function public.resumen_suscripcion(p_centro_id bigint)
returns table (
  plan_id               text,
  estado                public.estado_suscripcion,
  inicio                date,
  fin_prueba            date,
  renovacion            date,
  veterinarios          integer,
  citas_mes             integer,
  plan_solicitado       text            -- plan de la solicitud pendiente (si hay)
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (public.es_admin_de_centro(p_centro_id) or public.es_superadmin()) then
    raise exception 'No administras este centro';
  end if;

  return query
    select s.plan_id, s.estado, s.inicio, s.fin_prueba, s.renovacion,
           (select count(*)::int from public.veterinario_centros vc where vc.centro_id = p_centro_id),
           (select count(*)::int from public.citas c
             where c.centro_id = p_centro_id
               and c.fecha_hora >= date_trunc('month', now())
               and c.estado <> 'cancelada'),
           (select sp.plan_id from public.solicitudes_plan sp
             where sp.centro_id = p_centro_id and sp.estado = 'pendiente' limit 1)
    from public.suscripciones_centro s
    where s.centro_id = p_centro_id;
end;
$$;

revoke execute on function public.resumen_suscripcion from public, anon;
grant  execute on function public.resumen_suscripcion to authenticated;

-- ---------- El admin del centro solicita un cambio de plan ----------
create function public.solicitar_cambio_plan(p_centro_id bigint, p_plan_id text, p_mensaje text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nombre_plan text;
begin
  if not public.es_admin_de_centro(p_centro_id) then
    raise exception 'Solo el admin del centro puede cambiar el plan';
  end if;

  select nombre into v_nombre_plan from public.planes where id = p_plan_id;
  if v_nombre_plan is null then
    raise exception 'Ese plan no existe';
  end if;

  if exists (select 1 from public.suscripciones_centro
             where centro_id = p_centro_id and plan_id = p_plan_id and estado = 'activa') then
    raise exception 'Ya tienes ese plan activo';
  end if;

  if exists (select 1 from public.solicitudes_plan where centro_id = p_centro_id and estado = 'pendiente') then
    raise exception 'Ya hay una solicitud de cambio de plan en revisión';
  end if;

  insert into public.solicitudes_plan (centro_id, plan_id, mensaje, solicitado_por)
  values (p_centro_id, p_plan_id, nullif(left(trim(p_mensaje), 500), ''), auth.uid());

  insert into public.historial_suscripcion (centro_id, accion, detalle, estado)
  values (p_centro_id, 'Solicitud de cambio de plan', 'A ' || v_nombre_plan, 'pendiente');
end;
$$;

revoke execute on function public.solicitar_cambio_plan from public, anon;
grant  execute on function public.solicitar_cambio_plan to authenticated;
