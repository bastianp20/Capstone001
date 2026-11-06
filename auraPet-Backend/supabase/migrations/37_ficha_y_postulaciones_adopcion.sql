-- =====================================================================
-- AuraPet — 37: Ficha del animal, publicar y postular (adopción)
--
--   · adopciones suma: fotos (rutas del bucket "adopciones", máx. 6),
--     rasgos de personalidad (1 a 5), peso, alergias, si tiene microchip
--     y si quien publica pidió que un veterinario lo revise.
--   · postulaciones_adopcion → "Quiero adoptarlo" (hogar, familia,
--     experiencia). Se crean con postular_adopcion(), que revisa las reglas.
--   · detalle_adopcion(id) → todo lo que muestra la ficha /adopta/:id,
--     con quién publica y si la persona conectada ya postuló.
--   · listar_adopciones() ahora devuelve la primera foto en foto_url.
-- Publicar se hace con un insert normal (la RLS de la migración 36 obliga
-- a publicar a nombre propio).
-- =====================================================================

-- ---------- Datos nuevos de la publicación ----------
-- Las fotos se guardan como rutas dentro del bucket: "<id de quien publica>/<archivo>".
create function public.fotos_de_quien_publica(p_publicado_por uuid, p_fotos text[])
returns boolean
language sql immutable
as $$
  select coalesce(bool_and(f like p_publicado_por::text || '/%'), true) from unnest(p_fotos) f;
$$;

alter table adopciones
  add column fotos            text[] not null default '{}',
  add column energia          smallint check (energia between 1 and 5),
  add column sociable_perros  smallint check (sociable_perros between 1 and 5),
  add column sociable_gatos   smallint check (sociable_gatos between 1 and 5),
  add column sociable_ninos   smallint check (sociable_ninos between 1 and 5),
  add column peso_kg          numeric(5,2) check (peso_kg > 0 and peso_kg < 150),
  add column alergias         text check (length(alergias) <= 200),
  add column con_microchip    boolean not null default false,
  add column solicita_chequeo boolean not null default false,
  add constraint adopciones_max_fotos check (cardinality(fotos) <= 6),
  add constraint adopciones_fotos_propias check (public.fotos_de_quien_publica(publicado_por, fotos));

-- ---------- Postulaciones ("Quiero adoptarlo") ----------
create table postulaciones_adopcion (
  id                  bigint generated always as identity primary key,
  adopcion_id         bigint not null references adopciones (id) on delete cascade,
  postulante_id       uuid not null references perfiles (id) on delete cascade,
  -- Tu hogar
  vivienda            text not null check (vivienda in ('casa', 'departamento', 'parcela')),
  tiene_patio         boolean not null,
  tenencia            text not null check (tenencia in ('propia', 'arrendada', 'familiar')),
  permiten_mascotas   boolean,                     -- solo si es arrendada
  -- Tu familia
  hay_ninos           boolean not null,
  edades_ninos        text check (length(edades_ninos) <= 60),
  otras_mascotas      boolean not null,
  cuales_mascotas     text check (length(cuales_mascotas) <= 120),
  todos_de_acuerdo    boolean not null,
  -- Tu experiencia
  experiencia         text check (length(experiencia) <= 800),
  motivo              text not null check (length(trim(motivo)) between 10 and 800),
  estado              text not null default 'pendiente'
                      check (estado in ('pendiente', 'aceptada', 'rechazada', 'retirada')),
  creada_en           timestamptz not null default now(),
  revisada_en         timestamptz
);

-- Una postulación activa por persona y animal
create unique index postulaciones_adopcion_una_activa
  on postulaciones_adopcion (adopcion_id, postulante_id) where estado = 'pendiente';

alter table postulaciones_adopcion enable row level security;

-- Las ve quien postuló, quien publicó el animal y el superadmin.
create policy "postulante, quien publicó y superadmin ven la postulación"
  on postulaciones_adopcion for select to authenticated
  using (
    postulante_id = auth.uid()
    or exists (select 1 from public.adopciones a where a.id = adopcion_id and a.publicado_por = auth.uid())
    or public.es_superadmin()
  );
-- Se crean solo con postular_adopcion() (sin política de insert).

