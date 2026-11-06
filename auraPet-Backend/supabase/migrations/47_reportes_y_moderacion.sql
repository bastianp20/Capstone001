-- =====================================================================
-- 47 · Reportar publicaciones de adopción y moderarlas (superadmin)
-- ---------------------------------------------------------------------
-- · reportes_adopcion: cualquiera con sesión reporta una publicación ajena
--   (una pendiente por persona y publicación). Quien publicó NO ve quién
--   reportó; solo el superadmin ve los reportes.
-- · Un "caso" = una publicación con reportes. Se resuelve de una vez:
--     ocultar   → la publicación queda retirada y marcada como moderada
--                 (quien publicó ve el motivo y no puede volver a publicarla);
--     advertir  → sigue visible, quien publicó ve el aviso;
--     descartar → no había problema.
-- · Funciones: reportar_adopcion, casos_moderacion, resumen_moderacion,
--   resolver_moderacion, avisos_moderacion_mias.
-- =====================================================================

create table reportes_adopcion (
  id             bigint generated always as identity primary key,
  adopcion_id    bigint not null references adopciones (id) on delete cascade,
  reportado_por  uuid not null references perfiles (id) on delete cascade,
  motivo         text not null check (motivo in ('dinero', 'estafa', 'riesgo', 'inapropiado', 'adoptado', 'otro')),
  comentario     text check (length(comentario) <= 500),
  estado         text not null default 'pendiente' check (estado in ('pendiente', 'resuelto', 'descartado')),
  decision       text check (decision in ('ocultar', 'advertir', 'descartar')),
  resuelto_por   uuid references perfiles (id) on delete set null,
  resuelto_en    timestamptz,
  creada_en      timestamptz not null default now()
);
create unique index reportes_adopcion_uno_pendiente on reportes_adopcion (adopcion_id, reportado_por) where estado = 'pendiente';
create index reportes_adopcion_estado_idx on reportes_adopcion (estado, creada_en desc);

alter table reportes_adopcion enable row level security;
create policy "solo el superadmin ve los reportes"
  on reportes_adopcion for select to authenticated using (public.es_superadmin());
-- (se crean y resuelven solo con las funciones de abajo)

-- Lo que decidió la moderación sobre una publicación
alter table adopciones
  add column moderada_en        timestamptz,              -- oculta por moderación
  add column mensaje_moderacion text check (length(mensaje_moderacion) <= 500),
  add column advertencia        text check (length(advertencia) <= 500);

-- Una publicación oculta por moderación no se vuelve a publicar (salvo el superadmin)
create function public.proteger_moderacion()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if old.moderada_en is not null and not public.es_superadmin()
     and (new.estado is distinct from old.estado or new.moderada_en is distinct from old.moderada_en
          or new.mensaje_moderacion is distinct from old.mensaje_moderacion) then
    raise exception 'Esta publicación fue ocultada por el equipo AuraPet. Escríbenos si crees que es un error.';
  end if;
  if not public.es_superadmin() and new.advertencia is distinct from old.advertencia then
    raise exception 'Solo el equipo AuraPet deja advertencias';
  end if;
  return new;
end;
$$;

create trigger adopciones_proteger_moderacion
  before update on adopciones
  for each row execute function public.proteger_moderacion();

