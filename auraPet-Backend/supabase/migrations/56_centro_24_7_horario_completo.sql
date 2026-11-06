-- =====================================================================
-- AuraPet — 56: Un centro 24/7 tiene el horario completo
--
-- Si el centro marca "Atendemos urgencias 24/7", atiende a toda hora: su
-- horario queda de 00:00 a 24:00 los 7 días y ya no se edita a mano (se
-- desmarca 24/7 para volver a editarlo; el horario queda como estaba, 24 h,
-- y desde ahí se ajusta). Así todo lo que revisa el horario del centro
-- (pedir hora, horario de sus veterinarios, "abierto ahora") lo trata igual.
-- Misma firma que en la 54: solo cambia lo que hacen.
-- =====================================================================

-- Marca de 24 horas (time acepta 24:00 como fin del día)
create or replace function public.guardar_urgencias_centro(p_centro_id bigint, p_tiene_uci boolean, p_urgencias_24_7 boolean)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    raise exception 'No puedes editar este centro';
  end if;

  update public.centros
  set tiene_uci = coalesce(p_tiene_uci, false),
      urgencias_24_7 = coalesce(p_urgencias_24_7, false),
      urgencias_revisado_en = now()
  where id = p_centro_id;

  -- 24/7: horario completo, todos los días, sin colación
  if coalesce(p_urgencias_24_7, false) then
    delete from public.horarios_centro where centro_id = p_centro_id;
    insert into public.horarios_centro (centro_id, dia_semana, abre, cierra)
    select p_centro_id, d, time '00:00', time '24:00' from generate_series(1, 7) d;
  end if;

  -- Sin UCI no hay estado que mostrar
  if not coalesce(p_tiene_uci, false) then
    delete from public.estado_uci_centros where centro_id = p_centro_id;
  end if;
end;
$$;

create or replace function public.guardar_horario_centro(p_centro_id bigint, p_horarios jsonb)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.puedo_gestionar_centro(p_centro_id) then
    raise exception 'No puedes editar este centro';
  end if;
  if exists (select 1 from public.centros where id = p_centro_id and urgencias_24_7) then
    raise exception 'El centro atiende 24/7: su horario es completo. Para cambiarlo, desmarca "Atendemos urgencias 24/7"';
  end if;
  if jsonb_typeof(coalesce(p_horarios, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_horarios, '[]'::jsonb)) = 0 then
    raise exception 'Marca al menos un día de atención';
  end if;

  delete from public.horarios_centro where centro_id = p_centro_id;

  begin
    insert into public.horarios_centro (centro_id, dia_semana, abre, cierra, inicio_colacion, fin_colacion)
    select p_centro_id, h.dia_semana, h.abre, h.cierra, h.inicio_colacion, h.fin_colacion
    from jsonb_to_recordset(p_horarios) as h(
      dia_semana smallint, abre time, cierra time, inicio_colacion time, fin_colacion time
    );
  exception
    when unique_violation then raise exception 'Hay un día repetido en el horario';
    when check_violation then raise exception 'Revisa las horas: el cierre va después de la apertura y la colación dentro del horario';
    when not_null_violation then raise exception 'Hay un día del horario incompleto';
  end;
end;
$$;

-- Centros que ya habían marcado 24/7 antes de esta migración
delete from horarios_centro h using centros c where c.id = h.centro_id and c.urgencias_24_7;
insert into horarios_centro (centro_id, dia_semana, abre, cierra)
select c.id, d, time '00:00', time '24:00'
from centros c cross join generate_series(1, 7) d
where c.urgencias_24_7;
