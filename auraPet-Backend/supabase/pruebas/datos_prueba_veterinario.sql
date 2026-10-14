-- =====================================================================
-- DATOS DE PRUEBA para la pantalla de inicio del veterinario
-- Ejecutar en Supabase → SQL Editor. Cambia los 2 correos de abajo.
-- Todo lo que crea queda marcado con microchip 'PRUEBA-...' para borrarlo después.
-- =====================================================================
do $$
declare
  v_vet_id    bigint;
  v_dueno_id  uuid;
  v_centro_id bigint;
  v_hoy       date := (now() at time zone 'America/Santiago')::date;  -- "hoy" en Chile
  m1 bigint; m2 bigint; m3 bigint; m4 bigint;
  dia int;
begin
  -- 1) Quién es quién (CAMBIA ESTOS CORREOS)
  select v.id into v_vet_id
  from veterinarios v join auth.users u on u.id = v.perfil_id
  where u.email = 'CORREO_DEL_VETERINARIO@ejemplo.cl';

  select u.id into v_dueno_id
  from auth.users u join perfiles p on p.id = u.id
  where u.email = 'CORREO_DE_UN_DUENO@ejemplo.cl';

  if v_vet_id is null then raise exception 'No encontré la ficha de veterinario de ese correo'; end if;
  if v_dueno_id is null then raise exception 'No encontré la cuenta de dueño de ese correo'; end if;

  -- Un centro donde atiende el veterinario (o el primero que exista)
  select coalesce(
    (select centro_id from veterinario_centros where veterinario_id = v_vet_id limit 1),
    (select id from centros order by id limit 1)
  ) into v_centro_id;

  -- 2) Mascotas
  insert into mascotas (dueno_id, nombre, especie, raza, sexo, fecha_nacimiento, peso_kg, alergias, microchip)
  values (v_dueno_id, 'Firulais', 'perro', 'Labrador', 'macho', v_hoy - interval '4 years', 28, 'penicilina', 'PRUEBA-1')
  returning id into m1;
  insert into mascotas (dueno_id, nombre, especie, sexo, microchip)
  values (v_dueno_id, 'Toby', 'perro', 'macho', 'PRUEBA-2') returning id into m2;
  insert into mascotas (dueno_id, nombre, especie, sexo, microchip)
  values (v_dueno_id, 'Luna', 'gato', 'hembra', 'PRUEBA-3') returning id into m3;
  insert into mascotas (dueno_id, nombre, especie, sexo, condiciones_cronicas, microchip)
  values (v_dueno_id, 'Max', 'perro', 'macho', 'Diabetes', 'PRUEBA-4') returning id into m4;

  -- 3) Citas de HOY (hora de Chile) en distintos estados
  insert into citas (mascota_id, centro_id, veterinario_id, fecha_hora, motivo, estado, urgencia_sugerida, sintomas_reportados) values
    (m2, v_centro_id, v_vet_id, (v_hoy + time '09:00') at time zone 'America/Santiago', 'Control', 'completada', null, '{}'),
    (m1, v_centro_id, v_vet_id, (v_hoy + time '10:30') at time zone 'America/Santiago', 'Vómitos desde ayer', 'confirmada', 'alta', '{vómitos,decaimiento}'),
    (m3, v_centro_id, v_vet_id, (v_hoy + time '12:00') at time zone 'America/Santiago', 'Vacuna', 'pendiente', null, '{}'),
    (m4, v_centro_id, v_vet_id, (v_hoy + time '15:30') at time zone 'America/Santiago', 'Control post operatorio', 'confirmada', null, '{}');

  -- 4) Atenciones completadas en los días anteriores del mes (para el gráfico)
  for dia in 1 .. extract(day from v_hoy)::int - 1 loop
    insert into citas (mascota_id, centro_id, veterinario_id, fecha_hora, motivo, estado)
    select m2, v_centro_id, v_vet_id,
           -- cada atención a otra hora (09:00, 10:00, ...): la base no permite dos citas
           -- del mismo veterinario a la misma hora
           (date_trunc('month', v_hoy)::date + (dia - 1) + time '08:00' + g * interval '1 hour') at time zone 'America/Santiago',
           'Atención de prueba', 'completada'
    from generate_series(1, (random() * 5)::int) as g;  -- entre 0 y 5 atenciones ese día
  end loop;

  -- 5) Recetas: una reciente con control en 3 días y otra con control en 6
  insert into recetas (mascota_id, veterinario_id, indicaciones, proximo_control) values
    (m1, v_vet_id, 'Receta de prueba', v_hoy + 3),
    (m3, v_vet_id, 'Receta de prueba', v_hoy + 6);

  raise notice 'Listo: veterinario %, centro %, mascotas % % % %', v_vet_id, v_centro_id, m1, m2, m3, m4;
end $$;
