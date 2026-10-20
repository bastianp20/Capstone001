-- =====================================================================
-- AuraPet — 22: Todas las solicitudes llegan al superadmin + listar_citas
--
-- 1) Solicitudes de veterinarios
--    Problema: quien se registraba como veterinario (signUp con rol
--    'veterinario') quedaba con el perfil, pero SIN fila en veterinarios.
--    Así nunca aparecía en "Solicitudes pendientes", el superadmin no podía
--    aprobarlo y su panel quedaba vacío (sin id de veterinario).
--    Solución: al crearse un perfil veterinario se crea su ficha "pendiente".
--
--    Cuidado con crear-profesional (Edge Function del superadmin): crea la
--    cuenta y DESPUÉS inserta la ficha ya aprobada. Como perfil_id es único,
--    chocaría con la ficha automática. Para no tocar la función, antes de
--    insertar una ficha se borra la automática que siga pendiente y sin
--    revisar de esa misma persona: gana la que crea el superadmin.
--
-- 2) listar_citas(): todas las citas de la plataforma para el superadmin,
--    con búsqueda, filtros y paginación (igual idea que listar_usuarios).
-- =====================================================================

-- ---------- 1a) Ficha pendiente al crearse un perfil veterinario ----------
create function public.crear_ficha_veterinario_pendiente()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.rol = 'veterinario' then
    insert into public.veterinarios (perfil_id, estado_verificacion)
    values (new.id, 'pendiente')
    on conflict (perfil_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger al_crear_perfil_veterinario
  after insert on perfiles
  for each row execute function public.crear_ficha_veterinario_pendiente();

-- ---------- 1b) La ficha del superadmin reemplaza a la automática ----------
create function public.reemplazar_ficha_automatica()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  delete from public.veterinarios
  where perfil_id = new.perfil_id
    and estado_verificacion = 'pendiente'
    and revisado_por is null
    and numero_colegiado is null
    and especialidad_id is null;
  return new;
end;
$$;

create trigger antes_de_insertar_veterinario
  before insert on veterinarios
  for each row
  when (new.perfil_id is not null)
  execute function public.reemplazar_ficha_automatica();

-- Ojo: el trigger 1b también corre para la ficha automática de 1a, pero en
-- ese momento no hay otra fila de esa persona, así que no borra nada.

-- ---------- 1c) Arreglar a los que ya se registraron sin ficha ----------
insert into veterinarios (perfil_id, estado_verificacion)
select p.id, 'pendiente'
from perfiles p
where p.rol = 'veterinario'
  and not exists (select 1 from veterinarios v where v.perfil_id = p.id);


-- ---------- 2) listar_citas (solo superadmin) ----------
-- p_orden: 'recientes' (más nuevas primero) o 'proximas' (más cercanas primero).
-- La urgencia que se filtra y devuelve es la confirmada por el veterinario
-- o, si aún no la confirma, la sugerida por la IA.
-- total = cuántas citas cumplen los filtros (para paginar), repetido en cada fila.
create function public.listar_citas(
  p_busqueda  text default null,
  p_estado    public.estado_cita default null,
  p_urgencia  public.urgencia_cita default null,
  p_desde     timestamptz default null,
  p_hasta     timestamptz default null,
  p_orden     text default 'recientes',
  p_limite    int default 20,
  p_offset    int default 0
)
returns table (
  id              bigint,
  fecha_hora      timestamptz,
  estado          public.estado_cita,
  urgencia        public.urgencia_cita,
  motivo          text,
  mascota         text,
  especie         public.especie_mascota,
  dueno           text,
  veterinario     text,
  centro          text,
  es_prueba       boolean,
  total           bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_busqueda text := nullif(trim(p_busqueda), '');
begin
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede ver todas las citas';
  end if;

  return query
    select c.id, c.fecha_hora, c.estado,
           coalesce(c.urgencia, c.urgencia_sugerida) as urgencia,
           c.motivo, m.nombre, m.especie, pd.nombre, pv.nombre, ce.nombre, ce.es_prueba,
           count(*) over () as total
    from public.citas c
    join public.mascotas m        on m.id = c.mascota_id
    left join public.perfiles pd  on pd.id = m.dueno_id
    left join public.veterinarios v on v.id = c.veterinario_id
    left join public.perfiles pv  on pv.id = v.perfil_id
    join public.centros ce        on ce.id = c.centro_id
    where (p_estado is null or c.estado = p_estado)
      and (p_urgencia is null or coalesce(c.urgencia, c.urgencia_sugerida) = p_urgencia)
      and (p_desde is null or c.fecha_hora >= p_desde)
      and (p_hasta is null or c.fecha_hora < p_hasta)
      and (v_busqueda is null
           or m.nombre  ilike '%' || v_busqueda || '%'
           or pd.nombre ilike '%' || v_busqueda || '%'
           or pv.nombre ilike '%' || v_busqueda || '%'
           or ce.nombre ilike '%' || v_busqueda || '%')
    order by
      case when p_orden = 'proximas' then c.fecha_hora end asc,
      case when p_orden <> 'proximas' then c.fecha_hora end desc
    limit greatest(1, least(p_limite, 100))
    offset greatest(0, p_offset);
end;
$$;

revoke execute on function public.listar_citas from public, anon;
grant  execute on function public.listar_citas to authenticated;
