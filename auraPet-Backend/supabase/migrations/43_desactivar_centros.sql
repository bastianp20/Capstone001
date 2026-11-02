-- =====================================================================
-- 43 · "Eliminar" un centro (superadmin) = desactivarlo
-- ---------------------------------------------------------------------
-- Igual que con las cuentas (migración 32): no se borra nada, así se
-- conserva el historial de citas, fichas y derivaciones. Un centro
-- desactivado:
--   · deja de aparecer para dueños, veterinarios y visitantes;
--   · no recibe citas, derivaciones ni nuevos integrantes;
--   · sus citas futuras (pendientes o confirmadas) quedan canceladas con
--     el motivo, para que cada dueño lo vea.
-- Quien lo administra, sus veterinarios y el superadmin lo siguen viendo
-- (para el historial). El superadmin lo puede reactivar.
-- =====================================================================

alter table centros
  add column desactivado_en       timestamptz,
  add column desactivado_por      uuid references perfiles (id) on delete set null,
  add column motivo_desactivacion text check (length(motivo_desactivacion) <= 500);

-- ---------- Quién lo ve (la de la migración 41, más "no desactivado") ----------
drop policy "cada mundo ve sus centros aprobados; admins, sus vets y superadmin, los suyos" on centros;

create policy "cada mundo ve sus centros activos; admins, sus vets y superadmin, los suyos"
  on centros for select to anon, authenticated
  using (
    (estado_verificacion = 'aprobado' and desactivado_en is null and es_prueba = public.es_cuenta_de_prueba())
    or public.es_superadmin()
    or public.es_admin_de_centro(id)
    or public.es_veterinario_de_centro(id)
  );

-- ¿Este centro está activo? (para los triggers de abajo)
create function public.centro_activo(p_centro_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.centros where id = p_centro_id and desactivado_en is null);
$$;

-- ---------- Nada nuevo para un centro desactivado ----------
create function public.bloquear_centro_desactivado()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  -- derivaciones usa a_centro_id; citas, veterinario_centros y admins_centro, centro_id
  v_centro bigint := coalesce(to_jsonb(new) ->> 'a_centro_id', to_jsonb(new) ->> 'centro_id')::bigint;
begin
  if v_centro is not null and not public.centro_activo(v_centro) then
    raise exception 'Este centro ya no atiende en AuraPet';
  end if;
  return new;
end;
$$;

create trigger citas_centro_activo
  before insert on citas for each row execute function public.bloquear_centro_desactivado();
create trigger derivaciones_centro_activo
  before insert on derivaciones for each row execute function public.bloquear_centro_desactivado();
create trigger veterinario_centros_centro_activo
  before insert on veterinario_centros for each row execute function public.bloquear_centro_desactivado();
create trigger admins_centro_centro_activo
  before insert on admins_centro for each row execute function public.bloquear_centro_desactivado();

-- ---------- A quién se puede derivar (migración 29 + 41, sin desactivados) ----------
create or replace function public.destinos_derivacion()
returns table (tipo text, id bigint, nombre text, detalle text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if public.mi_veterinario_id() is null then
    raise exception 'Solo los veterinarios pueden derivar';
  end if;

  return query
    select 'veterinario'::text, v.id, p.nombre, coalesce(e.nombre, v.especialidad_otra, 'Medicina general')
    from public.veterinarios v
    join public.perfiles p on p.id = v.perfil_id
    left join public.especialidades e on e.id = v.especialidad_id
    where v.estado_verificacion = 'aprobado'
      and v.id <> public.mi_veterinario_id()
      and p.desactivado_en is null
      and p.es_prueba = public.es_cuenta_de_prueba()
    union all
    select 'centro'::text, c.id, c.nombre, c.comuna
    from public.centros c
    where c.estado_verificacion = 'aprobado'
      and c.desactivado_en is null
      and c.es_prueba = public.es_cuenta_de_prueba()
    order by 1 desc, 3;
end;
$$;

-- ---------- Desactivar / reactivar (solo superadmin) ----------
-- Devuelve cuántas citas futuras se cancelaron.
create function public.desactivar_centro(p_centro_id bigint, p_motivo text)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_canceladas integer;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin puede eliminar centros';
  end if;
  if nullif(trim(p_motivo), '') is null then
    raise exception 'Escribe el motivo';
  end if;

  update public.centros
     set desactivado_en = now(), desactivado_por = auth.uid(), motivo_desactivacion = left(trim(p_motivo), 500)
   where id = p_centro_id and desactivado_en is null;
  if not found then
    raise exception 'Ese centro no existe o ya está eliminado';
  end if;

  update public.citas
     set estado = 'cancelada', cancelada_por = auth.uid(),
         motivo_cancelacion = 'El centro dejó de atender en AuraPet'
   where centro_id = p_centro_id and estado in ('pendiente', 'confirmada') and fecha_hora > now();
  get diagnostics v_canceladas = row_count;
  return v_canceladas;
end;
$$;

create function public.reactivar_centro(p_centro_id bigint)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin puede reactivar centros';
  end if;
  update public.centros
     set desactivado_en = null, desactivado_por = null, motivo_desactivacion = null
   where id = p_centro_id and desactivado_en is not null;
  if not found then
    raise exception 'Ese centro no está eliminado';
  end if;
end;
$$;

revoke execute on function public.centro_activo, public.desactivar_centro, public.reactivar_centro from public, anon;
grant  execute on function public.centro_activo, public.desactivar_centro, public.reactivar_centro to authenticated;
