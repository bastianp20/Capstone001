-- =====================================================================
-- AuraPet — 03: Preguntas frecuentes aunque todavía no haya mensajes
--
-- La versión de la 02 usaba un join con mensajes_contacto: si no hay
-- mensajes (base recién creada), no devolvía ninguna pregunta y la sección
-- del Home y de Contacto quedaba vacía. Ahora se cuentan con left join:
-- las categorías con más mensajes salen primero y, mientras no haya
-- mensajes, se muestran igual (cantidad = 0), en orden alfabético.
-- =====================================================================
create or replace function public.preguntas_frecuentes(limite int default 6)
returns table (pregunta text, respuesta text, cantidad int)
language sql stable
security definer set search_path = ''
as $$
  select c.pregunta, c.respuesta, count(m.id)::int as cantidad
  from public.categorias_contacto c
  left join public.mensajes_contacto m on m.categoria = c.slug
  group by c.slug, c.pregunta, c.respuesta
  order by cantidad desc, c.pregunta
  limit greatest(limite, 0);
$$;
