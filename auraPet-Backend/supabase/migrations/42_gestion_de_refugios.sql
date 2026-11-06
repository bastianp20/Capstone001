-- =====================================================================
-- 42 · Gestión de refugios (panel del superadmin y "Mi refugio")
-- ---------------------------------------------------------------------
-- · refugios.cupos_actualizados_en: cuándo se tocaron cupos o recepción.
-- · Trigger preparar_refugio:
--     - quien administra NO cambia nombre, comuna, región, verificación
--       ni si es de prueba (eso lo gestiona el equipo AuraPet);
--     - cupos ocupados nunca superan los totales;
--     - el superadmin solo cambia "de prueba" si sus administradores y
--       animales quedan del mismo mundo.
-- · Quien administra un refugio gestiona los animales publicados a nombre
--   del refugio (postulaciones, elegir familia, cerrar, retirar), aunque
--   los haya publicado otra persona del equipo.
-- · Superadmin: admin_listar_refugios, guardar_refugio (crea/edita y
--   sincroniza administradores), verificar_refugio, buscar_cuentas.
-- · Mi refugio: detalle_mi_refugio, animales_de_mi_refugio (mismas columnas
--   que mis_publicaciones).
-- =====================================================================

alter table refugios add column cupos_actualizados_en timestamptz not null default now();

create function public.preparar_refugio()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.cupos_ocupados > new.cupos_totales then
    raise exception 'Los cupos ocupados no pueden superar los totales';
  end if;

  if tg_op = 'UPDATE' then
    if not public.es_superadmin() and (
         new.nombre is distinct from old.nombre or new.comuna is distinct from old.comuna
         or new.region is distinct from old.region
         or new.estado_verificacion is distinct from old.estado_verificacion
         or new.es_prueba is distinct from old.es_prueba) then
      raise exception 'Nombre, región y verificación los gestiona el equipo AuraPet';
    end if;

    if new.es_prueba is distinct from old.es_prueba and (
         exists (select 1 from public.admins_refugio ar join public.perfiles p on p.id = ar.perfil_id
                 where ar.refugio_id = new.id and p.es_prueba <> new.es_prueba)
         or exists (select 1 from public.adopciones a where a.refugio_id = new.id and a.es_prueba <> new.es_prueba)) then
      raise exception 'Este refugio tiene administradores o animales del otro tipo de cuenta (prueba/real)';
    end if;

    if new.cupos_ocupados is distinct from old.cupos_ocupados
       or new.cupos_totales is distinct from old.cupos_totales
       or new.recibe_animales is distinct from old.recibe_animales then
      new.cupos_actualizados_en := now();
    end if;
  end if;
  return new;
end;
$$;

create trigger refugios_preparar
  before insert or update on refugios
  for each row execute function public.preparar_refugio();

-- ---------- ¿Puedo gestionar esta publicación? ----------
-- Quien la publicó, o quien administra el refugio a cuyo nombre está.
create function public.puedo_gestionar_adopcion(p_adopcion_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.adopciones a
    where a.id = p_adopcion_id
      and (a.publicado_por = auth.uid()
           or (a.refugio_id is not null and public.es_admin_de_refugio(a.refugio_id)))
  );
$$;

revoke execute on function public.puedo_gestionar_adopcion from public, anon;
grant  execute on function public.puedo_gestionar_adopcion to authenticated;

-- El equipo del refugio también retira / vuelve a publicar sus animales
create policy "el equipo del refugio edita sus animales"
  on adopciones for update to authenticated
  using (refugio_id is not null and public.es_admin_de_refugio(refugio_id))
  with check (refugio_id is not null and public.es_admin_de_refugio(refugio_id));

