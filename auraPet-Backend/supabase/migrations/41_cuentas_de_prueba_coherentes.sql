-- =====================================================================
-- 41 · Cuentas de prueba: todo coherente
-- ---------------------------------------------------------------------
-- Regla: las cuentas de prueba ven SOLO cosas de prueba, y las cuentas
-- reales (y los visitantes sin sesión) SOLO cosas reales.
-- Antes varias listas usaban "no es de prueba O soy cuenta de prueba", así
-- que una cuenta de prueba veía también lo real (centros, animales,
-- refugios) y después la base le rechazaba la acción ("no está disponible").
-- Ahora todas usan igualdad: es_prueba = es_cuenta_de_prueba().
--   · Políticas de centros, adopciones y refugios.
--   · listar_adopciones, historias_adopcion, resumen_adopciones,
--     detalle_adopcion, listar_refugios, resumen_refugios.
--   · crear_derivacion: el destino debe ser del mismo mundo.
--   · Un refugio solo recibe publicaciones y administradores de su mundo.
-- El superadmin y quien publicó siguen viendo lo suyo como antes.
-- =====================================================================

-- ---------- Centros ----------
drop policy "todos ven centros aprobados (menos los de prueba); admins, sus vets y superadmin, los suyos" on centros;
drop policy "las cuentas de prueba ven los centros de prueba" on centros;

create policy "cada mundo ve sus centros aprobados; admins, sus vets y superadmin, los suyos"
  on centros for select to anon, authenticated
  using (
    (estado_verificacion = 'aprobado' and es_prueba = public.es_cuenta_de_prueba())
    or public.es_superadmin()
    or public.es_admin_de_centro(id)
    or public.es_veterinario_de_centro(id)
  );

-- ---------- Adopciones ----------
drop policy "todos ven las adopciones activas; cada uno las suyas" on adopciones;

create policy "cada mundo ve sus adopciones activas; cada uno las suyas"
  on adopciones for select to anon, authenticated
  using (
    (estado <> 'retirada' and es_prueba = public.es_cuenta_de_prueba())
    or publicado_por = auth.uid()
    or public.es_superadmin()
  );

-- ---------- Refugios ----------
drop policy "todos ven los refugios aprobados" on refugios;

create policy "cada mundo ve sus refugios aprobados"
  on refugios for select to anon, authenticated
  using (
    (estado_verificacion = 'aprobado' and es_prueba = public.es_cuenta_de_prueba())
    or public.es_admin_de_refugio(id) or public.es_superadmin()
  );

-- Publicar a nombre de un refugio: además de administrarlo, mismo mundo.
create or replace function public.validar_refugio_de_adopcion()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.refugio_id is not null
     and (tg_op = 'INSERT' or new.refugio_id is distinct from old.refugio_id) then
    if not exists (select 1 from public.admins_refugio
                   where refugio_id = new.refugio_id and perfil_id = new.publicado_por)
       and not public.es_superadmin() then
      raise exception 'Solo puedes publicar a nombre de un refugio que administras';
    end if;
    if (select es_prueba from public.refugios where id = new.refugio_id) is distinct from new.es_prueba then
      raise exception 'Ese refugio no está disponible para tu cuenta';
    end if;
  end if;
  return new;
end;
$$;

-- Administradores de refugio: del mismo mundo que el refugio.
create function public.validar_admin_de_refugio()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select es_prueba from public.perfiles where id = new.perfil_id)
     is distinct from (select es_prueba from public.refugios where id = new.refugio_id) then
    raise exception 'Una cuenta de prueba solo administra refugios de prueba (y una real, refugios reales)';
  end if;
  return new;
end;
$$;

create trigger admins_refugio_mismo_mundo
  before insert or update on admins_refugio
  for each row execute function public.validar_admin_de_refugio();

-- ---------- resumen_adopciones ----------
create or replace function public.resumen_adopciones()
returns table (esperando bigint, revisados bigint, con_familia bigint)
language sql stable security definer set search_path = ''
as $$
  select
    count(*) filter (where a.estado in ('publicada', 'en_proceso')),
    count(*) filter (where a.estado in ('publicada', 'en_proceso')
                     and exists (select 1 from public.chequeos_adopcion q where q.adopcion_id = a.id)),
    count(*) filter (where a.estado = 'adoptada')
  from public.adopciones a
  where a.es_prueba = public.es_cuenta_de_prueba();
