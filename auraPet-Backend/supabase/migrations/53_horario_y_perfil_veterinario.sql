-- =====================================================================
-- AuraPet — 53: Horario de atención y perfil profesional del veterinario
--
-- Hasta ahora solo los centros tenían horario (y solo si los creaba el
-- superadmin). Los veterinarios no tenían ninguno, así que no se podía saber
-- qué horas tiene libres cada uno. Aquí:
--   · horarios_veterinario (existe desde la 01, sin uso) sirve también para
--     la atención independiente: centro_id = null.
--   · El veterinario guarda su horario con guardar_mi_horario_atencion():
--     un tramo por día y lugar, una duración de cita para todo, y no puede
--     estar en dos lugares a la vez. En un centro con horario registrado, el
--     tramo debe caber dentro del horario de ese centro.
--   · urgencias_24_7: atiende urgencias fuera de horario (sello aparte; no
--     llena la agenda de horas).
--   · a_domicilio y comunas_atencion: dónde atiende un independiente.
--   · registrar_mi_colegiado(): si no lo puso al registrarse, lo agrega una
--     vez (después solo lo cambia el superadmin).
--   · progreso_perfil_veterinario(): qué le falta para tener el perfil al 100%.
-- =====================================================================


-- ---------- Horarios: también para la atención independiente ----------
alter table horarios_veterinario alter column centro_id drop not null;

-- Con centro_id null la FK compuesta no se revisa: se agrega la del veterinario sola
alter table horarios_veterinario
  add constraint horarios_veterinario_veterinario_fkey
  foreign key (veterinario_id) references veterinarios (id) on delete cascade;

alter table horarios_veterinario enable row level security;

create policy "el veterinario ve su horario"
  on horarios_veterinario for select to authenticated
  using (
    veterinario_id = public.mi_veterinario_id()
    or public.es_superadmin()
    or (centro_id is not null and public.es_admin_de_centro(centro_id))
  );
-- Se escribe solo con guardar_mi_horario_atencion().


-- ---------- Perfil profesional ----------
alter table veterinarios
  add column urgencias_24_7    boolean not null default false,
  add column a_domicilio       boolean not null default false,
  add column comunas_atencion  text[]  not null default '{}'
    check (cardinality(comunas_atencion) <= 30);


-- ---------- ¿Atiende de forma independiente? (sin ningún centro) ----------
create function public.es_veterinario_independiente(p_veterinario_id bigint)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select not exists (select 1 from public.veterinario_centros where veterinario_id = p_veterinario_id);
$$;

revoke execute on function public.es_veterinario_independiente from public, anon;
grant  execute on function public.es_veterinario_independiente to authenticated;


-- ---------- Leer mi horario (para la pantalla "Mi horario de atención") ----------
-- Devuelve:
--   { independiente, urgencias_24_7, a_domicilio, comunas, duracion,
--     lugares: [{ centro_id (null = independiente), nombre,
--                 horario_centro: [{dia_semana, abre, cierra}] }],
--     tramos:  [{ centro_id, dia_semana, desde, hasta }] }
create function public.mi_horario_atencion()
returns jsonb
language plpgsql stable
security definer set search_path = ''
as $$
declare
  v_vet   public.veterinarios%rowtype;
  v_indep boolean;
