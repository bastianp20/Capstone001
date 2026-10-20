-- =====================================================================
-- AuraPet — 28: Límites de los planes y gestión de suscripciones (superadmin)
--
-- 1) Estado "efectivo": una prueba cuyo fin_prueba ya pasó, o un plan activo
--    cuya renovación ya pasó, cuenta como 'vencida' (sin pagos en línea, no
--    hay un proceso que lo cambie solo, así que se calcula al leer).
-- 2) El tope: no se puede sumar un veterinario a un centro que ya llegó al
--    límite de su plan (planes.limite_veterinarios) o cuya suscripción venció.
--    Aplica a TODOS los caminos (aprobación, superadmin, admin del centro)
--    porque es un trigger sobre veterinario_centros.
-- 3) El superadmin ve todas las suscripciones, activa o rechaza las
--    solicitudes de cambio de plan y puede extender pruebas.
-- =====================================================================

-- ---------- 1) Estado efectivo ----------
create function public.estado_efectivo_suscripcion(
  p_estado public.estado_suscripcion, p_fin_prueba date, p_renovacion date
) returns public.estado_suscripcion
language sql stable set search_path = ''
as $$
  select case
    when p_estado = 'prueba' and p_fin_prueba is not null and p_fin_prueba < current_date then 'vencida'::public.estado_suscripcion
    when p_estado = 'activa' and p_renovacion is not null and p_renovacion < current_date then 'vencida'::public.estado_suscripcion
    else p_estado
  end;
$$;

-- resumen_suscripcion (migración 24) ahora devuelve el estado efectivo
create or replace function public.resumen_suscripcion(p_centro_id bigint)
returns table (
  plan_id text, estado public.estado_suscripcion, inicio date, fin_prueba date,
  renovacion date, veterinarios integer, citas_mes integer, plan_solicitado text
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not (public.es_admin_de_centro(p_centro_id) or public.es_superadmin()) then
    raise exception 'No administras este centro';
  end if;

  return query
    select s.plan_id,
           public.estado_efectivo_suscripcion(s.estado, s.fin_prueba, s.renovacion),
           s.inicio, s.fin_prueba, s.renovacion,
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

-- ---------- 2) Tope de veterinarios por plan ----------
create function public.validar_limite_veterinarios()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_limite   integer;
  v_plan     text;
  v_estado   text;                                 -- estado efectivo como texto
  v_actuales integer;
  v_centro   text;
begin
  select p.limite_veterinarios, p.nombre,
         public.estado_efectivo_suscripcion(s.estado, s.fin_prueba, s.renovacion)::text
    into v_limite, v_plan, v_estado
  from public.suscripciones_centro s
  join public.planes p on p.id = s.plan_id
  where s.centro_id = new.centro_id;

  if not found then
    return new;                                  -- centro sin suscripción (no debería pasar)
  end if;

  select nombre into v_centro from public.centros where id = new.centro_id;

  if v_estado in ('vencida', 'cancelada') then
    raise exception 'La suscripción de % está %: no se pueden sumar veterinarios hasta renovarla', v_centro, v_estado;
  end if;

  if v_limite is not null then
    select count(*) into v_actuales from public.veterinario_centros where centro_id = new.centro_id;
    if v_actuales >= v_limite then
      raise exception '% ya tiene % veterinario(s), el máximo del plan %. Para sumar más debe cambiar de plan', v_centro, v_actuales, v_plan;
    end if;
  end if;

  return new;
end;
$$;

create trigger tope_veterinarios_por_plan
  before insert on veterinario_centros
  for each row execute function public.validar_limite_veterinarios();

