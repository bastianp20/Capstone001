-- =====================================================================
-- AuraPet — 30: Formulario de contacto real
--
-- La tabla mensajes_contacto y sus permisos existen desde las migraciones
-- 01/02 (cualquiera inserta como 'pendiente'; el superadmin gestiona).
-- Como el formulario es público (anon), se limitan los largos para que no
-- se pueda llenar la base con textos gigantes. "not valid" = solo revisa
-- los mensajes nuevos, no los que ya existen.
-- =====================================================================

alter table mensajes_contacto
  add constraint mensajes_contacto_largos check (
    length(trim(nombre)) between 2 and 120
    and length(correo) <= 160
    and correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(asunto) <= 80
    and length(trim(mensaje)) between 10 and 2000
  ) not valid;

create index if not exists mensajes_contacto_estado_fecha on mensajes_contacto (estado, creado_en desc);
