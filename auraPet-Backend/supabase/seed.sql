-- =====================================================================
-- AuraPet — Catálogos base (seed)
--
-- Solo datos que la app necesita para funcionar en cualquier proyecto:
--   · especialidades (para registrar centros y veterinarios)
--   · categorías de contacto (las preguntas frecuentes del Home y Contacto)
-- Centros, profesionales, mascotas y citas se crean desde la app.
--
-- Se puede ejecutar las veces que sea: lo que ya existe se salta o se
-- actualiza. Para agregar una especialidad o pregunta, súmala aquí y corre:
--   npx supabase db push --include-seed
-- =====================================================================

-- ---------- Especialidades ----------
insert into especialidades (nombre) values
  ('Medicina general'),
  ('Cirugía'),
  ('Imagenología'),
  ('Dermatología'),
  ('Laboratorio'),
  ('Radiografía'),
  ('Ecografía'),
  ('Traumatología'),
  ('Oftalmología'),
  ('Odontología veterinaria'),
  ('Medicina felina')
on conflict (nombre) do nothing;

-- ---------- Categorías de contacto (preguntas frecuentes) ----------
-- Si cambias el texto de una pregunta o respuesta aquí, se actualiza.
insert into categorias_contacto (slug, pregunta, respuesta) values
  ('precios', '¿Cuánto cuesta usar AuraPet?',
   'AuraPet es gratuito para los dueños de mascotas. Las veterinarias y centros tienen sus propios planes para administrar pacientes, agenda y fichas clínicas.'),
  ('login', 'Olvidé mi contraseña, ¿cómo la recupero?',
   'Desde la pantalla de inicio de sesión puedes solicitar restablecer tu contraseña con tu correo registrado. Te llegará un enlace para crear una nueva.'),
  ('notificaciones', '¿Por qué no me llegan los recordatorios de mis citas?',
   'Puede deberse a los permisos de notificaciones de tu dispositivo o a un correo desactualizado en tu perfil. Si ya revisaste eso y sigue sin llegarte, escríbenos para revisarlo.'),
  ('historial-celular', '¿Puedo ver el historial médico de mi mascota desde el celular?',
   'Sí, el historial de vacunas, diagnósticos y tratamientos se ve igual desde el celular que desde el computador, apenas tu veterinaria lo vaya registrando.'),
  ('registro-veterinaria', '¿Cómo registro mi veterinaria o centro en la plataforma?',
   'Escríbenos contándonos sobre tu centro (sucursales, cantidad de veterinarios) y nuestro equipo te guía en el proceso de validación y alta.'),
  ('cobertura', '¿AuraPet funciona fuera de la Región Metropolitana?',
   'Estamos sumando veterinarias de otras regiones de forma progresiva. Si en tu ciudad aún no hay centros afiliados, escríbenos y te avisamos apenas se sumen.'),
  ('cuenta-eliminar', '¿Puedo eliminar mi cuenta y mis datos?',
   'Sí, puedes solicitar la eliminación de tu cuenta y tu historial escribiéndonos desde este formulario. Lo procesamos manualmente para confirmar que seas tú.'),
  ('bugs-app', 'La app se cierra o se traba al usarla, ¿qué hago?',
   'Cuéntanos el modelo de tu celular y en qué paso exacto se cierra (agendar, subir una foto, etc.) para poder reproducir el error y arreglarlo lo antes posible.'),
  ('cambio-veterinaria', '¿Puedo cambiar a mi mascota de veterinaria sin perder su historial?',
   'Sí, el historial queda asociado a tu mascota, no al centro. Al agendar en una nueva veterinaria afiliada, el equipo puede ver sus registros anteriores.'),
  ('multi-veterinario', '¿Cómo agrego a otros veterinarios de mi centro a la plataforma?',
   'Como encargada o encargado del centro puedes invitar a tus colegas desde el panel de tu centro para que vean y actualicen las fichas de los pacientes.')
on conflict (slug) do update
  set pregunta = excluded.pregunta,
      respuesta = excluded.respuesta;


-- ---------- Centro de pruebas ----------
-- Solo para desarrollo: aquí asignamos los profesionales que vamos creando.
-- Quitar antes de pasar a producción.
insert into centros (nombre, direccion, comuna, estado_verificacion, revisado_en)
select 'Pruebas AuraPet', 'Dirección de prueba 123', 'Santiago', 'aprobado', now()
where not exists (select 1 from centros where nombre = 'Pruebas AuraPet');

-- Horario: lunes (1) a viernes (5), de 09:00 a 18:00, colación 13:00 a 14:00
insert into horarios_centro (centro_id, dia_semana, abre, cierra, inicio_colacion, fin_colacion)
select c.id, d.dia, '09:00', '18:00', '13:00', '14:00'
from centros c
cross join generate_series(1, 5) as d(dia)
where c.nombre = 'Pruebas AuraPet'
on conflict (centro_id, dia_semana) do nothing;

-- Todas las especialidades del catálogo, para poder probar cualquiera
insert into centro_especialidades (centro_id, especialidad_id)
select c.id, e.id
from centros c
cross join especialidades e
where c.nombre = 'Pruebas AuraPet'
on conflict do nothing;