-- ---------- 3a) Todas las suscripciones (pantalla del superadmin) ----------
create function public.listar_suscripciones()
returns table (
  centro_id         bigint,
  centro            text,
  comuna            text,
  es_prueba         boolean,
  plan_id           text,
  estado            public.estado_suscripcion,
  inicio            date,
  fin_prueba        date,
  renovacion        date,
  veterinarios      integer,
  limite            integer,
  solicitud_id      bigint,
  plan_solicitado   text,
  mensaje           text,
  solicitado_por    text,
  solicitado_en     timestamptz
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin ve las suscripciones';
  end if;

  return query
    select c.id, c.nombre, c.comuna, c.es_prueba,
           s.plan_id,
           public.estado_efectivo_suscripcion(s.estado, s.fin_prueba, s.renovacion),
           s.inicio, s.fin_prueba, s.renovacion,
           (select count(*)::int from public.veterinario_centros vc where vc.centro_id = c.id),
           p.limite_veterinarios,
           sp.id, sp.plan_id, sp.mensaje, pf.nombre, sp.creado_en
    from public.suscripciones_centro s
    join public.centros c on c.id = s.centro_id
    join public.planes p on p.id = s.plan_id
    left join public.solicitudes_plan sp on sp.centro_id = c.id and sp.estado = 'pendiente'
    left join public.perfiles pf on pf.id = sp.solicitado_por
    order by (sp.id is null), sp.creado_en, c.nombre;   -- primero las que esperan respuesta
end;
$$;

revoke execute on function public.listar_suscripciones from public, anon;
grant  execute on function public.listar_suscripciones to authenticated;

-- ---------- 3b) Activar o rechazar una solicitud de cambio de plan ----------
create function public.resolver_solicitud_plan(p_solicitud_id bigint, p_aprobar boolean, p_meses integer default 1)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_sol       public.solicitudes_plan%rowtype;
  v_plan      public.planes%rowtype;
  v_actuales  integer;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin atiende solicitudes de plan';
  end if;

  select * into v_sol from public.solicitudes_plan where id = p_solicitud_id and estado = 'pendiente' for update;
  if not found then
    raise exception 'Esa solicitud ya no está pendiente';
  end if;

  select * into v_plan from public.planes where id = v_sol.plan_id;

  if p_aprobar then
    if p_meses is null or p_meses < 1 or p_meses > 24 then
      raise exception 'Los meses deben estar entre 1 y 24';
    end if;

    -- Bajar a un plan con tope no puede dejar al centro sobre el límite
    select count(*) into v_actuales from public.veterinario_centros where centro_id = v_sol.centro_id;
    if v_plan.limite_veterinarios is not null and v_actuales > v_plan.limite_veterinarios then
      raise exception 'El centro tiene % veterinarios y el plan % permite %. Primero debe quitar veterinarios',
        v_actuales, v_plan.nombre, v_plan.limite_veterinarios;
    end if;

    update public.suscripciones_centro
       set plan_id = v_plan.id,
           estado = 'activa',
           inicio = current_date,
           fin_prueba = null,
           renovacion = (current_date + make_interval(months => p_meses))::date,
           actualizado_en = now()
     where centro_id = v_sol.centro_id;

    update public.solicitudes_plan set estado = 'atendida' where id = v_sol.id;

    update public.historial_suscripcion set estado = 'completado'
     where centro_id = v_sol.centro_id and estado = 'pendiente';

    insert into public.historial_suscripcion (centro_id, accion, detalle)
    values (v_sol.centro_id, 'Plan activado', v_plan.nombre || ' · ' || p_meses || ' mes(es)');
  else
    update public.solicitudes_plan set estado = 'rechazada' where id = v_sol.id;

    update public.historial_suscripcion set estado = 'rechazado'
     where centro_id = v_sol.centro_id and estado = 'pendiente';
  end if;
end;
$$;

revoke execute on function public.resolver_solicitud_plan from public, anon;
grant  execute on function public.resolver_solicitud_plan to authenticated;

-- ---------- 3c) Extender la prueba o la renovación ----------
-- Suma días a la fecha que corresponda (fin_prueba o renovacion). Si ya había
-- vencido, cuenta desde hoy. Una prueba vencida vuelve a quedar en prueba.
create function public.extender_suscripcion(p_centro_id bigint, p_dias integer)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_s public.suscripciones_centro%rowtype;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin extiende suscripciones';
  end if;
  if p_dias is null or p_dias < 1 or p_dias > 365 then
    raise exception 'Los días deben estar entre 1 y 365';
  end if;

  select * into v_s from public.suscripciones_centro where centro_id = p_centro_id for update;
  if not found then
    raise exception 'Ese centro no tiene suscripción';
  end if;

  if v_s.estado in ('prueba', 'vencida', 'cancelada') and v_s.renovacion is null then
    update public.suscripciones_centro
       set estado = 'prueba',
           fin_prueba = greatest(coalesce(v_s.fin_prueba, current_date), current_date) + p_dias,
           actualizado_en = now()
     where centro_id = p_centro_id;
  else
    update public.suscripciones_centro
       set estado = 'activa',
           renovacion = greatest(coalesce(v_s.renovacion, current_date), current_date) + p_dias,
           actualizado_en = now()
     where centro_id = p_centro_id;
  end if;

  insert into public.historial_suscripcion (centro_id, accion, detalle)
  values (p_centro_id, 'Extensión', '+' || p_dias || ' días');
end;
$$;

revoke execute on function public.extender_suscripcion from public, anon;
grant  execute on function public.extender_suscripcion to authenticated;
