-- =====================================================================
-- 51 · Postular refugio SIN cuenta (pone al día la base)
-- ---------------------------------------------------------------------
-- La base quedó con una versión anterior de la 48 (la que exigía cuenta):
-- falta la columna correo_acceso y las funciones nuevas. Esta migración
-- vuelve a dejar todo como la 48 actual. Se puede correr más de una vez.
-- (Ver la cabecera de 48_postular_refugio.sql para el detalle.)
-- =====================================================================

alter table refugios
  add column if not exists correo_acceso text check (length(correo_acceso) <= 120);  -- postuló sin cuenta: a quién invitar

-- Quita las versiones anteriores (puede que cambien los parámetros o lo que devuelven).
do $$
declare f regprocedure;
begin
  for f in
    select p.oid::regprocedure from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.proname in ('fotos_de_una_postulacion', 'postular_refugio', 'cuenta_por_correo',
                        'vincular_postulacion_refugio', 'admin_listar_refugios')
  loop
    execute 'drop function ' || f;
  end loop;
end $$;

-- Fotos de quien postula sin sesión (el bucket ya limita tipo y tamaño: jpg/png/webp, 5 MB).
-- Solo se pueden subir: no cambiar ni borrar.
drop policy if exists "adopciones: subir fotos de una postulación de refugio" on storage.objects;
create policy "adopciones: subir fotos de una postulación de refugio"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'adopciones' and (storage.foldername(name))[1] = 'postulaciones');

-- ¿Todas las rutas están en la misma carpeta de postulación? ("postulaciones/<código>/…")
create function public.fotos_de_una_postulacion(p_fotos text[])
returns boolean
language sql immutable
as $$
  select count(distinct split_part(f, '/', 2)) = 1
     and bool_and(f ~ '^postulaciones/[A-Za-z0-9-]{8,}/[^/]+$')
  from unnest(p_fotos) f;
$$;