-- =====================================================================
-- SUPERADMIN
-- =====================================================================
create function public.admin_listar_refugios()
returns table (
  id                    bigint,
  nombre                text,
  comuna                text,
  region                text,
  descripcion           text,
  logo_url              text,
  portada_url           text,
  telefono              bigint,
  correo                text,
  cupos_totales         int,
  cupos_ocupados        int,
  recibe_animales       text,
  especies              text[],
  estado                text,
  es_prueba             boolean,
  creado_en             timestamptz,
  animales              bigint,
  fotos                 text[],
  administradores       jsonb      -- [{"id","nombre","correo","es_prueba"}]
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin ve esta lista';
  end if;
  return query
    select r.id, r.nombre, r.comuna, r.region, r.descripcion, r.logo_url, r.portada_url, r.telefono, r.correo,
           r.cupos_totales, r.cupos_ocupados, r.recibe_animales, r.especies, r.estado_verificacion::text,
           r.es_prueba, r.creado_en,
           (select count(*) from public.adopciones a where a.refugio_id = r.id and a.estado in ('publicada', 'en_proceso')),
           coalesce((select array_agg(f) from (
              select coalesce(a.fotos[1], a.foto_url) f from public.adopciones a
              where a.refugio_id = r.id and a.estado in ('publicada', 'en_proceso')
                and coalesce(a.fotos[1], a.foto_url) is not null
              order by a.creada_en desc limit 4) t), '{}'),
           coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'nombre', p.nombre, 'correo', u.email,
                                                          'es_prueba', p.es_prueba) order by p.nombre)
                     from public.admins_refugio ar
                     join public.perfiles p on p.id = ar.perfil_id
                     join auth.users u on u.id = ar.perfil_id
                     where ar.refugio_id = r.id), '[]'::jsonb)
    from public.refugios r
    order by (r.estado_verificacion = 'pendiente') desc, r.nombre;
end;
$$;

revoke execute on function public.admin_listar_refugios from public, anon;
grant  execute on function public.admin_listar_refugios to authenticated;

-- Buscar cuentas por correo o nombre (para asignar administradores)
create function public.buscar_cuentas(p_texto text)
returns table (id uuid, nombre text, correo text, rol text, es_prueba boolean)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin busca cuentas';
  end if;
  if length(trim(coalesce(p_texto, ''))) < 2 then
    return;
  end if;
  return query
    select p.id, p.nombre, u.email::text, p.rol::text, p.es_prueba
    from public.perfiles p join auth.users u on u.id = p.id
    where p.desactivado_en is null
      and (u.email ilike '%' || trim(p_texto) || '%' or p.nombre ilike '%' || trim(p_texto) || '%')
    order by (u.email ilike trim(p_texto) || '%') desc, p.nombre
    limit 6;
end;
$$;

revoke execute on function public.buscar_cuentas from public, anon;
grant  execute on function public.buscar_cuentas to authenticated;

