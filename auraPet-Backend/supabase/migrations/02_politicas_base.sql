-- =====================================================================
-- AuraPet — 02: Funciones de permisos y políticas base
--
-- Lo mínimo para que el front pueda conectarse:
--   · funciones auxiliares para saber quién es quién
--   · nadie puede cambiarse el rol a sí mismo
--   · lectura pública de lo que ve un visitante sin cuenta
--     (centros aprobados, horarios, especialidades, preguntas frecuentes)
--   · cualquiera puede enviar un mensaje de contacto
--   · cada persona ve y edita su propio perfil
--
-- Mascotas, citas, historial y recetas siguen BLOQUEADAS: sus políticas
-- (la matriz de permisos por rol) van en la migración 03.
-- =====================================================================


-- =====================================================================
-- FUNCIONES AUXILIARES
-- Se usan dentro de las políticas. Son "security definer" para poder leer
-- perfiles y admins_centro sin quedar atrapadas en su propio RLS.
-- auth.uid() = id de la persona que inició sesión (null si no hay sesión).
-- =====================================================================

-- ¿La persona conectada es superadmin (y su cuenta está activa)?
create function public.es_superadmin()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'superadmin' and desactivado_en is null
  );
$$;

-- ¿La persona conectada es admin de este centro?
create function public.es_admin_de_centro(p_centro_id bigint)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admins_centro
    where centro_id = p_centro_id and perfil_id = auth.uid()
  );
$$;

-- Id de veterinario de la persona conectada (null si no es veterinario).
create function public.mi_veterinario_id()
returns bigint
language sql stable
security definer set search_path = ''
as $$
  select id from public.veterinarios where perfil_id = auth.uid();
$$;


-- =====================================================================
-- PROTECCIÓN DEL ROL
-- Cada persona puede editar su perfil (nombre, teléfono, avatar), pero
-- solo un superadmin puede cambiar el rol de alguien.
-- Además, nunca puede quedar la plataforma sin un superadmin activo.
-- =====================================================================
create function public.proteger_cambio_de_rol()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.rol is distinct from old.rol
     and auth.uid() is not null          -- desde el panel de Supabase (sin sesión) sí se permite
     and not public.es_superadmin() then
    raise exception 'Solo un superadmin puede cambiar el rol de una cuenta';
  end if;

  -- ¿Este cambio deja a la plataforma sin superadmins activos?
  if old.rol = 'superadmin' and old.desactivado_en is null
     and (new.rol <> 'superadmin' or new.desactivado_en is not null)
     and not exists (
       select 1 from public.perfiles
       where rol = 'superadmin' and desactivado_en is null and id <> old.id
     ) then
    raise exception 'No se puede quitar el último superadmin activo';
  end if;

  return new;
end;
$$;

create trigger antes_de_editar_perfil
  before update on public.perfiles
  for each row execute function public.proteger_cambio_de_rol();


-- =====================================================================
-- POLÍTICAS
-- "to anon"          = visitantes sin sesión
-- "to authenticated" = personas con sesión iniciada
-- using (...)        = qué filas puede ver/tocar
-- with check (...)   = qué valores puede guardar
-- =====================================================================

-- ---------- Perfiles ----------
create policy "cada uno ve su perfil; el superadmin ve todos"
  on perfiles for select to authenticated
  using (id = auth.uid() or public.es_superadmin());

create policy "cada uno edita su perfil; el superadmin edita todos"
  on perfiles for update to authenticated
  using (id = auth.uid() or public.es_superadmin())
  with check (id = auth.uid() or public.es_superadmin());

-- ---------- Especialidades (catálogo público) ----------
create policy "todos ven las especialidades"
  on especialidades for select to anon, authenticated
  using (true);

create policy "el superadmin administra especialidades"
  on especialidades for all to authenticated
  using (public.es_superadmin())
  with check (public.es_superadmin());

-- ---------- Centros ----------
create policy "todos ven centros aprobados; admins y superadmin, los suyos"
  on centros for select to anon, authenticated
  using (
    estado_verificacion = 'aprobado'
    or public.es_superadmin()
    or public.es_admin_de_centro(id)
  );

create policy "el admin edita su centro; el superadmin edita todos"
  on centros for update to authenticated
  using (public.es_admin_de_centro(id) or public.es_superadmin())
  with check (public.es_admin_de_centro(id) or public.es_superadmin());

create policy "el superadmin crea centros"
  on centros for insert to authenticated
  with check (public.es_superadmin());

create policy "el superadmin elimina centros"
  on centros for delete to authenticated
  using (public.es_superadmin());

-- ---------- Horarios y especialidades de cada centro ----------
-- Se ven si el centro es visible (la política de centros se aplica en el exists).
create policy "todos ven horarios de centros visibles"
  on horarios_centro for select to anon, authenticated
  using (exists (select 1 from centros c where c.id = centro_id));

create policy "admin del centro o superadmin editan horarios"
  on horarios_centro for all to authenticated
  using (public.es_admin_de_centro(centro_id) or public.es_superadmin())
  with check (public.es_admin_de_centro(centro_id) or public.es_superadmin());

create policy "todos ven especialidades de centros visibles"
  on centro_especialidades for select to anon, authenticated
  using (exists (select 1 from centros c where c.id = centro_id));

create policy "admin del centro o superadmin editan sus especialidades"
  on centro_especialidades for all to authenticated
  using (public.es_admin_de_centro(centro_id) or public.es_superadmin())
  with check (public.es_admin_de_centro(centro_id) or public.es_superadmin());

-- ---------- Admins de centro ----------
create policy "cada uno ve sus cargos; admins y superadmin ven los del centro"
  on admins_centro for select to authenticated
  using (perfil_id = auth.uid() or public.es_admin_de_centro(centro_id) or public.es_superadmin());

create policy "admin del centro o superadmin promueven y quitan admins"
  on admins_centro for all to authenticated
  using (public.es_admin_de_centro(centro_id) or public.es_superadmin())
  with check (public.es_admin_de_centro(centro_id) or public.es_superadmin());

-- ---------- Contacto y preguntas frecuentes ----------
create policy "todos ven las categorías de contacto"
  on categorias_contacto for select to anon, authenticated
  using (true);

create policy "el superadmin administra las categorías"
  on categorias_contacto for all to authenticated
  using (public.es_superadmin())
  with check (public.es_superadmin());

-- Cualquiera puede escribir, pero el mensaje entra siempre como 'pendiente'.
create policy "cualquiera envía un mensaje de contacto"
  on mensajes_contacto for insert to anon, authenticated
  with check (estado = 'pendiente');

create policy "el superadmin lee y gestiona los mensajes"
  on mensajes_contacto for all to authenticated
  using (public.es_superadmin())
  with check (public.es_superadmin());

-- ---------- Preguntas frecuentes ----------
-- Reemplaza getPreguntasFrecuentes(limite) del front. Es una función y no
-- una vista para que pueda contar los mensajes (que están protegidos) y
-- devolver solo pregunta, respuesta y cantidad, nunca los mensajes ni
-- quién los envió. Desde el front:
--   const { data } = await supabase.rpc("preguntas_frecuentes", { limite: 6 });
create function public.preguntas_frecuentes(limite int default 6)
returns table (pregunta text, respuesta text, cantidad int)
language sql stable
security definer set search_path = ''
as $$
  select c.pregunta, c.respuesta, count(m.id)::int as cantidad
  from public.categorias_contacto c
  join public.mensajes_contacto m on m.categoria = c.slug
  group by c.slug, c.pregunta, c.respuesta
  order by cantidad desc, c.pregunta
  limit greatest(limite, 0);
$$;
