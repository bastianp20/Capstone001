-- =====================================================================
-- AuraPet — 36: Adopciones
--
-- Página pública /adopta (se ve sin cuenta). Cualquier persona con
-- cuenta puede dar un animal en adopción; los veterinarios de la red
-- pueden registrarle chequeos, que aparecen como el sello
-- "Revisado por veterinario" (gratis = "chequeo solidario").
-- En AuraPet nunca se cobra por un animal.
--
--   · adopciones          → la publicación (estado: publicada, en_proceso,
--                           adoptada o retirada)
--   · chequeos_adopcion   → los chequeos que hicieron los veterinarios
--   · bucket "adopciones" → fotos (cada persona sube a su carpeta)
--   · listar_adopciones(), historias_adopcion(), resumen_adopciones()
--     → lo que lee la página. Son security definer porque un visitante
--       sin cuenta no puede leer perfiles (el nombre del veterinario).
--
-- Cuentas de prueba: una publicación hereda es_prueba de quien la
-- publica. Las de prueba solo las ven las cuentas de prueba (como los
-- centros, migración 14).
-- Pendiente para la 37: postulaciones ("Quiero adoptarlo").
-- =====================================================================

create table adopciones (
  id                bigint generated always as identity primary key,
  publicado_por     uuid not null references perfiles (id) on delete cascade,
  nombre            text not null check (length(trim(nombre)) between 1 and 40),
  especie           especie_mascota not null,
  raza              text check (length(raza) <= 60),
  sexo              sexo_mascota not null,
  tamano            text not null check (tamano in ('pequeno', 'mediano', 'grande')),
  fecha_nacimiento  date check (fecha_nacimiento <= current_date),   -- aproximada
  comuna            text not null check (length(trim(comuna)) between 2 and 60),
  historia          text check (length(historia) <= 1500),           -- la cuenta quien publica
  frase             text check (length(frase) <= 160),               -- en primera persona
  personalidad      text[] not null default '{}' check (cardinality(personalidad) <= 5),
  vacunas_al_dia    boolean not null default false,
  esterilizado      boolean not null default false,
  microchip         text unique,
  foto_url          text,
  estado            text not null default 'publicada'
                    check (estado in ('publicada', 'en_proceso', 'adoptada', 'retirada')),
  es_prueba         boolean not null default false,
  adoptante_id      uuid references perfiles (id) on delete set null,
  adoptada_en       timestamptz,
  testimonio        text check (length(testimonio) <= 280),          -- "Ya tienen familia"
  testimonio_autor  text check (length(testimonio_autor) <= 60),
  creada_en         timestamptz not null default now(),
  actualizada_en    timestamptz not null default now(),
  check (estado <> 'adoptada' or adoptada_en is not null)
);

create index adopciones_estado_idx on adopciones (estado, creada_en desc);

create table chequeos_adopcion (
  id              bigint generated always as identity primary key,
  adopcion_id     bigint not null references adopciones (id) on delete cascade,
  veterinario_id  bigint not null references veterinarios (id) on delete cascade,
  centro_id       bigint references centros (id) on delete set null,
  fecha           date not null default current_date check (fecha <= current_date),
  resumen         text not null check (length(trim(resumen)) between 3 and 300),
  solidario       boolean not null default false,   -- el veterinario no lo cobró
  creado_en       timestamptz not null default now()
);

create index chequeos_adopcion_adopcion_idx on chequeos_adopcion (adopcion_id, fecha desc);

-- ---------- Reglas automáticas de la publicación ----------
-- · es_prueba se copia de quien publica (nadie lo elige a mano).
-- · Solo el superadmin cambia quién la publicó o si es de prueba.
-- · Al pasar a "adoptada" se anota la fecha; actualizada_en siempre.
create function public.preparar_adopcion()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    select coalesce(es_prueba, false) into new.es_prueba
    from public.perfiles where id = new.publicado_por;
  elsif not public.es_superadmin() then
    if new.publicado_por is distinct from old.publicado_por
       or new.es_prueba is distinct from old.es_prueba then
      raise exception 'No puedes cambiar quién publicó ni si es de prueba';
    end if;
  end if;

  if new.estado = 'adoptada' and new.adoptada_en is null then
    new.adoptada_en := now();
  end if;
  new.actualizada_en := now();
  return new;
end;
$$;

create trigger adopciones_preparar
  before insert or update on adopciones
  for each row execute function public.preparar_adopcion();

-- ---------- Seguridad (RLS) ----------
alter table adopciones enable row level security;
alter table chequeos_adopcion enable row level security;

