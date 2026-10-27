-- BORRAR los datos de prueba (en este orden, por las relaciones)
delete from recetas where mascota_id in (select id from mascotas where microchip like 'PRUEBA-%');
delete from citas   where mascota_id in (select id from mascotas where microchip like 'PRUEBA-%');
delete from mascotas where microchip like 'PRUEBA-%';

-- Adopciones de prueba (los chequeos se borran solos)
delete from adopciones where microchip like 'PRUEBA-ADOP-%';