begin
  select * into v_vet from public.veterinarios where id = public.mi_veterinario_id();
  if not found then
    raise exception 'Esta cuenta no tiene ficha de veterinario';
  end if;
  v_indep := public.es_veterinario_independiente(v_vet.id);

  return jsonb_build_object(
    'independiente', v_indep,
    'urgencias_24_7', v_vet.urgencias_24_7,
    'a_domicilio', v_vet.a_domicilio,
    'comunas', to_jsonb(v_vet.comunas_atencion),
    'duracion', coalesce((select min(duracion_cita_min) from public.horarios_veterinario where veterinario_id = v_vet.id), 30),
    'lugares', case when v_indep then
        jsonb_build_array(jsonb_build_object('centro_id', null, 'nombre', null, 'horario_centro', '[]'::jsonb))
      else coalesce((
        select jsonb_agg(jsonb_build_object(
                 'centro_id', c.id,
                 'nombre', c.nombre,
                 'horario_centro', coalesce((
                   select jsonb_agg(jsonb_build_object('dia_semana', h.dia_semana,
                                                       'abre', to_char(h.abre, 'HH24:MI'),
                                                       'cierra', to_char(h.cierra, 'HH24:MI'))
                                    order by h.dia_semana)
                   from public.horarios_centro h where h.centro_id = c.id), '[]'::jsonb))
               order by c.nombre)
        from public.veterinario_centros vc
        join public.centros c on c.id = vc.centro_id
        where vc.veterinario_id = v_vet.id), '[]'::jsonb)
      end,
    'tramos', coalesce((
      select jsonb_agg(jsonb_build_object('centro_id', t.centro_id, 'dia_semana', t.dia_semana,
                                          'desde', to_char(t.desde, 'HH24:MI'),
                                          'hasta', case when t.hasta = '24:00' then '24:00' else to_char(t.hasta, 'HH24:MI') end)
                       order by t.dia_semana, t.desde)
      from public.horarios_veterinario t where t.veterinario_id = v_vet.id), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.mi_horario_atencion from public, anon;
grant  execute on function public.mi_horario_atencion to authenticated;


-- ---------- Guardar mi horario ----------
-- p_tramos: [{"centro_id": 3 | null, "dia_semana": 1, "desde": "09:00", "hasta": "13:00"}, ...]
-- Reemplaza todo el horario anterior del veterinario.
create function public.guardar_mi_horario_atencion(
  p_tramos         jsonb,
  p_duracion       smallint,
  p_urgencias_24_7 boolean,
  p_a_domicilio    boolean default false,
  p_comunas        text[]  default '{}'
)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  v_vet     bigint := public.mi_veterinario_id();
  v_indep   boolean;
  v_tramo   jsonb;
  v_centro  bigint;
  v_dia     smallint;
  v_desde   time;
  v_hasta   time;
  v_hc      public.horarios_centro%rowtype;
  v_comunas text[];
begin
  if v_vet is null then
    raise exception 'Esta cuenta no tiene ficha de veterinario';
  end if;
  if p_duracion not in (15, 20, 30, 45, 60) then
    raise exception 'La duración de cada hora debe ser 15, 20, 30, 45 o 60 minutos';
  end if;
  if jsonb_typeof(coalesce(p_tramos, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_tramos, '[]'::jsonb)) > 70 then
    raise exception 'El horario no es válido';
  end if;
  v_indep := public.es_veterinario_independiente(v_vet);

  -- Comunas: sin vacíos ni repetidas (sin importar mayúsculas)
  select coalesce(array_agg(x.comuna order by x.comuna), '{}') into v_comunas
  from (
    select distinct on (lower(trim(c))) left(trim(c), 60) as comuna
    from unnest(coalesce(p_comunas, '{}')) c
    where trim(c) <> ''
    order by lower(trim(c))
  ) x;

  delete from public.horarios_veterinario where veterinario_id = v_vet;

  for v_tramo in select * from jsonb_array_elements(coalesce(p_tramos, '[]'::jsonb)) loop
    v_centro := nullif(v_tramo->>'centro_id', '')::bigint;
    v_dia    := (v_tramo->>'dia_semana')::smallint;
    v_desde  := (v_tramo->>'desde')::time;
    v_hasta  := (v_tramo->>'hasta')::time;

    if v_dia is null or v_dia not between 1 and 7 or v_desde is null or v_hasta is null then
      raise exception 'Hay un día del horario incompleto';
    end if;
    if v_hasta <= v_desde then
      raise exception 'En cada día la hora de término debe ser posterior a la de inicio';
    end if;

    if v_centro is null then
      if not v_indep then
        raise exception 'Tu horario debe ir en alguno de tus centros';
      end if;
    else
      if not exists (select 1 from public.veterinario_centros where veterinario_id = v_vet and centro_id = v_centro) then
        raise exception 'No atiendes en ese centro';
      end if;
      -- Si el centro registró horario, el tramo debe caber en él
      if exists (select 1 from public.horarios_centro where centro_id = v_centro) then
        select * into v_hc from public.horarios_centro where centro_id = v_centro and dia_semana = v_dia;
        if not found then
          raise exception 'El centro no atiende uno de los días que marcaste';
        end if;
        if v_desde < v_hc.abre or v_hasta > v_hc.cierra then
          raise exception 'El centro atiende de % a % ese día', to_char(v_hc.abre, 'HH24:MI'), to_char(v_hc.cierra, 'HH24:MI');
        end if;
      end if;
    end if;

    -- No puede estar en dos lugares a la vez
    if exists (
      select 1 from public.horarios_veterinario
      where veterinario_id = v_vet and dia_semana = v_dia and desde < v_hasta and hasta > v_desde
    ) then
      raise exception 'Hay dos horarios que se cruzan el mismo día';
    end if;

    insert into public.horarios_veterinario (veterinario_id, centro_id, dia_semana, desde, hasta, duracion_cita_min)
    values (v_vet, v_centro, v_dia, v_desde, v_hasta, p_duracion);
  end loop;

  update public.veterinarios
  set urgencias_24_7 = coalesce(p_urgencias_24_7, false),
      a_domicilio = coalesce(p_a_domicilio, false),
      comunas_atencion = v_comunas
  where id = v_vet;
end;
$$;

revoke execute on function public.guardar_mi_horario_atencion from public, anon;
grant  execute on function public.guardar_mi_horario_atencion to authenticated;


-- ---------- N° de colegiado: el veterinario lo agrega una sola vez ----------
create function public.registrar_mi_colegiado(p_numero text)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  v_numero text := upper(trim(coalesce(p_numero, '')));
begin
  if v_numero = '' or length(v_numero) > 30 then
    raise exception 'Escribe tu número de colegiado';
  end if;

  begin
    update public.veterinarios set numero_colegiado = v_numero
    where id = public.mi_veterinario_id() and numero_colegiado is null;
  exception when unique_violation then
    raise exception 'Ese número de colegiado ya está registrado en AuraPet';
  end;

  if not found then
    raise exception 'Ya tienes un número de colegiado. Para cambiarlo, escríbenos';
  end if;
end;
$$;

revoke execute on function public.registrar_mi_colegiado from public, anon;
grant  execute on function public.registrar_mi_colegiado to authenticated;


-- ---------- Progreso del perfil ----------
-- Cada paso: true (listo) / false (falta). "zona" solo cuenta para independientes.
create function public.progreso_perfil_veterinario()
returns jsonb
language plpgsql stable
security definer set search_path = ''
as $$
declare
  v_vet    public.veterinarios%rowtype;
  v_perfil public.perfiles%rowtype;
  v_indep  boolean;
begin
  select * into v_vet from public.veterinarios where id = public.mi_veterinario_id();
  if not found then
    return null;
  end if;
  select * into v_perfil from public.perfiles where id = auth.uid();
  v_indep := public.es_veterinario_independiente(v_vet.id);

  return jsonb_build_object(
    'independiente', v_indep,
    'urgencias_24_7', v_vet.urgencias_24_7,
    'pasos', jsonb_build_object(
      'foto', v_perfil.avatar_url is not null,
      'telefono', v_perfil.telefono is not null,
      'especialidades', exists (select 1 from public.veterinario_especialidades where veterinario_id = v_vet.id)
                        or v_vet.especialidad_id is not null
                        or nullif(trim(v_vet.especialidad_otra), '') is not null,
      'colegiado', v_vet.numero_colegiado is not null,
      'horario', exists (select 1 from public.horarios_veterinario where veterinario_id = v_vet.id),
      'zona', case when v_indep then v_vet.a_domicilio or cardinality(v_vet.comunas_atencion) > 0 else null end
    )
  );
end;
$$;

revoke execute on function public.progreso_perfil_veterinario from public, anon;
grant  execute on function public.progreso_perfil_veterinario to authenticated;
