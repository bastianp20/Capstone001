-- =====================================================================
-- AuraPet — 05: Número de colegiatura opcional
--
-- Colegiarse no es obligatorio para ejercer, así que el número pasa a ser
-- opcional (en la app se muestra como "recomendado").
-- Sigue siendo único: dos veterinarios no pueden tener el mismo número.
-- Ojo desde el front: si viene vacío, guardar null y no "" (varios null
-- están permitidos, pero dos "" chocarían con el unique).
-- =====================================================================
alter table veterinarios alter column numero_colegiado drop not null;
