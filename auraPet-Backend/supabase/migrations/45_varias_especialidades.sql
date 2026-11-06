-- =====================================================================
-- 45 · Varias especialidades por veterinario (sin límite) y filtro al pedir hora
-- ---------------------------------------------------------------------
-- · Tabla veterinario_especialidades: todas las del catálogo que marca.
--   veterinarios.especialidad_id queda como la "principal" (la primera),
--   así las pantallas que ya la mostraban siguen funcionando.
--   veterinarios.especialidad_otra sigue siendo la escrita a mano ("Otra").
-- · Al crear la ficha (registro o superadmin) se copian la principal y,
--   si vienen en los metadatos del registro, todas las de especialidad_ids.
-- · guardar_especialidades_veterinario: el veterinario cambia las suyas;
--   el superadmin, las de cualquiera.
-- · especialidad_de_veterinario: ahora devuelve todas ("Cirugía, Dermatología").
-- · profesionales_para_cita: veterinarios que se pueden agendar (por centro
--   o independientes) con sus especialidades, para filtrar en "Solicitar cita".
--   Medicina general la tienen todos (no hace falta marcarla).
-- =====================================================================

create table veterinario_especialidades (
  veterinario_id   bigint not null references veterinarios (id) on delete cascade,
  especialidad_id  bigint not null references especialidades (id) on delete cascade,
  primary key (veterinario_id, especialidad_id)
);
create index veterinario_especialidades_especialidad_idx on veterinario_especialidades (especialidad_id);

alter table veterinario_especialidades enable row level security;
-- Es información pública del profesional (se muestra al agendar). Se escribe solo con la función de abajo.
create policy "todos ven las especialidades de los veterinarios"
  on veterinario_especialidades for select to anon, authenticated using (true);

-- Las que ya tenían
insert into veterinario_especialidades (veterinario_id, especialidad_id)
select id, especialidad_id from veterinarios where especialidad_id is not null
on conflict do nothing;

-- ---------- Al crear la ficha ----------
create function public.copiar_especialidades_veterinario()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  d jsonb;
begin
  if new.especialidad_id is not null then
    insert into public.veterinario_especialidades values (new.id, new.especialidad_id) on conflict do nothing;
  end if;

  -- Registro público: los ids elegidos vienen en los metadatos (solo los que existen)
  select coalesce(raw_user_meta_data, '{}'::jsonb) into d from auth.users where id = new.perfil_id;
  if jsonb_typeof(d -> 'especialidad_ids') = 'array' then
    insert into public.veterinario_especialidades (veterinario_id, especialidad_id)
    select new.id, e.id
    from jsonb_array_elements_text(d -> 'especialidad_ids') x
    join public.especialidades e on x ~ '^[0-9]+$' and e.id = x::bigint
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger veterinarios_copiar_especialidades
  after insert on veterinarios
  for each row execute function public.copiar_especialidades_veterinario();

-- ---------- Cambiar especialidades ----------
-- p_veterinario_id null = las mías. Deja exactamente las de p_ids.
create function public.guardar_especialidades_veterinario(
  p_ids             bigint[],
  p_otra            text default null,
  p_veterinario_id  bigint default null
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_id bigint := coalesce(p_veterinario_id, public.mi_veterinario_id());
begin
  if v_id is null then
    raise exception 'Solo los veterinarios tienen especialidades';
  end if;
  if p_veterinario_id is not null and p_veterinario_id is distinct from public.mi_veterinario_id()
     and not public.es_superadmin() then
    raise exception 'Solo puedes cambiar tus propias especialidades';
  end if;

  delete from public.veterinario_especialidades
  where veterinario_id = v_id and especialidad_id <> all (coalesce(p_ids, '{}'));

  insert into public.veterinario_especialidades (veterinario_id, especialidad_id)
  select v_id, e.id from public.especialidades e where e.id = any (coalesce(p_ids, '{}'))
  on conflict do nothing;

  update public.veterinarios
     set especialidad_id = (select e.id from public.especialidades e
                            where e.id = any (coalesce(p_ids, '{}'))
                            order by array_position(p_ids, e.id) limit 1),
         especialidad_otra = nullif(left(trim(p_otra), 80), '')
   where id = v_id;
end;
$$;

revoke execute on function public.guardar_especialidades_veterinario from public, anon;
grant  execute on function public.guardar_especialidades_veterinario to authenticated;

-- Las mías (para el formulario de Configuración)
create function public.mis_especialidades()
returns table (ids bigint[], otra text)
language sql stable security definer set search_path = ''
as $$
  select coalesce((select array_agg(ve.especialidad_id order by ve.especialidad_id)
                   from public.veterinario_especialidades ve where ve.veterinario_id = v.id), '{}'),
         v.especialidad_otra
  from public.veterinarios v
  where v.id = public.mi_veterinario_id();
$$;

revoke execute on function public.mis_especialidades from public, anon;
grant  execute on function public.mis_especialidades to authenticated;

-- ---------- Texto para mostrar: todas las especialidades ----------
create or replace function public.especialidad_de_veterinario(p_veterinario_id bigint)
returns text
language sql stable security definer set search_path = ''
as $$
  select nullif(concat_ws(', ',
           (select string_agg(e.nombre, ', ' order by e.nombre)
            from public.veterinario_especialidades ve join public.especialidades e on e.id = ve.especialidad_id
            where ve.veterinario_id = v.id),
           nullif(trim(v.especialidad_otra), '')), '')
  from public.veterinarios v
  where v.id = p_veterinario_id;
$$;

-- ---------- A quién se puede agendar, con sus especialidades ----------
-- Una fila por veterinario y centro donde atiende (centro_id null = independiente).
-- Mismas reglas que la base usa al pedir hora: aprobados, activos, del mismo mundo.
create function public.profesionales_para_cita()
returns table (
  veterinario_id   bigint,
  nombre           text,
  centro_id        bigint,
  especialidad_ids bigint[],
  especialidades   text
)
language sql stable security definer set search_path = ''
as $$
  with vets as (
    select v.id, p.nombre,
           coalesce((select array_agg(ve.especialidad_id) from public.veterinario_especialidades ve
                     where ve.veterinario_id = v.id), '{}') as ids
    from public.veterinarios v
    join public.perfiles p on p.id = v.perfil_id
    where v.estado_verificacion = 'aprobado'
      and p.desactivado_en is null
      and p.es_prueba = public.es_cuenta_de_prueba()
  )
  select x.id, x.nombre, vc.centro_id, x.ids, public.especialidad_de_veterinario(x.id)
  from vets x
  join public.veterinario_centros vc on vc.veterinario_id = x.id
  join public.centros c on c.id = vc.centro_id
  where c.estado_verificacion = 'aprobado' and c.desactivado_en is null
    and c.es_prueba = public.es_cuenta_de_prueba()
  union all
  select x.id, x.nombre, null, x.ids, public.especialidad_de_veterinario(x.id)
  from vets x
  where not exists (select 1 from public.veterinario_centros vc where vc.veterinario_id = x.id)
  order by 2;
$$;

revoke execute on function public.profesionales_para_cita from public;
grant  execute on function public.profesionales_para_cita to anon, authenticated;
