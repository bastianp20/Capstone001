-- =====================================================================
-- AuraPet — 06: Crear centro (desde el panel de superadmin)
--
-- Un centro son varias filas que deben guardarse juntas:
--   centros + horarios_centro + centro_especialidades
-- Esta función lo hace en UNA transacción: si algo falla (por ejemplo,
-- un horario inválido), no queda un centro a medias.
--
-- security invoker = corre con los permisos de quien la llama, así que
-- además del chequeo de abajo se aplican las mismas reglas RLS de siempre.
--
-- Como lo crea el superadmin, el centro queda aprobado de inmediato.
-- Los admins del centro se asignan después, al crear sus profesionales
-- ("Hacer administrador del centro").
--
-- p_horarios: arreglo JSON, un elemento por día que atiende:
--   [{"dia_semana":1,"abre":"09:00","cierra":"19:00",
--     "inicio_colacion":"14:00","fin_colacion":"15:00"}, ...]
--   (la colación es opcional; los días sin elemento quedan cerrados)
-- =====================================================================
create function public.crear_centro(
  p_nombre            text,
  p_direccion         text,
  p_comuna            text,
  p_telefono          bigint   default null,
  p_es_prueba         boolean  default false,
  p_horarios          jsonb    default '[]'::jsonb,
  p_especialidad_ids  bigint[] default '{}'
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_centro_id bigint;
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede crear centros';
  end if;

  if coalesce(trim(p_nombre), '') = ''
     or coalesce(trim(p_direccion), '') = ''
     or coalesce(trim(p_comuna), '') = '' then
    raise exception 'Faltan nombre, dirección o comuna';
  end if;

  -- 1) El centro
  insert into public.centros
    (creado_por, nombre, direccion, comuna, telefono, es_prueba,
     estado_verificacion, revisado_por, revisado_en)
  values
    (auth.uid(), trim(p_nombre), trim(p_direccion), trim(p_comuna), p_telefono, p_es_prueba,
     'aprobado', auth.uid(), now())
  returning id into v_centro_id;

  -- 2) Horarios (los checks de la tabla validan cierra > abre y la colación)
  insert into public.horarios_centro
    (centro_id, dia_semana, abre, cierra, inicio_colacion, fin_colacion)
  select v_centro_id, h.dia_semana, h.abre, h.cierra, h.inicio_colacion, h.fin_colacion
  from jsonb_to_recordset(coalesce(p_horarios, '[]'::jsonb)) as h(
    dia_semana smallint, abre time, cierra time, inicio_colacion time, fin_colacion time
  );

  -- 3) Especialidades
  insert into public.centro_especialidades (centro_id, especialidad_id)
  select distinct v_centro_id, unnest(coalesce(p_especialidad_ids, '{}'));

  return v_centro_id;
end;
$$;

-- Solo usuarios con sesión pueden llamarla (y adentro se revisa que sea superadmin)
revoke execute on function public.crear_centro from public, anon;
grant  execute on function public.crear_centro to authenticated;
