-- =====================================================================
-- AuraPet — 39: Mis publicaciones, Adopción solidaria y Refugios
--
-- Decisiones (27-10, se pueden cambiar después):
--   · Un refugio es una entidad VERIFICADA, como un centro: la crea el
--     superadmin y le asigna administradores (admins_refugio). Quien
--     administra un refugio puede publicar a nombre de él.
--   · La atención con costo se coordina fuera de AuraPet: solo se guarda
--     un monto aproximado.
--   · Quien publica ve el correo y el teléfono (del perfil) de quien postula;
--     el formulario de postular lo avisa.
--
--   Mis publicaciones  → mis_publicaciones(), actividad_mis_publicaciones(),
--                        postulaciones_de_adopcion(), responder_postulacion(),
--                        concretar_adopcion() (con traspaso de ficha opcional)
--   Adopción solidaria → veterinarios.aliado_solidario, cambiar_aliado_solidario(),
--                        adopciones_para_veterinarios(), resumen_solidario(),
--                        mis_atenciones_adopcion(), mis_centros_de_atencion(),
--                        registrar_atencion_adopcion()
--   Refugios           → refugios, admins_refugio, adopciones.refugio_id,
--                        listar_refugios(), resumen_refugios(), mis_refugios()
-- =====================================================================

-- =====================================================================
-- REFUGIOS
-- =====================================================================
create table refugios (
  id                  bigint generated always as identity primary key,
  nombre              text not null check (length(trim(nombre)) between 2 and 80),
  comuna              text not null,
  region              text not null default 'Metropolitana',
  descripcion         text check (length(descripcion) <= 600),
  logo_url            text,
  portada_url         text,
  telefono            bigint,
  correo              text,
  cupos_totales       int not null default 0 check (cupos_totales >= 0),
  cupos_ocupados      int not null default 0 check (cupos_ocupados >= 0),
  recibe_animales     text not null default 'abierto'
                      check (recibe_animales in ('abierto', 'limitado', 'sin_cupos')),
  especies            text[] not null default '{perro,gato}',
  estado_verificacion estado_verificacion not null default 'aprobado',
  es_prueba           boolean not null default false,
  creado_en           timestamptz not null default now()
);

create table admins_refugio (
  refugio_id  bigint not null references refugios (id) on delete cascade,
  perfil_id   uuid not null references perfiles (id) on delete cascade,
  primary key (refugio_id, perfil_id)
);

create function public.es_admin_de_refugio(p_refugio_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins_refugio where refugio_id = p_refugio_id and perfil_id = auth.uid());
$$;

alter table refugios enable row level security;
alter table admins_refugio enable row level security;

create policy "todos ven los refugios aprobados"
  on refugios for select to anon, authenticated
  using (
    (estado_verificacion = 'aprobado' and (not es_prueba or public.es_cuenta_de_prueba()))
    or public.es_admin_de_refugio(id) or public.es_superadmin()
  );
create policy "sus administradores y el superadmin editan el refugio"
  on refugios for update to authenticated
  using (public.es_admin_de_refugio(id) or public.es_superadmin())
  with check (public.es_admin_de_refugio(id) or public.es_superadmin());
create policy "el superadmin crea refugios"
  on refugios for insert to authenticated with check (public.es_superadmin());
create policy "el superadmin borra refugios"
  on refugios for delete to authenticated using (public.es_superadmin());

create policy "cada uno ve sus refugios; el superadmin todos"
  on admins_refugio for select to authenticated
  using (perfil_id = auth.uid() or public.es_superadmin());
create policy "el superadmin asigna administradores de refugio"
  on admins_refugio for all to authenticated
  using (public.es_superadmin()) with check (public.es_superadmin());

-- Publicar a nombre de un refugio (solo si lo administras)
alter table adopciones add column refugio_id bigint references refugios (id) on delete set null;

create function public.validar_refugio_de_adopcion()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.refugio_id is not null
     and (tg_op = 'INSERT' or new.refugio_id is distinct from old.refugio_id)
     and not exists (select 1 from public.admins_refugio
                     where refugio_id = new.refugio_id and perfil_id = new.publicado_por)
     and not public.es_superadmin() then
    raise exception 'Solo puedes publicar a nombre de un refugio que administras';
  end if;
  return new;