-- ---------- Reportar ----------
create function public.reportar_adopcion(p_adopcion_id bigint, p_motivo text, p_comentario text default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v_a  public.adopciones%rowtype;
  v_id bigint;
begin
  if auth.uid() is null then
    raise exception 'Inicia sesión para reportar';
  end if;
  select * into v_a from public.adopciones where id = p_adopcion_id;
  if not found or v_a.estado = 'retirada' or v_a.es_prueba <> public.es_cuenta_de_prueba() then
    raise exception 'Esta publicación no está disponible';
  end if;
  if v_a.publicado_por = auth.uid() then
    raise exception 'No puedes reportar tu propia publicación';
  end if;
  if exists (select 1 from public.reportes_adopcion
             where adopcion_id = p_adopcion_id and reportado_por = auth.uid() and estado = 'pendiente') then
    raise exception 'Ya reportaste esta publicación. La estamos revisando.';
  end if;

  insert into public.reportes_adopcion (adopcion_id, reportado_por, motivo, comentario)
  values (p_adopcion_id, auth.uid(), p_motivo, nullif(left(trim(p_comentario), 500), ''))
  returning id into v_id;
  return v_id;
end;
$$;

revoke execute on function public.reportar_adopcion from public, anon;
grant  execute on function public.reportar_adopcion to authenticated;

-- ---------- Casos (una fila por publicación reportada) ----------
-- p_estado: 'pendiente' (tiene reportes sin revisar), 'resuelto' o 'descartado'
-- (todos sus reportes revisados; manda la última decisión).
create function public.casos_moderacion(p_estado text default 'pendiente')
returns table (
  adopcion_id        bigint,
  nombre             text,
  especie            text,
  raza               text,
  fecha_nacimiento   date,
  comuna             text,
  foto_url           text,
  estado_publicacion text,
  publicada_en       timestamptz,
  publicador         text,
  es_prueba          boolean,
  reportes           bigint,
  motivo_principal   text,
  urgente            boolean,
  ultimo_reporte     timestamptz,
  publicaciones      bigint,       -- del mismo publicador
  reportes_previos   bigint,       -- casos ya resueltos (no descartados) del mismo publicador
  cuenta_creada_en   timestamptz,
  decision           text,
  detalle            jsonb         -- [{"motivo","comentario","creada_en"}]
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin modera';
  end if;
  return query
    with r as (
      select x.*,
             bool_or(x.estado = 'pendiente') over (partition by x.adopcion_id) as tiene_pendientes
      from public.reportes_adopcion x
    ), elegidos as (
      select * from r
      where (p_estado = 'pendiente' and r.estado = 'pendiente')
         or (p_estado <> 'pendiente' and not r.tiene_pendientes and r.estado = p_estado)
    )
    select a.id, a.nombre, a.especie::text, a.raza, a.fecha_nacimiento, a.comuna,
           coalesce(a.fotos[1], a.foto_url), a.estado, a.creada_en, p.nombre, a.es_prueba,
           count(*),
           mode() within group (order by e.motivo),
           bool_or(e.motivo in ('riesgo', 'estafa', 'dinero')) or count(*) >= 3,
           max(e.creada_en),
           (select count(*) from public.adopciones o where o.publicado_por = a.publicado_por),
           (select count(distinct q.adopcion_id) from public.reportes_adopcion q
            join public.adopciones o on o.id = q.adopcion_id
            where o.publicado_por = a.publicado_por and q.estado = 'resuelto' and q.adopcion_id <> a.id),
           p.creado_en,
           (select q.decision from public.reportes_adopcion q where q.adopcion_id = a.id and q.decision is not null
            order by q.resuelto_en desc limit 1),
           jsonb_agg(jsonb_build_object('motivo', e.motivo, 'comentario', e.comentario, 'creada_en', e.creada_en)
                     order by e.creada_en desc)
    from elegidos e
    join public.adopciones a on a.id = e.adopcion_id
    join public.perfiles p on p.id = a.publicado_por
    group by a.id, p.id
    order by (bool_or(e.motivo in ('riesgo', 'estafa', 'dinero')) or count(*) >= 3) desc, max(e.creada_en) desc;
end;
$$;

revoke execute on function public.casos_moderacion from public, anon;
grant  execute on function public.casos_moderacion to authenticated;

create function public.resumen_moderacion()
returns table (por_revisar bigint, urgentes bigint, horas_respuesta numeric, ocultas bigint)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin modera';
  end if;
  return query
    with casos as (
      select x.adopcion_id, bool_or(x.motivo in ('riesgo', 'estafa', 'dinero')) or count(*) >= 3 as urgente
      from public.reportes_adopcion x where x.estado = 'pendiente' group by x.adopcion_id
    )
    select (select count(*) from casos),
           (select count(*) from casos where casos.urgente),
           (select round(avg(extract(epoch from (x.resuelto_en - x.creada_en)) / 3600)::numeric, 1)
            from public.reportes_adopcion x where x.resuelto_en > now() - interval '30 days'),
           (select count(*) from public.adopciones a where a.moderada_en is not null);
end;
$$;

revoke execute on function public.resumen_moderacion from public, anon;
grant  execute on function public.resumen_moderacion to authenticated;

-- ---------- Resolver un caso ----------
create function public.resolver_moderacion(p_adopcion_id bigint, p_decision text, p_mensaje text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_superadmin() then
    raise exception 'Solo el superadmin modera';
  end if;
  if p_decision not in ('ocultar', 'advertir', 'descartar') then
    raise exception 'Decisión no válida';
  end if;
  if p_decision <> 'descartar' and nullif(trim(p_mensaje), '') is null then
    raise exception 'Escribe el mensaje para quien publicó';
  end if;

  update public.reportes_adopcion
     set estado = case when p_decision = 'descartar' then 'descartado' else 'resuelto' end,
         decision = p_decision, resuelto_por = auth.uid(), resuelto_en = now()
   where adopcion_id = p_adopcion_id and estado = 'pendiente';
  if not found then
    raise exception 'Este caso ya no tiene reportes pendientes';
  end if;

  if p_decision = 'ocultar' then
    update public.adopciones
       set estado = 'retirada', moderada_en = now(), mensaje_moderacion = left(trim(p_mensaje), 500)
     where id = p_adopcion_id;
  elsif p_decision = 'advertir' then
    update public.adopciones set advertencia = left(trim(p_mensaje), 500) where id = p_adopcion_id;
  end if;
end;
$$;

revoke execute on function public.resolver_moderacion from public, anon;
grant  execute on function public.resolver_moderacion to authenticated;

-- ---------- Lo que ve quien publicó ----------
create function public.avisos_moderacion_mias()
returns table (adopcion_id bigint, tipo text, mensaje text)
language sql stable security definer set search_path = ''
as $$
  select a.id,
         case when a.moderada_en is not null then 'oculta' else 'advertencia' end,
         coalesce(case when a.moderada_en is not null then a.mensaje_moderacion end, a.advertencia)
  from public.adopciones a
  where (a.publicado_por = auth.uid() or (a.refugio_id is not null and public.es_admin_de_refugio(a.refugio_id)))
    and (a.moderada_en is not null or a.advertencia is not null);
$$;

revoke execute on function public.avisos_moderacion_mias from public, anon;
grant  execute on function public.avisos_moderacion_mias to authenticated;