-- Crear (p_id null) o editar un refugio, y dejar sus administradores
-- exactamente como vienen en p_admins. Todo en una sola transacción.
create function public.guardar_refugio(
  p_id              bigint,
  p_nombre          text,
  p_comuna          text,
  p_region          text,
  p_descripcion     text,
  p_logo_url        text,
  p_portada_url     text,
  p_telefono        bigint,
  p_correo          text,
  p_cupos_totales   int,
  p_cupos_ocupados  int,
  p_recibe          text,
  p_especies        text[],
  p_es_prueba       boolean,
  p_admins          uuid[]
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_id bigint := p_id;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin crea o edita refugios';
  end if;
  if length(trim(coalesce(p_nombre, ''))) < 2 then
    raise exception 'Escribe el nombre del refugio';
  end if;
  if nullif(trim(p_comuna), '') is null then
    raise exception 'Elige la comuna del refugio';
  end if;
  if coalesce(array_length(p_especies, 1), 0) = 0 then
    raise exception 'Elige al menos una especie';
  end if;

  if v_id is null then
    insert into public.refugios (nombre, comuna, region, descripcion, logo_url, portada_url, telefono, correo,
                                 cupos_totales, cupos_ocupados, recibe_animales, especies, es_prueba, estado_verificacion)
    values (trim(p_nombre), trim(p_comuna), coalesce(nullif(trim(p_region), ''), 'Metropolitana'),
            nullif(trim(p_descripcion), ''), p_logo_url, p_portada_url, p_telefono, nullif(trim(p_correo), ''),
            greatest(coalesce(p_cupos_totales, 0), 0), greatest(coalesce(p_cupos_ocupados, 0), 0),
            p_recibe, p_especies, coalesce(p_es_prueba, false), 'aprobado')
    returning id into v_id;
  else
    -- Primero los administradores que salen (por si cambia "de prueba")
    delete from public.admins_refugio
    where refugio_id = v_id and perfil_id <> all (coalesce(p_admins, '{}'));

    update public.refugios set
      nombre = trim(p_nombre), comuna = trim(p_comuna),
      region = coalesce(nullif(trim(p_region), ''), 'Metropolitana'),
      descripcion = nullif(trim(p_descripcion), ''), logo_url = p_logo_url, portada_url = p_portada_url,
      telefono = p_telefono, correo = nullif(trim(p_correo), ''),
      cupos_totales = greatest(coalesce(p_cupos_totales, 0), 0),
      cupos_ocupados = greatest(coalesce(p_cupos_ocupados, 0), 0),
      recibe_animales = p_recibe, especies = p_especies, es_prueba = coalesce(p_es_prueba, false)
    where id = v_id;
    if not found then
      raise exception 'Ese refugio no existe';
    end if;
  end if;

  insert into public.admins_refugio (refugio_id, perfil_id)
  select v_id, x from unnest(coalesce(p_admins, '{}')) x
  on conflict do nothing;

  return v_id;
end;
$$;

revoke execute on function public.guardar_refugio from public, anon;
grant  execute on function public.guardar_refugio to authenticated;

create function public.verificar_refugio(p_id bigint, p_aprobar boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin verifica refugios';
  end if;
  update public.refugios
  set estado_verificacion = case when p_aprobar then 'aprobado' else 'rechazado' end::public.estado_verificacion
  where id = p_id;
  if not found then
    raise exception 'Ese refugio no existe';
  end if;
end;
$$;

revoke execute on function public.verificar_refugio from public, anon;
grant  execute on function public.verificar_refugio to authenticated;

-- =====================================================================
-- MI REFUGIO (quien lo administra)
-- =====================================================================
create function public.detalle_mi_refugio(p_id bigint)
returns table (
  id                     bigint,
  nombre                 text,
  comuna                 text,
  region                 text,
  descripcion            text,
  logo_url               text,
  portada_url            text,
  telefono               bigint,
  correo                 text,
  cupos_totales          int,
  cupos_ocupados         int,
  recibe_animales        text,
  especies               text[],
  estado                 text,
  cupos_actualizados_en  timestamptz,
  publicados_mes         bigint,
  postulaciones_mes      bigint,
  adoptados_mes          bigint,
  por_mes                jsonb,     -- [{"mes":"2026-05","total":3}] publicaciones de los últimos 6 meses
  equipo                 jsonb      -- [{"id","nombre"}]
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not (public.es_admin_de_refugio(p_id) or public.es_superadmin()) then
    raise exception 'No administras este refugio';
  end if;
  return query
    with animales as (
      select a.* from public.adopciones a where a.refugio_id = p_id
    ), meses as (
      select to_char(date_trunc('month', current_date) - (n || ' month')::interval, 'YYYY-MM') as mes
      from generate_series(5, 0, -1) n
    )
    select r.id, r.nombre, r.comuna, r.region, r.descripcion, r.logo_url, r.portada_url, r.telefono, r.correo,
           r.cupos_totales, r.cupos_ocupados, r.recibe_animales, r.especies, r.estado_verificacion::text,
           r.cupos_actualizados_en,
           (select count(*) from animales a where a.creada_en >= date_trunc('month', now())),
           (select count(*) from public.postulaciones_adopcion x join animales a on a.id = x.adopcion_id
            where x.creada_en >= date_trunc('month', now())),
           (select count(*) from animales a where a.estado = 'adoptada' and a.adoptada_en >= date_trunc('month', now())),
           (select jsonb_agg(jsonb_build_object('mes', m.mes,
                   'total', (select count(*) from animales a where to_char(a.creada_en, 'YYYY-MM') = m.mes)) order by m.mes)
            from meses m),
           coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'nombre', p.nombre) order by p.nombre)
                     from public.admins_refugio ar join public.perfiles p on p.id = ar.perfil_id
                     where ar.refugio_id = r.id), '[]'::jsonb)
    from public.refugios r
    where r.id = p_id;