$$;

-- ---------- historias_adopcion ----------
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
    and a.es_prueba = public.es_cuenta_de_prueba()
  order by a.adoptada_en desc
  limit least(greatest(coalesce(p_limite, 6), 1), 24);
$$;

-- ---------- listar_adopciones ----------
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
    and a.es_prueba = public.es_cuenta_de_prueba()
  order by (a.estado = 'en_proceso'), a.creada_en desc;
$$;

-- ---------- detalle_adopcion ----------
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
      (a.estado in ('publicada', 'en_proceso', 'adoptada') and a.es_prueba = public.es_cuenta_de_prueba())
      or a.publicado_por = auth.uid()
      or public.es_superadmin()
    );
$$;

-- ---------- listar_refugios ----------
create or replace function public.listar_refugios()
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
  where r.estado_verificacion = 'aprobado' and r.es_prueba = public.es_cuenta_de_prueba()
  order by (r.recibe_animales = 'sin_cupos'), r.nombre;
$$;

-- ---------- resumen_refugios ----------
create or replace function public.resumen_refugios()
returns table (refugios bigint, animales bigint, aliados bigint)
language sql stable security definer set search_path = ''
as $$
  select
    (select count(*) from public.refugios r
     where r.estado_verificacion = 'aprobado' and r.es_prueba = public.es_cuenta_de_prueba()),
    (select count(*) from public.adopciones a
     where a.estado in ('publicada', 'en_proceso') and a.es_prueba = public.es_cuenta_de_prueba()),
    (select count(*) from public.veterinarios v join public.perfiles p on p.id = v.perfil_id
     where v.aliado_solidario and v.estado_verificacion = 'aprobado'
       and p.es_prueba = public.es_cuenta_de_prueba());
$$;

-- ---------- crear_derivacion ----------
create or replace function public.crear_derivacion(
  p_mascota_id       bigint,
  p_motivo           text,
  p_a_veterinario_id bigint default null,
  p_a_centro_id      bigint default null
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_destino     text;
  v_registro_id bigint;
  v_id          bigint;
begin
  if not public.es_mi_paciente(p_mascota_id) then
    raise exception 'Esta mascota no es tu paciente';
  end if;
  if num_nonnulls(p_a_veterinario_id, p_a_centro_id) <> 1 then
    raise exception 'Elige un veterinario o un centro (solo uno)';
  end if;
  if nullif(trim(p_motivo), '') is null then
    raise exception 'Escribe el motivo de la derivación';
  end if;
  if p_a_veterinario_id = public.mi_veterinario_id() then
    raise exception 'No puedes derivarte a ti mismo';
  end if;

  if p_a_veterinario_id is not null then
    select p.nombre into v_destino
    from public.veterinarios v join public.perfiles p on p.id = v.perfil_id
    where v.id = p_a_veterinario_id and v.estado_verificacion = 'aprobado'
      and p.es_prueba = public.es_cuenta_de_prueba();
  else
    select c.nombre into v_destino
    from public.centros c where c.id = p_a_centro_id and c.estado_verificacion = 'aprobado'
      and c.es_prueba = public.es_cuenta_de_prueba();
  end if;
  if v_destino is null then
    raise exception 'Ese destino no existe o no está verificado';
  end if;

  if exists (
    select 1 from public.derivaciones d join public.registros_medicos r on r.id = d.registro_id
    where r.mascota_id = p_mascota_id and d.estado = 'pendiente'
      and (d.a_veterinario_id = p_a_veterinario_id or d.a_centro_id = p_a_centro_id)
  ) then
    raise exception 'Ya hay una derivación pendiente de esta mascota a %', v_destino;
  end if;

  -- El registro en el historial (veterinario y centro los pone agregar_registro_medico)
  v_registro_id := public.agregar_registro_medico(
    p_mascota_id, 'otro', 'Derivado a ' || v_destino || ': ' || left(trim(p_motivo), 500)
  );

  insert into public.derivaciones (registro_id, a_veterinario_id, a_centro_id, motivo)
  values (v_registro_id, p_a_veterinario_id, p_a_centro_id, left(trim(p_motivo), 500))
  returning id into v_id;

  return v_id;
end;
$$;