create function public.postular_refugio(
  p_nombre          text,
  p_region          text,
  p_comuna          text,
  p_descripcion     text,
  p_logo_url        text,
  p_cupos_totales   int,
  p_cupos_ocupados  int,
  p_recibe          text,
  p_especies        text[],
  p_fotos           text[],
  p_responsable     text,
  p_telefono        bigint,
  p_correo          text,
  p_sitio_web       text,
  p_mensaje         text
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_id      bigint;
  v_correo  text := lower(nullif(trim(p_correo), ''));
  v_todas   text[] := p_fotos || coalesce(array[p_logo_url], '{}');
begin
  if auth.uid() is not null then
    if exists (select 1 from public.refugios where postulado_por = auth.uid() and estado_verificacion = 'pendiente') then
      raise exception 'Ya tienes una postulación en revisión. Te escribiremos pronto.';
    end if;
  else
    if v_correo is null or v_correo !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'Escribe tu correo: ahí te enviaremos el acceso';
    end if;
    if exists (select 1 from public.refugios where correo_acceso = v_correo and estado_verificacion = 'pendiente') then
      raise exception 'Ya hay una postulación en revisión con ese correo. Te escribiremos pronto.';
    end if;
  end if;

  if length(trim(coalesce(p_nombre, ''))) < 2 then raise exception 'Escribe el nombre del refugio'; end if;
  if nullif(trim(p_comuna), '') is null then raise exception 'Escribe la comuna'; end if;
  if coalesce(array_length(p_especies, 1), 0) = 0 then raise exception 'Elige al menos una especie'; end if;
  if coalesce(array_length(p_fotos, 1), 0) < 2 or array_length(p_fotos, 1) > 6 then
    raise exception 'Sube entre 2 y 6 fotos del lugar';
  end if;
  if (auth.uid() is not null and not public.fotos_de_quien_publica(auth.uid(), v_todas))
     or (auth.uid() is null and not public.fotos_de_una_postulacion(v_todas)) then
    raise exception 'Las fotos no son de esta postulación';
  end if;
  if nullif(trim(p_responsable), '') is null then raise exception 'Escribe el nombre de la persona responsable'; end if;
  if p_telefono is null and v_correo is null then
    raise exception 'Deja al menos un teléfono o un correo de contacto';
  end if;

  insert into public.refugios (
    nombre, region, comuna, descripcion, logo_url, portada_url, telefono, correo,
    cupos_totales, cupos_ocupados, recibe_animales, especies, es_prueba, estado_verificacion,
    fotos_lugar, responsable, sitio_web, mensaje, postulado_por, correo_acceso
  ) values (
    trim(p_nombre), coalesce(nullif(trim(p_region), ''), 'Metropolitana'), trim(p_comuna),
    nullif(left(trim(p_descripcion), 600), ''), p_logo_url, p_fotos[1], p_telefono, v_correo,
    greatest(coalesce(p_cupos_totales, 0), 0), greatest(coalesce(p_cupos_ocupados, 0), 0), p_recibe, p_especies,
    public.es_cuenta_de_prueba(), 'pendiente',
    p_fotos, left(trim(p_responsable), 80), nullif(left(trim(p_sitio_web), 200), ''),
    nullif(left(trim(p_mensaje), 600), ''), auth.uid(),
    case when auth.uid() is null then v_correo end
  ) returning id into v_id;

  if auth.uid() is not null then
    insert into public.admins_refugio (refugio_id, perfil_id) values (v_id, auth.uid());
  end if;
  return v_id;
end;
$$;

revoke execute on function public.postular_refugio from public;
grant  execute on function public.postular_refugio to anon, authenticated;

-- ---------- Aprobar ----------
-- Una postulación sin cuenta y sin administradores se aprueba con la invitación.
create or replace function public.verificar_refugio(p_id bigint, p_aprobar boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin verifica refugios';
  end if;
  if p_aprobar and exists (
    select 1 from public.refugios r
    where r.id = p_id and r.correo_acceso is not null
      and not exists (select 1 from public.admins_refugio ar where ar.refugio_id = r.id)
  ) then
    raise exception 'Este refugio postuló sin cuenta: apruébalo con la invitación';
  end if;
  update public.refugios
  set estado_verificacion = case when p_aprobar then 'aprobado' else 'rechazado' end::public.estado_verificacion
  where id = p_id;
  if not found then
    raise exception 'Ese refugio no existe';
  end if;
end;
$$;

-- Para la edge function "aprobar-refugio": ¿ese correo ya tiene cuenta?
create function public.cuenta_por_correo(p_correo text)
returns table (id uuid, es_prueba boolean)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin aprueba refugios';
  end if;
  return query
    select p.id, p.es_prueba
    from auth.users u join public.perfiles p on p.id = u.id
    where lower(u.email) = lower(trim(p_correo));
end;
$$;

-- La cuenta (existente o recién invitada) queda como administradora y el refugio, aprobado.
create function public.vincular_postulacion_refugio(p_refugio_id bigint, p_perfil_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_r public.refugios%rowtype;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin aprueba refugios';
  end if;
  select * into v_r from public.refugios where id = p_refugio_id;
  if not found or v_r.estado_verificacion <> 'pendiente' or v_r.correo_acceso is null then
    raise exception 'Esa postulación no está pendiente';
  end if;
  if (select es_prueba from public.perfiles where id = p_perfil_id) is distinct from v_r.es_prueba then
    raise exception 'Ese correo es de una cuenta de prueba y el refugio es real (o al revés)';
  end if;
  insert into public.admins_refugio (refugio_id, perfil_id) values (p_refugio_id, p_perfil_id)
  on conflict do nothing;
  update public.refugios
     set estado_verificacion = 'aprobado', postulado_por = p_perfil_id
   where id = p_refugio_id;
end;
$$;

revoke execute on function public.cuenta_por_correo, public.vincular_postulacion_refugio from public, anon;
grant  execute on function public.cuenta_por_correo, public.vincular_postulacion_refugio to authenticated;

-- ---------- Lista del superadmin con los datos de la postulación ----------

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
  administradores       jsonb,     -- [{"id","nombre","correo","es_prueba"}]
  fotos_lugar           text[],    -- de la postulación (migración 48)
  responsable           text,
  sitio_web             text,
  mensaje               text,
  correo_acceso         text       -- postuló sin cuenta: a quién se invita al aprobar
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
                     where ar.refugio_id = r.id), '[]'::jsonb),
           r.fotos_lugar, r.responsable, r.sitio_web, r.mensaje, r.correo_acceso
    from public.refugios r
    order by (r.estado_verificacion = 'pendiente') desc, r.nombre;
end;
$$;

revoke execute on function public.admin_listar_refugios from public, anon;
grant  execute on function public.admin_listar_refugios to authenticated;
