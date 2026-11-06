-- =====================================================================
-- AuraPet — 21: El superadmin aprueba o rechaza una solicitud de centro
--
-- Las solicitudes llegan desde /solicitar-centro (migración 20).
--   · Aprobar: crea el centro real reutilizando crear_centro() (migración 06),
--     así queda igual que uno creado a mano: aprobado y con sus especialidades.
--     Los horarios y el equipo se configuran después, como siempre.
--   · Rechazar: exige un motivo.
-- En ambos casos queda registrado quién la revisó y cuándo.
-- La cuenta del responsable NO se crea aquí: el superadmin la crea después
-- (Crear → Cuenta administrativa / profesional, "Hacer administrador del centro").
-- =====================================================================

create function public.resolver_solicitud_centro(
  p_solicitud_id  bigint,
  p_decision      public.estado_verificacion,
  p_motivo        text default null
)
returns bigint            -- id del centro creado (null si se rechazó)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_solicitud  public.solicitudes_centro%rowtype;
  v_centro_id  bigint;
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede resolver solicitudes';
  end if;

  select * into v_solicitud
  from public.solicitudes_centro
  where id = p_solicitud_id
  for update;

  if not found then
    raise exception 'La solicitud no existe';
  end if;

  if v_solicitud.estado <> 'pendiente' then
    raise exception 'Esta solicitud ya fue revisada';
  end if;

  if p_decision = 'aprobado' then
    v_centro_id := public.crear_centro(
      p_nombre           => v_solicitud.nombre_centro,
      p_direccion        => v_solicitud.direccion,
      p_comuna           => v_solicitud.comuna,
      p_telefono         => v_solicitud.telefono_centro,
      p_especialidad_ids => v_solicitud.especialidad_ids
    );

    update public.solicitudes_centro
    set estado = 'aprobado', centro_id = v_centro_id,
        revisado_por = auth.uid(), revisado_en = now()
    where id = p_solicitud_id;

  elsif p_decision = 'rechazado' then
    if nullif(trim(p_motivo), '') is null then
      raise exception 'Debes indicar el motivo del rechazo';
    end if;

    update public.solicitudes_centro
    set estado = 'rechazado', motivo_rechazo = left(trim(p_motivo), 500),
        revisado_por = auth.uid(), revisado_en = now()
    where id = p_solicitud_id;

  else
    raise exception 'Decisión inválida';
  end if;

  return v_centro_id;
end;
$$;

revoke execute on function public.resolver_solicitud_centro from public, anon;
grant  execute on function public.resolver_solicitud_centro to authenticated;
