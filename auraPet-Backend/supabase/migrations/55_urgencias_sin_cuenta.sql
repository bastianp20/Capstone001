-- =====================================================================
-- AuraPet — 55: Urgencias sin cuenta
--
-- Página pública /urgencias (web y app): quien tiene una urgencia con su
-- mascota ve, sin crear cuenta, a qué centro llamar ahora. AuraPet no agenda
-- urgencias: muestra quién atiende y el estado de la UCI en vivo, con los
-- botones Llamar y Cómo llegar.
--   · listar_urgencias(): centros aprobados y activos (con horario, urgencias
--     24/7, UCI y su estado) y veterinarios con urgencias 24/7 que aceptaron
--     mostrar su teléfono. Sin sesión = mundo real (como en el resto de AuraPet).
--   · veterinarios.mostrar_telefono_urgencias: el teléfono de una persona es
--     privado; solo se publica si el veterinario lo activa.
-- =====================================================================

alter table veterinarios
  add column mostrar_telefono_urgencias boolean not null default false;

-- El veterinario decide si su teléfono aparece en urgencias
create function public.cambiar_telefono_urgencias(p_mostrar boolean)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.veterinarios
  set mostrar_telefono_urgencias = coalesce(p_mostrar, false)
  where id = public.mi_veterinario_id();

  if not found then
    raise exception 'Esta cuenta no tiene ficha de veterinario';
  end if;
end;
$$;

revoke execute on function public.cambiar_telefono_urgencias from public, anon;
grant  execute on function public.cambiar_telefono_urgencias to authenticated;

-- Para la casilla de "Mi horario": si muestra su teléfono y si tiene uno
create function public.mi_telefono_en_urgencias()
returns jsonb
language sql stable
security definer set search_path = ''
as $$
  select jsonb_build_object(
    'mostrar', v.mostrar_telefono_urgencias,
    'tiene_telefono', p.telefono is not null
  )
  from public.veterinarios v
  join public.perfiles p on p.id = v.perfil_id
  where v.id = public.mi_veterinario_id();
$$;

revoke execute on function public.mi_telefono_en_urgencias from public, anon;
grant  execute on function public.mi_telefono_en_urgencias to authenticated;


-- ---------- La lista pública ----------
create function public.listar_urgencias()
returns jsonb
language sql stable
security definer set search_path = ''
as $$
  select jsonb_build_object(
    'centros', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', c.id,
               'nombre', c.nombre,
               'direccion', c.direccion,
               'comuna', c.comuna,
               'telefono', c.telefono,
               'urgencias_24_7', c.urgencias_24_7,
               'tiene_uci', c.tiene_uci,
               'estado_uci', (
                 select jsonb_build_object('centro_id', e.centro_id, 'estado', e.estado, 'motivo', e.motivo,
                                           'detalle', e.detalle, 'actualizado_en', e.actualizado_en)
                 from public.estado_uci_centros e
                 where e.centro_id = c.id and c.tiene_uci),
               'horarios', coalesce((
                 select jsonb_agg(jsonb_build_object(
                          'dia_semana', h.dia_semana,
                          'abre', to_char(h.abre, 'HH24:MI'),
                          'cierra', to_char(h.cierra, 'HH24:MI'),
                          'inicio_colacion', to_char(h.inicio_colacion, 'HH24:MI'),
                          'fin_colacion', to_char(h.fin_colacion, 'HH24:MI')))
                 from public.horarios_centro h where h.centro_id = c.id), '[]'::jsonb))
             order by c.nombre)
      from public.centros c
      where c.estado_verificacion = 'aprobado'
        and c.desactivado_en is null
        and c.es_prueba = public.es_cuenta_de_prueba()), '[]'::jsonb),
    'veterinarios', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', v.id,
               'nombre', p.nombre,
               'telefono', p.telefono,
               'avatar_url', p.avatar_url,
               'a_domicilio', v.a_domicilio,
               'comunas', to_jsonb(v.comunas_atencion))
             order by p.nombre)
      from public.veterinarios v
      join public.perfiles p on p.id = v.perfil_id
      where v.estado_verificacion = 'aprobado'
        and p.desactivado_en is null
        and v.urgencias_24_7
        and v.mostrar_telefono_urgencias
        and p.telefono is not null
        and p.es_prueba = public.es_cuenta_de_prueba()), '[]'::jsonb)
  );
$$;

grant execute on function public.listar_urgencias to anon, authenticated;
