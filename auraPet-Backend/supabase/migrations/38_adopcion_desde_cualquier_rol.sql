-- =====================================================================
-- AuraPet — 38: Dar en adopción desde cualquier rol
--
-- Desde el 27-10 todos los paneles (dueño, veterinario, admin de centro y
-- superadmin) tienen "Dar en adopción". La publicación ya admitía cualquier
-- cuenta (migración 36); aquí solo cambia cómo se presenta quien publica
-- en la ficha: un superadmin aparece como "Equipo AuraPet".
-- (Un admin de centro ya aparecía con el nombre de su centro.)
-- =====================================================================

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
         p.nombre,
         -- Cómo se presenta quien publica: su centro, veterinario, equipo AuraPet o rescatista
         coalesce(
           (select c.nombre from public.admins_centro ac join public.centros c on c.id = ac.centro_id
            where ac.perfil_id = a.publicado_por order by c.id limit 1),
           case p.rol when 'veterinario' then 'Veterinario de la red AuraPet'
                         when 'superadmin' then 'Equipo AuraPet'
                         else 'Rescatista particular' end
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