end;
$$;

revoke execute on function public.detalle_mi_refugio from public, anon;
grant  execute on function public.detalle_mi_refugio to authenticated;

-- Animales publicados a nombre del refugio (mismas columnas que mis_publicaciones,
-- así la web reutiliza las tarjetas y "Elegir familia").
create function public.animales_de_mi_refugio(p_id bigint)
returns table (
  id                    bigint,
  nombre                text,
  especie               text,
  raza                  text,
  sexo                  text,
  fecha_nacimiento      date,
  comuna                text,
  foto_url              text,
  estado                text,
  creada_en             timestamptz,
  adoptada_en           timestamptz,
  testimonio            text,
  solicita_chequeo      boolean,
  revisada_por          text,
  postulaciones         bigint,
  postulaciones_nuevas  bigint,
  elegido               text,
  refugio_nombre        text
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not (public.es_admin_de_refugio(p_id) or public.es_superadmin()) then
    raise exception 'No administras este refugio';
  end if;
  return query
    select a.id, a.nombre, a.especie::text, a.raza, a.sexo::text, a.fecha_nacimiento, a.comuna,
           coalesce(a.fotos[1], a.foto_url), a.estado, a.creada_en, a.adoptada_en, a.testimonio, a.solicita_chequeo,
           (select pv.nombre from public.chequeos_adopcion q join public.veterinarios v on v.id = q.veterinario_id
            join public.perfiles pv on pv.id = v.perfil_id where q.adopcion_id = a.id order by q.fecha desc limit 1),
           (select count(*) from public.postulaciones_adopcion x where x.adopcion_id = a.id and x.estado <> 'retirada'),
           (select count(*) from public.postulaciones_adopcion x where x.adopcion_id = a.id and x.estado = 'pendiente'),
           (select pp.nombre from public.postulaciones_adopcion x join public.perfiles pp on pp.id = x.postulante_id
            where x.adopcion_id = a.id and x.estado = 'aceptada' limit 1),
           r.nombre
    from public.adopciones a
    join public.refugios r on r.id = a.refugio_id
    where a.refugio_id = p_id
    order by (a.estado = 'retirada'), a.creada_en desc;
end;
$$;

revoke execute on function public.animales_de_mi_refugio from public, anon;
grant  execute on function public.animales_de_mi_refugio to authenticated;

-- =====================================================================
-- Postulaciones: también las gestiona el equipo del refugio
-- (mismas funciones de la migración 39; cambia solo el permiso)
-- =====================================================================

create or replace function public.postulaciones_de_adopcion(p_adopcion_id bigint)
returns table (
  id                 bigint,
  postulante_id      uuid,
  nombre             text,
  correo             text,
  telefono           bigint,
  vivienda           text,
  tiene_patio        boolean,
  tenencia           text,
  permiten_mascotas  boolean,
  hay_ninos          boolean,
  edades_ninos       text,
  otras_mascotas     boolean,
  cuales_mascotas    text,
  todos_de_acuerdo   boolean,
  experiencia        text,
  motivo             text,
  estado             text,
  creada_en          timestamptz
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not (public.puedo_gestionar_adopcion(p_adopcion_id) or public.es_superadmin()) then
    raise exception 'Solo quien publicó (o el equipo del refugio) ve estas postulaciones';
  end if;
  return query
    select x.id, x.postulante_id, p.nombre, u.email::text, p.telefono, x.vivienda, x.tiene_patio, x.tenencia,
           x.permiten_mascotas, x.hay_ninos, x.edades_ninos, x.otras_mascotas, x.cuales_mascotas,
           x.todos_de_acuerdo, x.experiencia, x.motivo, x.estado, x.creada_en
    from public.postulaciones_adopcion x
    join public.perfiles p on p.id = x.postulante_id
    join auth.users u on u.id = x.postulante_id
    where x.adopcion_id = p_adopcion_id and x.estado <> 'retirada'
    order by (x.estado = 'aceptada') desc, (x.estado = 'pendiente') desc, x.creada_en desc;
end;
$$;

create or replace function public.responder_postulacion(p_postulacion_id bigint, p_aceptar boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_adopcion public.adopciones%rowtype;
  v_estado   text;
begin
  select estado into v_estado from public.postulaciones_adopcion where id = p_postulacion_id;
  select a.* into v_adopcion
  from public.postulaciones_adopcion x join public.adopciones a on a.id = x.adopcion_id
  where x.id = p_postulacion_id;

  if v_adopcion.id is null or not public.puedo_gestionar_adopcion(v_adopcion.id) then
    raise exception 'Solo quien publicó (o el equipo del refugio) puede responder esta postulación';
  end if;
  if v_estado <> 'pendiente' then
    raise exception 'Esta postulación ya fue respondida';
  end if;

  if p_aceptar then
    if v_adopcion.estado not in ('publicada', 'en_proceso') then
      raise exception 'Este animal ya no está disponible';
    end if;
    if exists (select 1 from public.postulaciones_adopcion
               where adopcion_id = v_adopcion.id and estado = 'aceptada') then
      raise exception 'Ya elegiste una familia para este animal';
    end if;
    update public.postulaciones_adopcion set estado = 'aceptada', revisada_en = now() where id = p_postulacion_id;
    update public.adopciones set estado = 'en_proceso' where id = v_adopcion.id;
  else
    update public.postulaciones_adopcion set estado = 'rechazada', revisada_en = now() where id = p_postulacion_id;
  end if;
end;
$$;

create or replace function public.concretar_adopcion(
  p_adopcion_id    bigint,
  p_postulacion_id bigint,
  p_testimonio     text,
  p_traspasar      boolean
) returns bigint                     -- id de la mascota creada (o null)
language plpgsql security definer set search_path = ''
as $$
declare
  v_a        public.adopciones%rowtype;
  v_adoptante uuid;
  v_nombre   text;
  v_mascota  bigint;
begin
  select * into v_a from public.adopciones where id = p_adopcion_id;
  if not found or not public.puedo_gestionar_adopcion(p_adopcion_id) then
    raise exception 'Solo quien publicó (o el equipo del refugio) puede cerrar la adopción';
  end if;
  if v_a.estado = 'adoptada' then
    raise exception 'Este animal ya figura como adoptado';
  end if;

  select x.postulante_id, p.nombre into v_adoptante, v_nombre
  from public.postulaciones_adopcion x join public.perfiles p on p.id = x.postulante_id
  where x.id = p_postulacion_id and x.adopcion_id = p_adopcion_id and x.estado = 'aceptada';
  if v_adoptante is null then
    raise exception 'Primero elige a la familia (acepta su postulación)';
  end if;

  update public.adopciones set
    estado = 'adoptada',
    adoptante_id = v_adoptante,
    adoptada_en = now(),
    testimonio = nullif(left(trim(p_testimonio), 280), ''),
    testimonio_autor = case when nullif(trim(p_testimonio), '') is not null then split_part(v_nombre, ' ', 1) end
  where id = p_adopcion_id;

  -- Las que seguían esperando quedan rechazadas
  update public.postulaciones_adopcion set estado = 'rechazada', revisada_en = now()
  where adopcion_id = p_adopcion_id and estado = 'pendiente';

  if coalesce(p_traspasar, false) then
    insert into public.mascotas (dueno_id, nombre, especie, raza, fecha_nacimiento, sexo, esterilizado, peso_kg, alergias)
    values (v_adoptante, v_a.nombre, v_a.especie, v_a.raza, v_a.fecha_nacimiento, v_a.sexo, v_a.esterilizado,
            v_a.peso_kg, nullif(v_a.alergias, ''))
    returning id into v_mascota;

    insert into public.registros_medicos (mascota_id, veterinario_id, centro_id, fecha, tipo, descripcion)
    select v_mascota, q.veterinario_id, q.centro_id, q.fecha, 'control', 'Atención durante la adopción: ' || q.resumen
    from public.chequeos_adopcion q where q.adopcion_id = p_adopcion_id;
  end if;

  return v_mascota;
end;
$$;
