-- =====================================================================
-- AuraPet — 33: Notas personales
--
-- Libreta de notas de cada persona (la usan el superadmin y los
-- veterinarios). Cada uno ve y edita SOLO sus notas.
-- =====================================================================

create table notas (
  id              bigint generated always as identity primary key,
  perfil_id       uuid not null default auth.uid() references perfiles (id) on delete cascade,
  titulo          text not null check (length(trim(titulo)) between 1 and 120),
  contenido       text not null default '' check (length(contenido) <= 4000),
  color           text not null default 'menta' check (color in ('menta', 'arena', 'cielo', 'lavanda', 'coral')),
  fijada          boolean not null default false,
  creada_en       timestamptz not null default now(),
  actualizada_en  timestamptz not null default now()
);

create index on notas (perfil_id, fijada desc, actualizada_en desc);

alter table notas enable row level security;

create policy "cada uno ve sus notas"
  on notas for select to authenticated using (perfil_id = auth.uid());

create policy "cada uno crea sus notas"
  on notas for insert to authenticated with check (perfil_id = auth.uid());

create policy "cada uno edita sus notas"
  on notas for update to authenticated using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());

create policy "cada uno borra sus notas"
  on notas for delete to authenticated using (perfil_id = auth.uid());

-- actualizada_en se pone sola al editar
create function public.tocar_nota()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.actualizada_en := now();
  return new;
end;
$$;

create trigger al_editar_nota
  before update on notas
  for each row execute function public.tocar_nota();
