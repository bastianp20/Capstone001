-- =====================================================================
-- DATOS DE PRUEBA para la página /adopta y la ficha (necesita las migraciones 36 y 37)
-- Ejecutar en Supabase → SQL Editor. Cambia los 2 correos de abajo.
--
-- · Quien publica: si es una cuenta DE PRUEBA, los animales solo los verán
--   las cuentas de prueba. Para verlos sin iniciar sesión, usa una cuenta normal.
-- · El veterinario (aprobado) firma los chequeos. Si lo dejas como está,
--   los animales quedan sin chequeo.
-- Todo queda marcado con microchip 'PRUEBA-ADOP-...' (para borrarlo, ver abajo).
-- =====================================================================
do $$
declare
  v_publica uuid;
  v_vet     bigint;
  v_centro  bigint;
  v_hoy     date := (now() at time zone 'America/Santiago')::date;
  a         record;
begin
  -- 1) Quién es quién (CAMBIA ESTOS CORREOS)
  select id into v_publica from auth.users where email = 'CORREO_DE_QUIEN_PUBLICA@ejemplo.cl';
  select v.id into v_vet
  from veterinarios v join auth.users u on u.id = v.perfil_id
  where u.email = 'CORREO_DEL_VETERINARIO@ejemplo.cl' and v.estado_verificacion = 'aprobado';

  if v_publica is null then raise exception 'No encontré la cuenta de quien publica'; end if;
  select centro_id into v_centro from veterinario_centros where veterinario_id = v_vet limit 1;

  -- 2) Animales esperando hogar
  insert into adopciones (publicado_por, nombre, especie, raza, sexo, tamano, fecha_nacimiento, comuna,
                          historia, frase, personalidad, vacunas_al_dia, esterilizado, estado, microchip)
  values
    (v_publica, 'Canela', 'perro', null, 'hembra', 'mediano', v_hoy - interval '2 years', 'Ñuñoa',
     'La encontramos en una plaza de Ñuñoa, con frío pero moviendo la cola.', 'Me encanta dormir al sol y que me rasquen las orejas.',
     '{Cariñosa,Juguetona,Sociable}', true, true, 'publicada', 'PRUEBA-ADOP-1'),
    (v_publica, 'Luna', 'gato', 'Común europeo', 'hembra', 'pequeno', v_hoy - interval '2 years', 'Maipú',
     null, null, '{Cariñosa}', true, true, 'publicada', 'PRUEBA-ADOP-2'),
    (v_publica, 'Pelusa', 'gato', 'Angora', 'hembra', 'pequeno', v_hoy - interval '5 years', 'Providencia',
     null, 'Prefiero las casas tranquilas.', '{Independiente,Tranquila}', false, true, 'publicada', 'PRUEBA-ADOP-3'),
    (v_publica, 'Michi', 'gato', null, 'macho', 'pequeno', v_hoy - interval '4 months', 'Providencia',
     null, null, '{Curioso,Juguetón}', false, false, 'publicada', 'PRUEBA-ADOP-4'),
    (v_publica, 'Negrita', 'perro', null, 'hembra', 'grande', v_hoy - interval '8 years', 'La Florida',
     null, 'Todavía me quedan muchas ganas de pasear.', '{Juguetona,Fiel}', true, true, 'publicada', 'PRUEBA-ADOP-5'),
    (v_publica, 'Tomás', 'perro', null, 'macho', 'mediano', v_hoy - interval '3 years', 'San Miguel',
     null, null, '{Inteligente,Tranquilo}', false, false, 'publicada', 'PRUEBA-ADOP-6'),
    (v_publica, 'Bruno', 'perro', 'Labrador', 'macho', 'grande', v_hoy - interval '9 years', 'Maipú',
     null, 'Soy un abuelito que solo pide un sillón.', '{Tranquilo,"Ideal para departamento"}', true, true, 'en_proceso', 'PRUEBA-ADOP-7'),
    (v_publica, 'Chocolo', 'perro', null, 'macho', 'grande', v_hoy - interval '1 year', 'Puente Alto',
     null, null, '{Protector}', true, false, 'publicada', 'PRUEBA-ADOP-8'),
    (v_publica, 'Kira', 'perro', null, 'hembra', 'mediano', v_hoy - interval '6 months', 'Recoleta',
     null, null, '{Leal,Juguetona}', false, false, 'publicada', 'PRUEBA-ADOP-9');

  -- 3) Ya tienen familia (con testimonio)
  insert into adopciones (publicado_por, nombre, especie, sexo, tamano, comuna, estado, adoptada_en,
                          testimonio, testimonio_autor, microchip)
  values
    (v_publica, 'Luna', 'gato', 'hembra', 'pequeno', 'Ñuñoa', 'adoptada', now() - interval '2 days',
     'Ya se adueñó de la casa y de la cama.', 'Javiera', 'PRUEBA-ADOP-10'),
    (v_publica, 'Negro', 'perro', 'macho', 'grande', 'Macul', 'adoptada', now() - interval '20 days',
     'Es el mejor compañero de trote.', 'Felipe', 'PRUEBA-ADOP-11'),
    (v_publica, 'Rocky', 'perro', 'macho', 'mediano', 'Maipú', 'adoptada', now() - interval '45 days',
     'Ahora duerme en el sillón. Es el regalón de la familia.', 'Marcela', 'PRUEBA-ADOP-12');

  -- 4) Datos de la ficha: rasgos (1 a 5), peso, alergias, microchip
  update adopciones set energia = 4, sociable_perros = 5, sociable_gatos = 3, sociable_ninos = 5, peso_kg = 18, con_microchip = true,
         alergias = 'Ninguna conocida' where microchip = 'PRUEBA-ADOP-1';
  update adopciones set energia = 2, sociable_perros = 2, sociable_gatos = 4, sociable_ninos = 3, peso_kg = 4 where microchip = 'PRUEBA-ADOP-2';
  update adopciones set energia = 1, sociable_perros = 1, sociable_gatos = 3, sociable_ninos = 2, peso_kg = 5 where microchip = 'PRUEBA-ADOP-3';
  update adopciones set energia = 5, sociable_perros = 3, sociable_gatos = 5, sociable_ninos = 4, peso_kg = 1.5, solicita_chequeo = true where microchip = 'PRUEBA-ADOP-4';
  update adopciones set energia = 3, sociable_perros = 4, sociable_gatos = 2, sociable_ninos = 5, peso_kg = 26, con_microchip = true where microchip = 'PRUEBA-ADOP-5';
  update adopciones set energia = 3, sociable_perros = 4, sociable_gatos = 3, sociable_ninos = 4, peso_kg = 15, solicita_chequeo = true where microchip = 'PRUEBA-ADOP-6';
  update adopciones set energia = 1, sociable_perros = 4, sociable_gatos = 4, sociable_ninos = 5, peso_kg = 32, con_microchip = true,
         alergias = 'Pollo' where microchip = 'PRUEBA-ADOP-7';
  update adopciones set energia = 4, sociable_perros = 2, sociable_gatos = 1, sociable_ninos = 3, peso_kg = 30 where microchip = 'PRUEBA-ADOP-8';
  update adopciones set energia = 5, sociable_perros = 5, sociable_gatos = 3, sociable_ninos = 5, peso_kg = 9 where microchip = 'PRUEBA-ADOP-9';

  -- 5) Chequeos del veterinario (si se encontró)
  if v_vet is not null then
    for a in select id, nombre from adopciones
             where microchip in ('PRUEBA-ADOP-1','PRUEBA-ADOP-2','PRUEBA-ADOP-3','PRUEBA-ADOP-5','PRUEBA-ADOP-7','PRUEBA-ADOP-8')
    loop
      insert into chequeos_adopcion (adopcion_id, veterinario_id, centro_id, fecha, resumen, solidario)
      values (a.id, v_vet, v_centro, v_hoy - 10,
              case a.nombre when 'Bruno' then 'Sano para su edad, vacunas al día'
                            when 'Pelusa' then 'Esterilizada, desparasitada'
                            else 'Vacunas al día, desparasitado/a' end,
              a.nombre <> 'Bruno');
    end loop;
  end if;
end $$;

-- BORRAR estos datos (los chequeos se borran solos con la publicación):
-- delete from adopciones where microchip like 'PRUEBA-ADOP-%';