create function public.postular_adopcion(
  p_adopcion_id       bigint,
  p_vivienda          text,
  p_tiene_patio       boolean,
  p_tenencia          text,
  p_permiten_mascotas boolean,
  p_hay_ninos         boolean,
  p_edades_ninos      text,
  p_otras_mascotas    boolean,
  p_cuales_mascotas   text,
  p_todos_de_acuerdo  boolean,
  p_experiencia       text,
  p_motivo            text
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_animal  public.adopciones%rowtype;
  v_id      bigint;
begin
  if auth.uid() is null then
    raise exception 'Inicia sesión para postular';
  end if;
  if exists (select 1 from public.perfiles where id = auth.uid() and desactivado_en is not null) then
    raise exception 'Tu cuenta está desactivada';
  end if;

  select * into v_animal from public.adopciones where id = p_adopcion_id;
  if not found or v_animal.estado not in ('publicada', 'en_proceso') then
    raise exception 'Este animal ya no está disponible para adopción';
  end if;
  if v_animal.publicado_por = auth.uid() then
    raise exception 'No puedes postular a un animal que publicaste tú';
  end if;
  -- Las pruebas no se mezclan con lo real (como al pedir hora, migración 14)
  if v_animal.es_prueba is distinct from public.es_cuenta_de_prueba() then
    raise exception 'Este animal no está disponible para tu cuenta';
  end if;
  if exists (select 1 from public.postulaciones_adopcion
             where adopcion_id = p_adopcion_id and postulante_id = auth.uid() and estado = 'pendiente') then
    raise exception 'Ya postulaste a este animal: espera la respuesta';
  end if;

  insert into public.postulaciones_adopcion (
    adopcion_id, postulante_id, vivienda, tiene_patio, tenencia, permiten_mascotas,
    hay_ninos, edades_ninos, otras_mascotas, cuales_mascotas, todos_de_acuerdo, experiencia, motivo
  ) values (
    p_adopcion_id, auth.uid(), p_vivienda, p_tiene_patio, p_tenencia,
    case when p_tenencia = 'arrendada' then p_permiten_mascotas end,
    p_hay_ninos, case when p_hay_ninos then nullif(trim(p_edades_ninos), '') end,
    p_otras_mascotas, case when p_otras_mascotas then nullif(trim(p_cuales_mascotas), '') end,
    p_todos_de_acuerdo, nullif(trim(p_experiencia), ''), trim(p_motivo)
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke execute on function public.postular_adopcion from public, anon;
grant  execute on function public.postular_adopcion to authenticated;

-- ---------- Ficha del animal ----------
create function public.detalle_adopcion(p_id bigint)
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
         p.nombre,
         -- Cómo se presenta quien publica: su centro, "veterinario" o rescatista
         coalesce(
           (select c.nombre from public.admins_centro ac join public.centros c on c.id = ac.centro_id
            where ac.perfil_id = a.publicado_por order by c.id limit 1),
           case when p.rol = 'veterinario' then 'Veterinario de la red AuraPet' else 'Rescatista particular' end
         ),
         (select count(*) from public.adopciones x where x.publicado_por = a.publicado_por and x.estado = 'adoptada'),
         coalesce(a.publicado_por = auth.uid(), false),
         exists (select 1 from public.postulaciones_adopcion q
                 where q.adopcion_id = a.id and q.postulante_id = auth.uid() and q.estado = 'pendiente'),
         ch.veterinario, ch.centro, ch.fecha, ch.resumen, ch.solidario
  from public.adopciones a
  join public.perfiles p on p.id = a.publicado_por
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

revoke execute on function public.detalle_adopcion from public;
grant  execute on function public.detalle_adopcion to anon, authenticated;

-- ---------- La lista ahora trae la primera foto ----------
create or replace function public.listar_adopciones()
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
  chequeo_solidario   boolean
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.nombre, a.especie::text, a.raza, a.sexo::text, a.tamano, a.fecha_nacimiento,
         a.comuna, a.historia, a.frase, a.personalidad, a.vacunas_al_dia, a.esterilizado,
         coalesce(a.fotos[1], a.foto_url), a.estado, a.creada_en,
         ch.veterinario, ch.centro, ch.fecha, ch.resumen, ch.solidario
  from public.adopciones a
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

-- Historias: también con la primera foto
create or replace function public.historias_adopcion(p_limite int default 6)
returns table (
  id               bigint,
  nombre           text,
  especie          text,
  foto_url         text,
  testimonio       text,
  testimonio_autor text,
  adoptada_en      timestamptz
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.nombre, a.especie::text, coalesce(a.fotos[1], a.foto_url), a.testimonio,
         coalesce(a.testimonio_autor, split_part(p.nombre, ' ', 1)), a.adoptada_en
  from public.adopciones a
  left join public.perfiles p on p.id = a.adoptante_id
  where a.estado = 'adoptada'
    and a.testimonio is not null
    and (not a.es_prueba or public.es_cuenta_de_prueba())
  order by a.adoptada_en desc
  limit least(greatest(coalesce(p_limite, 6), 1), 24);
$$;