-- Visibles para todos: las no retiradas (de prueba, solo para cuentas de prueba).
-- Quien publicó ve las suyas siempre; el superadmin, todas.
create policy "todos ven las adopciones activas; cada uno las suyas"
  on adopciones for select to anon, authenticated
  using (
    (estado <> 'retirada' and (not es_prueba or public.es_cuenta_de_prueba()))
    or publicado_por = auth.uid()
    or public.es_superadmin()
  );

create policy "cada uno publica a su nombre"
  on adopciones for insert to authenticated
  with check (
    publicado_por = auth.uid()
    and exists (select 1 from public.perfiles where id = auth.uid() and desactivado_en is null)
  );

create policy "quien publicó o el superadmin editan"
  on adopciones for update to authenticated
  using (publicado_por = auth.uid() or public.es_superadmin())
  with check (publicado_por = auth.uid() or public.es_superadmin());

-- Quien publica la "retira" (estado); borrar de verdad, solo el superadmin.
create policy "solo el superadmin borra"
  on adopciones for delete to authenticated
  using (public.es_superadmin());

-- Los chequeos se ven si se ve la publicación (la política de arriba se aplica en el exists).
create policy "chequeos visibles con su publicación"
  on chequeos_adopcion for select to anon, authenticated
  using (exists (select 1 from public.adopciones a where a.id = adopcion_id));

create policy "veterinarios aprobados registran sus chequeos"
  on chequeos_adopcion for insert to authenticated
  with check (
    veterinario_id = public.mi_veterinario_id()
    and exists (select 1 from public.veterinarios v
                where v.id = veterinario_id and v.estado_verificacion = 'aprobado')
  );

create policy "cada veterinario edita o borra sus chequeos"
  on chequeos_adopcion for update to authenticated
  using (veterinario_id = public.mi_veterinario_id() or public.es_superadmin())
  with check (veterinario_id = public.mi_veterinario_id() or public.es_superadmin());

create policy "cada veterinario borra sus chequeos"
  on chequeos_adopcion for delete to authenticated
  using (veterinario_id = public.mi_veterinario_id() or public.es_superadmin());

-- ---------- Lo que lee la página /adopta ----------
-- Animales esperando hogar, con su último chequeo (si tiene).
-- Primero los disponibles; los "en proceso" al final.
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
  chequeo_solidario   boolean
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.nombre, a.especie::text, a.raza, a.sexo::text, a.tamano, a.fecha_nacimiento,
         a.comuna, a.historia, a.frase, a.personalidad, a.vacunas_al_dia, a.esterilizado,
         a.foto_url, a.estado, a.creada_en,
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

-- "Ya tienen familia": adopciones concretadas que dejaron un testimonio.
create function public.historias_adopcion(p_limite int default 6)
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
  select a.id, a.nombre, a.especie::text, a.foto_url, a.testimonio,
         coalesce(a.testimonio_autor, split_part(p.nombre, ' ', 1)), a.adoptada_en
  from public.adopciones a
  left join public.perfiles p on p.id = a.adoptante_id
  where a.estado = 'adoptada'
    and a.testimonio is not null
    and (not a.es_prueba or public.es_cuenta_de_prueba())
  order by a.adoptada_en desc
  limit least(greatest(coalesce(p_limite, 6), 1), 24);
$$;

-- Los números del hero: esperando hogar · revisados por veterinarios · ya tienen familia.
create function public.resumen_adopciones()
returns table (esperando bigint, revisados bigint, con_familia bigint)
language sql stable security definer set search_path = ''
as $$
  select
    count(*) filter (where a.estado in ('publicada', 'en_proceso')),
    count(*) filter (where a.estado in ('publicada', 'en_proceso')
                     and exists (select 1 from public.chequeos_adopcion q where q.adopcion_id = a.id)),
    count(*) filter (where a.estado = 'adoptada')
  from public.adopciones a
  where not a.es_prueba or public.es_cuenta_de_prueba();
$$;

revoke execute on function public.listar_adopciones, public.historias_adopcion, public.resumen_adopciones from public;
grant  execute on function public.listar_adopciones, public.historias_adopcion, public.resumen_adopciones to anon, authenticated;

-- ---------- Fotos ----------
-- Bucket público (las fotos se ven sin cuenta). Cada persona sube solo a
-- su carpeta: adopciones/<su id>/archivo.jpg. Máx. 5 MB, solo imágenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('adopciones', 'adopciones', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "adopciones: subir a la carpeta propia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'adopciones' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "adopciones: cambiar fotos propias"
  on storage.objects for update to authenticated
  using (bucket_id = 'adopciones' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "adopciones: borrar fotos propias"
  on storage.objects for delete to authenticated
  using (bucket_id = 'adopciones' and ((storage.foldername(name))[1] = auth.uid()::text or public.es_superadmin()));
