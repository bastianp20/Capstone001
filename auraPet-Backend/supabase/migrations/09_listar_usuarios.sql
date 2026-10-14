
-- ésta es una funcion de plsql que se encarga de traer a todos lo usuarios. 
-- nos retorna una tabla con los campos: id, nombre, email, rol, telefono, desactivado y creado en

create function public.listar_usuarios()
returns table (
  id              uuid,
  nombre          text,
  email           text,
  rol             public.rol_usuario,
  telefono        bigint,
  desactivado_en  timestamptz,
  creado_en       timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
--  aquí validamos que efectivamente sea un superAdmin el que haga esto, ya que solo el superAdmin puede ver la lista completa de usuarios dentro de la app. 
  if not public.es_superadmin() then
    raise exception 'Solo un superadmin puede ver la lista de usuarios';
  end if;

  return query
    select p.id, p.nombre, u.email::text, p.rol, p.telefono, p.desactivado_en, p.creado_en
    from public.perfiles p
    join auth.users u on u.id = p.id
    order by p.creado_en desc;
end;
$$;

-- aquí le estamos quitando el permiso de ver esto a los que no se han logeado
revoke execute on function public.listar_usuarios from public, anon;
-- para poder darselo a los que efectivamente están logeados.
grant  execute on function public.listar_usuarios to authenticated;