end;
$$;

create trigger adopciones_validar_refugio
  before insert or update on adopciones
  for each row execute function public.validar_refugio_de_adopcion();

-- =====================================================================
-- ATENCIÓN SOLIDARIA
-- =====================================================================
alter table veterinarios add column aliado_solidario boolean not null default false;

alter table chequeos_adopcion
  add column estado_general   text check (estado_general in ('sano', 'en_tratamiento', 'en_observacion')),
  add column procedimientos   text[] not null default '{}',
  add column peso_kg          numeric(5,2) check (peso_kg > 0 and peso_kg < 150),
  add column monto_aproximado int check (monto_aproximado >= 0);

-- ---------- Ser (o dejar de ser) aliado solidario ----------
create function public.cambiar_aliado_solidario(p_activo boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if public.mi_veterinario_id() is null then
    raise exception 'Solo los veterinarios pueden ser aliados solidarios';
  end if;
  update public.veterinarios set aliado_solidario = p_activo where id = public.mi_veterinario_id();
end;
$$;

-- ---------- Centros donde atiende el veterinario conectado ----------
create function public.mis_centros_de_atencion()
returns table (id bigint, nombre text, comuna text)
language sql stable security definer set search_path = ''
as $$
  select c.id, c.nombre, c.comuna
  from public.veterinario_centros vc
  join public.centros c on c.id = vc.centro_id
  where vc.veterinario_id = public.mi_veterinario_id()
  order by c.nombre;
$$;

-- ---------- Animales en adopción, vistos por un veterinario ----------
create function public.adopciones_para_veterinarios()
returns table (
  id                bigint,
  nombre            text,
  especie           text,
  raza              text,
  sexo              text,
  fecha_nacimiento  date,
  comuna            text,
  foto_url          text,
  estado            text,
  solicita_chequeo  boolean,
  revisada          boolean,
  ya_atendi         boolean,
  dias_esperando    int,
  publicador_nombre text,
  refugio_id        bigint,
  refugio_nombre    text,
  en_mi_comuna      boolean
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.nombre, a.especie::text, a.raza, a.sexo::text, a.fecha_nacimiento, a.comuna,
         coalesce(a.fotos[1], a.foto_url), a.estado, a.solicita_chequeo,
         exists (select 1 from public.chequeos_adopcion q where q.adopcion_id = a.id),
         exists (select 1 from public.chequeos_adopcion q where q.adopcion_id = a.id
                 and q.veterinario_id = public.mi_veterinario_id()),
         (current_date - a.creada_en::date),
         coalesce(r.nombre, p.nombre), r.id, r.nombre,
         exists (select 1 from public.veterinario_centros vc join public.centros c on c.id = vc.centro_id
                 where vc.veterinario_id = public.mi_veterinario_id() and lower(c.comuna) = lower(a.comuna))
  from public.adopciones a
  join public.perfiles p on p.id = a.publicado_por
  left join public.refugios r on r.id = a.refugio_id
  where public.mi_veterinario_id() is not null
    and a.estado in ('publicada', 'en_proceso')
    and (not a.es_prueba or public.es_cuenta_de_prueba())
  order by a.creada_en;
$$;

-- ---------- "Tu impacto" ----------
create function public.resumen_solidario()
returns table (
  atenciones        bigint,
  solidarias        bigint,
  adoptados         bigint,
  aliado            boolean,
  por_mes           jsonb      -- [{"mes":"2026-05","total":2}, ...] últimos 6 meses
)
language sql stable security definer set search_path = ''
as $$
  with mias as (
    select q.*, a.estado as estado_animal
    from public.chequeos_adopcion q join public.adopciones a on a.id = q.adopcion_id
    where q.veterinario_id = public.mi_veterinario_id()
  ), meses as (
    select to_char(date_trunc('month', current_date) - (n || ' month')::interval, 'YYYY-MM') as mes
    from generate_series(5, 0, -1) n
  )
  select
    (select count(*) from mias),
    (select count(*) from mias where solidario),
    (select count(distinct adopcion_id) from mias where estado_animal = 'adoptada'),
    coalesce((select aliado_solidario from public.veterinarios where id = public.mi_veterinario_id()), false),
    (select jsonb_agg(jsonb_build_object('mes', m.mes,
            'total', (select count(*) from mias where to_char(fecha, 'YYYY-MM') = m.mes)) order by m.mes)
     from meses m);
$$;

-- ---------- Mis atenciones ----------
create function public.mis_atenciones_adopcion()
returns table (
  id           bigint,
  adopcion_id  bigint,
  nombre       text,
  especie      text,
  foto_url     text,
  fecha        date,
  resumen      text,
  solidario    boolean,
  centro       text,
  estado       text
)
language sql stable security definer set search_path = ''
as $$
  select q.id, a.id, a.nombre, a.especie::text, coalesce(a.fotos[1], a.foto_url), q.fecha, q.resumen,
         q.solidario, c.nombre, a.estado
  from public.chequeos_adopcion q
  join public.adopciones a on a.id = q.adopcion_id
  left join public.centros c on c.id = q.centro_id
  where q.veterinario_id = public.mi_veterinario_id()
  order by q.fecha desc, q.id desc;
$$;

-- ---------- Registrar una atención ----------
-- Además del chequeo, actualiza la ficha del animal con lo que se hizo
-- (vacunas, esterilización, microchip, peso): quien publicó no tiene que repetirlo.
create function public.registrar_atencion_adopcion(
  p_adopcion_id     bigint,
  p_centro_id       bigint,
  p_fecha           date,
  p_estado_general  text,
  p_procedimientos  text[],
  p_peso_kg         numeric,
  p_resumen         text,
  p_solidario       boolean,
  p_monto           int
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_vet     bigint := public.mi_veterinario_id();
  v_animal  public.adopciones%rowtype;
  v_id      bigint;
  v_procs   text[] := coalesce(p_procedimientos, '{}');
begin
  if v_vet is null or not exists (select 1 from public.veterinarios where id = v_vet and estado_verificacion = 'aprobado') then
    raise exception 'Solo los veterinarios aprobados pueden registrar atenciones';
  end if;
  select * into v_animal from public.adopciones where id = p_adopcion_id;
  if not found or v_animal.estado not in ('publicada', 'en_proceso') then
    raise exception 'Este animal ya no está en adopción';
  end if;
  if v_animal.es_prueba is distinct from public.es_cuenta_de_prueba() then
    raise exception 'Este animal no está disponible para tu cuenta';
  end if;
  if p_centro_id is not null and not exists (select 1 from public.veterinario_centros
                                             where veterinario_id = v_vet and centro_id = p_centro_id) then
    raise exception 'Ese centro no es uno donde atiendes';
  end if;
  if not v_procs <@ array['vacunas', 'desparasitacion', 'esterilizacion', 'microchip', 'examen_general'] then
    raise exception 'Procedimiento no reconocido';
  end if;

  insert into public.chequeos_adopcion (adopcion_id, veterinario_id, centro_id, fecha, resumen, solidario,
                                        estado_general, procedimientos, peso_kg, monto_aproximado)
  values (p_adopcion_id, v_vet, p_centro_id, coalesce(p_fecha, current_date), trim(p_resumen), coalesce(p_solidario, false),
          p_estado_general, v_procs, p_peso_kg,
          case when coalesce(p_solidario, false) then null else p_monto end)
  returning id into v_id;

  update public.adopciones set
    vacunas_al_dia = vacunas_al_dia or 'vacunas' = any (v_procs),
    esterilizado   = esterilizado or 'esterilizacion' = any (v_procs),
    con_microchip  = con_microchip or 'microchip' = any (v_procs),
    peso_kg        = coalesce(p_peso_kg, peso_kg)
  where id = p_adopcion_id;

  return v_id;
end;
$$;

-- =====================================================================
-- MIS PUBLICACIONES
-- =====================================================================
create function public.mis_publicaciones()
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
language sql stable security definer set search_path = ''
as $$
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
  left join public.refugios r on r.id = a.refugio_id
  where a.publicado_por = auth.uid()
  order by (a.estado = 'retirada'), a.creada_en desc;
$$;

-- Lo último que pasó con mis publicaciones (postulaciones, atenciones, elecciones, adopciones)
create function public.actividad_mis_publicaciones(p_limite int default 8)
returns table (tipo text, adopcion_id bigint, animal text, persona text, fecha timestamptz)
language sql stable security definer set search_path = ''
as $$
  select * from (
    select 'postulacion'::text, a.id, a.nombre, pp.nombre, x.creada_en
    from public.postulaciones_adopcion x
    join public.adopciones a on a.id = x.adopcion_id
    join public.perfiles pp on pp.id = x.postulante_id
    where a.publicado_por = auth.uid()
    union all
    select 'eleccion', a.id, a.nombre, pp.nombre, x.revisada_en
    from public.postulaciones_adopcion x
    join public.adopciones a on a.id = x.adopcion_id
    join public.perfiles pp on pp.id = x.postulante_id
    where a.publicado_por = auth.uid() and x.estado = 'aceptada' and x.revisada_en is not null
    union all
    select 'atencion', a.id, a.nombre, pv.nombre, q.creado_en
    from public.chequeos_adopcion q
    join public.adopciones a on a.id = q.adopcion_id
    join public.veterinarios v on v.id = q.veterinario_id
    join public.perfiles pv on pv.id = v.perfil_id
    where a.publicado_por = auth.uid()
    union all
    select 'adopcion', a.id, a.nombre, null, a.adoptada_en
    from public.adopciones a
    where a.publicado_por = auth.uid() and a.estado = 'adoptada'
  ) t
  order by 5 desc
  limit least(greatest(coalesce(p_limite, 8), 1), 30);
$$;

-- Postulaciones de un animal mío, con el contacto de cada postulante
create function public.postulaciones_de_adopcion(p_adopcion_id bigint)
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
  if not exists (select 1 from public.adopciones ad where ad.id = p_adopcion_id
                 and (ad.publicado_por = auth.uid() or public.es_superadmin())) then
    raise exception 'Solo quien publicó ve estas postulaciones';
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

-- Elegir (pasa a "en proceso") o rechazar una postulación
create function public.responder_postulacion(p_postulacion_id bigint, p_aceptar boolean)
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

  if v_adopcion.id is null or v_adopcion.publicado_por <> auth.uid() then
    raise exception 'Solo quien publicó puede responder esta postulación';
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

-- Cerrar la adopción: queda "adoptada", con testimonio opcional, y si se pide,
-- se crea la mascota en la cuenta del adoptante con sus atenciones como historial.
create function public.concretar_adopcion(
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
  if not found or v_a.publicado_por <> auth.uid() then
    raise exception 'Solo quien publicó puede cerrar la adopción';
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

-- =====================================================================
-- REFUGIOS: lo que lee la página pública y el formulario de publicar
-- =====================================================================
create function public.listar_refugios()
returns table (
  id               bigint,
  nombre           text,
  comuna           text,
  region           text,
  descripcion      text,
  logo_url         text,
  portada_url      text,
  telefono         bigint,
  correo           text,
  cupos_totales    int,
  cupos_ocupados   int,
  recibe_animales  text,
  especies         text[],
  en_adopcion      bigint,
  fotos            text[],     -- primeras fotos de sus animales
  aliados          bigint      -- veterinarios aliados que atendieron a sus animales
)
language sql stable security definer set search_path = ''
as $$
  select r.id, r.nombre, r.comuna, r.region, r.descripcion, r.logo_url, r.portada_url, r.telefono, r.correo,
         r.cupos_totales, r.cupos_ocupados, r.recibe_animales, r.especies,
         (select count(*) from public.adopciones a where a.refugio_id = r.id and a.estado in ('publicada', 'en_proceso')),
         coalesce((select array_agg(f) from (
            select coalesce(a.fotos[1], a.foto_url) f from public.adopciones a
            where a.refugio_id = r.id and a.estado in ('publicada', 'en_proceso')
              and coalesce(a.fotos[1], a.foto_url) is not null
            order by a.creada_en desc limit 4) t), '{}'),
         (select count(distinct q.veterinario_id) from public.chequeos_adopcion q
          join public.adopciones a on a.id = q.adopcion_id
          join public.veterinarios v on v.id = q.veterinario_id
          where a.refugio_id = r.id and v.aliado_solidario)
  from public.refugios r
  where r.estado_verificacion = 'aprobado' and (not r.es_prueba or public.es_cuenta_de_prueba())
  order by (r.recibe_animales = 'sin_cupos'), r.nombre;
$$;

create function public.resumen_refugios()
returns table (refugios bigint, animales bigint, aliados bigint)
language sql stable security definer set search_path = ''
as $$
  select
    (select count(*) from public.refugios r
     where r.estado_verificacion = 'aprobado' and (not r.es_prueba or public.es_cuenta_de_prueba())),
    (select count(*) from public.adopciones a
     where a.estado in ('publicada', 'en_proceso') and (not a.es_prueba or public.es_cuenta_de_prueba())),
    (select count(*) from public.veterinarios v where v.aliado_solidario and v.estado_verificacion = 'aprobado');
$$;

-- Refugios que administro (para "Publicar a nombre de…")
create function public.mis_refugios()
returns table (id bigint, nombre text)
language sql stable security definer set search_path = ''
as $$
  select r.id, r.nombre from public.refugios r
  join public.admins_refugio ar on ar.refugio_id = r.id
  where ar.perfil_id = auth.uid()
  order by r.nombre;
$$;

-- ---------- Lista pública y ficha: ahora saben del refugio ----------
drop function public.listar_adopciones();
create function public.listar_adopciones()
returns table (
  id                  bigint,
  nombre              text,
  especie             text,
  raza                text,
  sexo                text,
  tamano              text,
  fecha_nacimiento    date,
  comuna              text,
  historia            text,
  frase               text,
  personalidad        text[],
  vacunas_al_dia      boolean,
  esterilizado        boolean,
  foto_url            text,
  estado              text,
  creada_en           timestamptz,
  chequeo_veterinario text,
  chequeo_centro      text,
  chequeo_fecha       date,
  chequeo_resumen     text,
  chequeo_solidario   boolean,
  refugio_id          bigint,
  refugio_nombre      text
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.nombre, a.especie::text, a.raza, a.sexo::text, a.tamano, a.fecha_nacimiento,
         a.comuna, a.historia, a.frase, a.personalidad, a.vacunas_al_dia, a.esterilizado,
         coalesce(a.fotos[1], a.foto_url), a.estado, a.creada_en,
         ch.veterinario, ch.centro, ch.fecha, ch.resumen, ch.solidario,
         r.id, r.nombre
  from public.adopciones a
  left join public.refugios r on r.id = a.refugio_id
  left join lateral (
    select p.nombre as veterinario, c.nombre as centro, q.fecha, q.resumen, q.solidario
    from public.chequeos_adopcion q
    join public.veterinarios v on v.id = q.veterinario_id
    join public.perfiles p on p.id = v.perfil_id
    left join public.centros c on c.id = q.centro_id
    where q.adopcion_id = a.id
    order by q.fecha desc, q.id desc
    limit 1
  ) ch on true
  where a.estado in ('publicada', 'en_proceso')
    and (not a.es_prueba or public.es_cuenta_de_prueba())
  order by (a.estado = 'en_proceso'), a.creada_en desc;
$$;

-- Ficha: si se publicó a nombre de un refugio, se presenta como el refugio
create or replace function public.detalle_adopcion(p_id bigint)
returns table (
  id                    bigint,
  nombre                text,
  especie               text,
  raza                  text,
  sexo                  text,
  tamano                text,
  fecha_nacimiento      date,
  comuna                text,
  historia              text,
  frase                 text,
  personalidad          text[],
  energia               smallint,
  sociable_perros       smallint,
  sociable_gatos        smallint,
  sociable_ninos        smallint,
  vacunas_al_dia        boolean,
  esterilizado          boolean,
  con_microchip         boolean,
  peso_kg               numeric,
  alergias              text,
  fotos                 text[],
  estado                text,
  solicita_chequeo      boolean,
  creada_en             timestamptz,
  publicador_nombre     text,
  publicador_tipo       text,
  publicador_adopciones bigint,
  es_mia                boolean,
  ya_postule            boolean,
  chequeo_veterinario   text,
  chequeo_centro        text,
  chequeo_fecha         date,
  chequeo_resumen       text,
  chequeo_solidario     boolean
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.nombre, a.especie::text, a.raza, a.sexo::text, a.tamano, a.fecha_nacimiento, a.comuna,
         a.historia, a.frase, a.personalidad, a.energia, a.sociable_perros, a.sociable_gatos, a.sociable_ninos,
         a.vacunas_al_dia, a.esterilizado, a.con_microchip, a.peso_kg, a.alergias,
         case when cardinality(a.fotos) > 0 then a.fotos
              when a.foto_url is not null then array[a.foto_url] else '{}' end,
         a.estado, a.solicita_chequeo, a.creada_en,
         coalesce(r.nombre, p.nombre),
         case
           when r.id is not null then 'Refugio · ' || r.comuna
           else coalesce(
             (select c.nombre from public.admins_centro ac join public.centros c on c.id = ac.centro_id
              where ac.perfil_id = a.publicado_por order by c.id limit 1),
             case p.rol when 'veterinario' then 'Veterinario de la red AuraPet'
                        when 'superadmin' then 'Equipo AuraPet'
                        else 'Rescatista particular' end)
         end,
         case when r.id is not null
              then (select count(*) from public.adopciones x where x.refugio_id = r.id and x.estado = 'adoptada')
              else (select count(*) from public.adopciones x where x.publicado_por = a.publicado_por and x.estado = 'adoptada')
         end,
         coalesce(a.publicado_por = auth.uid(), false),
         exists (select 1 from public.postulaciones_adopcion q
                 where q.adopcion_id = a.id and q.postulante_id = auth.uid() and q.estado = 'pendiente'),
         ch.veterinario, ch.centro, ch.fecha, ch.resumen, ch.solidario
  from public.adopciones a
  join public.perfiles p on p.id = a.publicado_por
  left join public.refugios r on r.id = a.refugio_id
  left join lateral (
    select pv.nombre as veterinario, c.nombre as centro, q.fecha, q.resumen, q.solidario
    from public.chequeos_adopcion q
    join public.veterinarios v on v.id = q.veterinario_id
    join public.perfiles pv on pv.id = v.perfil_id
    left join public.centros c on c.id = q.centro_id
    where q.adopcion_id = a.id
    order by q.fecha desc, q.id desc
    limit 1
  ) ch on true
  where a.id = p_id
    and (
      (a.estado in ('publicada', 'en_proceso', 'adoptada') and (not a.es_prueba or public.es_cuenta_de_prueba()))
      or a.publicado_por = auth.uid()
      or public.es_superadmin()
    );
$$;

-- ---------- Permisos de las funciones ----------
revoke execute on function
  public.cambiar_aliado_solidario, public.mis_centros_de_atencion, public.adopciones_para_veterinarios,
  public.resumen_solidario, public.mis_atenciones_adopcion, public.registrar_atencion_adopcion,
  public.mis_publicaciones, public.actividad_mis_publicaciones, public.postulaciones_de_adopcion,
  public.responder_postulacion, public.concretar_adopcion, public.mis_refugios
from public, anon;
grant execute on function
  public.cambiar_aliado_solidario, public.mis_centros_de_atencion, public.adopciones_para_veterinarios,
  public.resumen_solidario, public.mis_atenciones_adopcion, public.registrar_atencion_adopcion,
  public.mis_publicaciones, public.actividad_mis_publicaciones, public.postulaciones_de_adopcion,
  public.responder_postulacion, public.concretar_adopcion, public.mis_refugios
to authenticated;

revoke execute on function public.listar_adopciones, public.listar_refugios, public.resumen_refugios from public;
grant  execute on function public.listar_adopciones, public.listar_refugios, public.resumen_refugios to anon, authenticated;
