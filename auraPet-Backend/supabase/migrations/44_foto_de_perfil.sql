-- =====================================================================
-- 44 · Foto de perfil (opcional, para todos los roles)
-- ---------------------------------------------------------------------
-- perfiles.avatar_url ya existía (migración 01). Ahora guarda la RUTA de
-- la foto en el bucket público "avatares" (carpeta = id de la persona).
-- · Cada persona sube, cambia o borra solo en su carpeta (2 MB, jpg/png/webp).
-- · avatar_url solo puede apuntar a la carpeta propia (o ser null), así
--   nadie usa la foto de otra persona.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "avatares: subir a la carpeta propia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatares: cambiar la foto propia"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatares: borrar la foto propia"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatares' and ((storage.foldername(name))[1] = auth.uid()::text or public.es_superadmin()));

create function public.validar_avatar()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.avatar_url is not null
     and new.avatar_url is distinct from old.avatar_url
     and split_part(new.avatar_url, '/', 1) <> new.id::text then
    raise exception 'La foto de perfil debe estar en tu propia carpeta';
  end if;
  return new;
end;
$$;

create trigger perfiles_validar_avatar
  before update of avatar_url on perfiles
  for each row execute function public.validar_avatar();
