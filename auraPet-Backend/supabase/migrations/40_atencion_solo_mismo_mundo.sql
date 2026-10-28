-- =====================================================================
-- AuraPet — 40: "Adopción solidaria" muestra solo lo que se puede atender
--
-- registrar_atencion_adopcion() no deja que una cuenta de prueba atienda
-- un animal real (ni al revés): su sello aparecería en una publicación
-- verdadera. Pero la lista de la migración 39 le mostraba a las cuentas de
-- prueba también los animales reales, con el botón "Atender", y al guardar
-- salía "Este animal no está disponible para tu cuenta".
-- Ahora la lista usa la misma regla: prueba ve prueba, real ve real.
-- =====================================================================

create or replace function public.adopciones_para_veterinarios()
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
    and a.es_prueba = public.es_cuenta_de_prueba()   -- igual que registrar_atencion_adopcion
  order by a.creada_en;
$$;

