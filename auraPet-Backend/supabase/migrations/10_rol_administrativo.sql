--  a esta nueva migracion le agregamos el nuevo rol del usuario "administrativo" 
-- Cuenta de una persona que administra uno o más centros pero NO es veterinaria
-- (recepción, gerencia, etc.). Va sola en su archivo porque Postgres no deja
-- usar un valor nuevo de un enum en la misma transacción en que se agrega.
-- debemos recordar que un enum es basicamente como un tipado estricto, solo puede tener ciertos valores 
alter type public.rol_usuario add value if not exists 'administrativo';