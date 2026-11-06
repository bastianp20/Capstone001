-- =====================================================================
-- 49 · App, fase 1: pedir hora con fotos y eliminar la cuenta
-- ---------------------------------------------------------------------
-- · profesionales_para_cita suma la foto de perfil (avatar_url, ruta del
--   bucket "avatares") para mostrar las caras al elegir dónde atenderse.
--   Cambia lo que devuelve: se borra y se vuelve a crear (igual que la 45).
-- · cancelar_solicitud_eliminacion: la persona se arrepiente mientras su
--   solicitud sigue en revisión (se borra la solicitud pendiente).
-- · Al aprobar una eliminación, además de desactivar la cuenta, se cancelan
--   las citas futuras de sus mascotas, con el motivo para el veterinario.
-- =====================================================================

-- ---------- Profesionales para pedir hora, con su foto ----------
drop function public.profesionales_para_cita();

create function public.profesionales_para_cita()
returns table (
  veterinario_id   bigint,
  nombre           text,
  centro_id        bigint,
  especialidad_ids bigint[],
  especialidades   text,
  avatar_url       text
)
language sql stable security definer set search_path = ''
as $$
  with vets as (
    select v.id, p.nombre, p.avatar_url,
           coalesce((select array_agg(ve.especialidad_id) from public.veterinario_especialidades ve
                     where ve.veterinario_id = v.id), '{}') as ids
    from public.veterinarios v
    join public.perfiles p on p.id = v.perfil_id
    where v.estado_verificacion = 'aprobado'
      and p.desactivado_en is null
      and p.es_prueba = public.es_cuenta_de_prueba()
  )
  select x.id, x.nombre, vc.centro_id, x.ids, public.especialidad_de_veterinario(x.id), x.avatar_url
  from vets x
  join public.veterinario_centros vc on vc.veterinario_id = x.id
  join public.centros c on c.id = vc.centro_id
  where c.estado_verificacion = 'aprobado' and c.desactivado_en is null
    and c.es_prueba = public.es_cuenta_de_prueba()
  union all
  select x.id, x.nombre, null, x.ids, public.especialidad_de_veterinario(x.id), x.avatar_url
  from vets x
  where not exists (select 1 from public.veterinario_centros vc where vc.veterinario_id = x.id)
  order by 2;
$$;

revoke execute on function public.profesionales_para_cita from public;
grant  execute on function public.profesionales_para_cita to anon, authenticated;

-- ---------- Arrepentirse de eliminar la cuenta ----------
create function public.cancelar_solicitud_eliminacion()
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  delete from public.solicitudes_eliminacion
  where perfil_id = auth.uid() and estado = 'pendiente';
  if not found then
    raise exception 'No tienes una solicitud de eliminación en revisión';
  end if;
end;
$$;

revoke execute on function public.cancelar_solicitud_eliminacion from public, anon;
grant  execute on function public.cancelar_solicitud_eliminacion to authenticated;

-- ---------- Aprobar (desactiva la cuenta y cancela sus citas futuras) o rechazar ----------
create or replace function public.resolver_solicitud_eliminacion(
  p_solicitud_id bigint, p_aprobar boolean, p_respuesta text default null
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_perfil uuid;
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin resuelve estas solicitudes';
  end if;

  select perfil_id into v_perfil from public.solicitudes_eliminacion
  where id = p_solicitud_id and estado = 'pendiente' for update;
  if not found then
    raise exception 'Esa solicitud ya no está pendiente';
  end if;

  if p_aprobar then
    if v_perfil = auth.uid() then
      raise exception 'No puedes desactivar tu propia cuenta desde aquí';
    end if;
    update public.perfiles set desactivado_en = now() where id = v_perfil;

    update public.citas c
       set estado = 'cancelada', cancelada_por = auth.uid(),
           motivo_cancelacion = 'La persona eliminó su cuenta de AuraPet'
     where c.estado in ('pendiente', 'confirmada') and c.fecha_hora > now()
       and exists (select 1 from public.mascotas m where m.id = c.mascota_id and m.dueno_id = v_perfil);
  end if;

  update public.solicitudes_eliminacion
     set estado = case when p_aprobar then 'aprobada' else 'rechazada' end,
         respuesta = nullif(left(trim(p_respuesta), 500), ''),
         resuelta_por = auth.uid(),
         resuelta_en = now()
   where id = p_solicitud_id;
end;
$$;
