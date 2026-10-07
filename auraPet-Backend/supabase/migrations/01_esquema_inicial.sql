-- =====================================================================
-- AuraPet — 01: Esquema inicial
-- Supabase (PostgreSQL)
--
-- Sale del análisis de src/Data, src/interfaces.ts y src/Api/getInfo.tsx
-- del front, más lo acordado en la revisión del modelo:
--   · teléfonos como número (bigint)
--   · horario de centros con corte de colación opcional
--   · disponibilidad de veterinarios (horarios_veterinario)
--   · citas sin choque de horario para un mismo veterinario
--   · urgencia sugerida por la IA separada de la urgencia final
--   · verificación de centros y veterinarios (reemplaza solicitudes)
--   · datos médicos fijos de la mascota y próxima dosis de vacunas
--   · estado en derivaciones, motivo y autor de cancelaciones
--   · cuentas desactivables y borrado que NO se lleva el historial clínico
--   · admin de centro como cargo dentro de un centro (admins_centro),
--     no como tipo de cuenta: un veterinario puede ser promovido
--   · el perfil se crea solo cuando alguien se registra (trigger)
--
-- Las políticas RLS (quién puede leer/escribir qué) van en las migraciones 02 en adelante.
-- Este archivo NO se edita una vez aplicado: los cambios van en migraciones nuevas.
-- =====================================================================


-- =====================================================================
-- TIPOS (equivalen a los "type" de interfaces.ts)
-- =====================================================================
-- rol = tipo de cuenta principal (define qué panel ve al entrar).
-- "Admin de centro" NO es un rol: es un cargo en la tabla admins_centro.
create type rol_usuario          as enum ('dueno', 'veterinario', 'superadmin');
create type especie_mascota      as enum ('perro', 'gato', 'ave', 'conejo', 'otro');
create type sexo_mascota         as enum ('macho', 'hembra');
create type estado_cita          as enum ('pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada');
create type urgencia_cita        as enum ('baja', 'media', 'alta', 'critica');
create type tipo_registro        as enum ('diagnostico', 'vacuna', 'cirugia', 'control', 'otro');
create type estado_verificacion  as enum ('pendiente', 'aprobado', 'rechazado');
create type estado_derivacion    as enum ('pendiente', 'realizada', 'cancelada');
create type estado_contacto      as enum ('pendiente', 'respondido', 'cerrado');


-- =====================================================================
-- CUENTAS
-- =====================================================================

-- Perfiles (reemplaza Usuarios.ts).
-- Email y contraseña los maneja Supabase Auth (auth.users); aquí van solo
-- los datos propios de la app. El id ES el id de auth.users.
--
-- Cerrar la cuenta  -> se marca desactivado_en (la persona ya no entra).
-- Borrar los datos  -> se borra el usuario de auth.users: su perfil se borra
--                      en cascada, pero sus mascotas y su historial clínico
--                      se conservan sin dueño (dueno_id = null), es decir,
--                      anonimizados. Ver Ley 21.719 (derecho de supresión).
create table perfiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  nombre          text not null,
  rol             rol_usuario not null default 'dueno',
  telefono        bigint,                   -- 56912345678 (sin '+'; se agrega al mostrarlo)
  avatar_url      text,
  desactivado_en  timestamptz,              -- null = cuenta activa
  creado_en       timestamptz not null default now()
);


-- =====================================================================
-- CENTROS Y VETERINARIOS
-- =====================================================================

-- Catálogo de especialidades: evita que la misma se escriba distinto
-- (en los mocks hay "Medicina general", "medicina general" y "Medica General").
create table especialidades (
  id      bigint generated always as identity primary key,
  nombre  text not null unique
);

-- Centros (reemplaza Centros.ts y los usuarios con rol "centro").
-- Un centro nuevo queda "pendiente" hasta que el superadmin lo apruebe;
-- esto reemplaza a SolicitudPendiente.ts. Quién lo administra está en admins_centro.
create table centros (
  id                   bigint generated always as identity primary key,
  creado_por           uuid references perfiles (id) on delete set null,  -- quién solicitó el alta
  nombre               text not null,
  direccion            text not null,
  comuna               text not null,
  telefono             bigint,
  estado_verificacion  estado_verificacion not null default 'pendiente',
  revisado_por         uuid references perfiles (id) on delete set null,  -- superadmin que aprobó o rechazó
  revisado_en          timestamptz,
  motivo_rechazo       text,
  creado_en            timestamptz not null default now(),
  check (estado_verificacion <> 'rechazado' or motivo_rechazo is not null)
);

-- Horario de atención por día (reemplaza horarioApertura/horarioCierre/diasAtencion).
-- Una fila por cada día que atiende; si un día no tiene fila, ese día está cerrado.
-- El corte de colación es opcional: si va, van las dos horas.
create table horarios_centro (
  centro_id         bigint not null references centros (id) on delete cascade,
  dia_semana        smallint not null check (dia_semana between 1 and 7),  -- 1 = lunes ... 7 = domingo
  abre              time not null,
  cierra            time not null,
  inicio_colacion   time,   -- null = atiende de corrido
  fin_colacion      time,
  primary key (centro_id, dia_semana),
  check (cierra > abre),
  check ((inicio_colacion is null) = (fin_colacion is null)),
  check (inicio_colacion is null
         or (abre < inicio_colacion and inicio_colacion < fin_colacion and fin_colacion < cierra))
);

-- Admins de cada centro. Es un cargo, no un tipo de cuenta:
--   · un centro puede tener varios admins;
--   · una persona puede ser admin de un centro y no de otro;
--   · "promover" a un profesional = insertar su perfil aquí.
-- Puede ser un veterinario del centro o alguien administrativo.
create table admins_centro (
  centro_id     bigint not null references centros (id) on delete cascade,
  perfil_id     uuid not null references perfiles (id) on delete cascade,
  asignado_por  uuid references perfiles (id) on delete set null,
  asignado_en   timestamptz not null default now(),
  primary key (centro_id, perfil_id)
);

create table centro_especialidades (
  centro_id        bigint not null references centros (id) on delete cascade,
  especialidad_id  bigint not null references especialidades (id) on delete cascade,
  primary key (centro_id, especialidad_id)
);

-- Veterinarios (reemplaza Veterinarios.ts).
-- perfil_id queda null si se borra la cuenta: el veterinario sigue existiendo
-- para que las citas y fichas que firmó no se pierdan.
create table veterinarios (
  id                   bigint generated always as identity primary key,
  perfil_id            uuid unique references perfiles (id) on delete set null,
  especialidad_id      bigint references especialidades (id),
  numero_colegiado     text not null unique,
  estado_verificacion  estado_verificacion not null default 'pendiente',
  revisado_por         uuid references perfiles (id) on delete set null,
  revisado_en          timestamptz,
  motivo_rechazo       text,
  creado_en            timestamptz not null default now(),
  check (estado_verificacion <> 'rechazado' or motivo_rechazo is not null)
);

-- En qué centros atiende cada veterinario (reemplaza el arreglo centroIds).
create table veterinario_centros (
  veterinario_id  bigint not null references veterinarios (id) on delete cascade,
  centro_id       bigint not null references centros (id) on delete cascade,
  primary key (veterinario_id, centro_id)
);

-- Disponibilidad: cuándo atiende cada veterinario en cada centro.
-- Las horas libres para agendar = estos tramos menos las citas ya tomadas.
-- Un veterinario puede tener varios tramos el mismo día (p. ej. mañana en
-- un centro y tarde en otro).
create table horarios_veterinario (
  id                 bigint generated always as identity primary key,
  veterinario_id     bigint not null,
  centro_id          bigint not null,
  dia_semana         smallint not null check (dia_semana between 1 and 7),
  desde              time not null,
  hasta              time not null,
  duracion_cita_min  smallint not null default 30 check (duracion_cita_min between 5 and 240),
  check (hasta > desde),
  unique (veterinario_id, dia_semana, desde),
  -- solo puede tener horario en un centro donde efectivamente trabaja
  foreign key (veterinario_id, centro_id)
    references veterinario_centros (veterinario_id, centro_id) on delete cascade
);


-- =====================================================================
-- MASCOTAS, CITAS E HISTORIAL
-- =====================================================================

-- Mascotas (reemplaza Mascota.ts).
-- dueno_id queda null si el dueño borra su cuenta: la ficha se conserva anónima.
create table mascotas (
  id                    bigint generated always as identity primary key,
  dueno_id              uuid references perfiles (id) on delete set null,
  nombre                text not null,
  especie               especie_mascota not null,
  raza                  text,
  fecha_nacimiento      date,
  sexo                  sexo_mascota not null,
  esterilizado          boolean not null default false,
  peso_kg               numeric(5,2) check (peso_kg > 0),
  alergias              text,
  condiciones_cronicas  text,
  microchip             text unique,
  foto_url              text,
  creado_en             timestamptz not null default now()
);

-- Citas (reemplaza Cita.ts).
-- Sin duenoId: el dueño se obtiene desde la mascota, así no pueden contradecirse.
-- on delete restrict: no se puede borrar una mascota o centro que tenga citas.
create table citas (
  id                   bigint generated always as identity primary key,
  mascota_id           bigint not null references mascotas (id) on delete restrict,
  centro_id            bigint not null references centros (id) on delete restrict,
  veterinario_id       bigint references veterinarios (id),           -- null = aún sin asignar
  fecha_hora           timestamptz not null,                          -- se guarda en UTC; el front la muestra en hora de Chile
  motivo               text not null,
  estado               estado_cita not null default 'pendiente',
  urgencia_sugerida    urgencia_cita,                                 -- la que propone la IA
  urgencia             urgencia_cita,                                 -- la que confirma el veterinario
  sintomas_reportados  text[] not null default '{}',
  cancelada_por        uuid references perfiles (id) on delete set null,
  motivo_cancelacion   text,
  creada_en            timestamptz not null default now(),
  check (estado = 'cancelada' or (cancelada_por is null and motivo_cancelacion is null))
);

-- Un veterinario no puede tener dos citas activas a la misma hora.
-- (Las canceladas no cuentan: esa hora vuelve a quedar libre.)
create unique index citas_sin_choque_horario
  on citas (veterinario_id, fecha_hora)
  where veterinario_id is not null and estado <> 'cancelada';

-- Historial médico (une HistorialMedico.ts + Diagnostico.ts).
-- Un diagnóstico es un registro más (tipo = 'diagnostico'), así no se guarda
-- lo mismo en dos tablas.
create table registros_medicos (
  id              bigint generated always as identity primary key,
  mascota_id      bigint not null references mascotas (id) on delete restrict,
  cita_id         bigint references citas (id) on delete set null,   -- opcional: una vacuna antigua puede no tener cita
  veterinario_id  bigint references veterinarios (id),
  centro_id       bigint references centros (id),
  fecha           date not null,                                     -- día calendario, sin hora
  tipo            tipo_registro not null,
  descripcion     text not null,
  tratamiento     text,
  proxima_dosis   date,                                              -- para saber si las vacunas están al día
  creado_en       timestamptz not null default now(),
  check (proxima_dosis is null or proxima_dosis > fecha)
);

-- Derivaciones (reemplaza el campo derivadoA de Diagnostico).
-- Se deriva a un veterinario O a un centro, nunca a los dos.
create table derivaciones (
  id                bigint generated always as identity primary key,
  registro_id       bigint not null references registros_medicos (id) on delete cascade,
  a_veterinario_id  bigint references veterinarios (id),
  a_centro_id       bigint references centros (id),
  motivo            text not null,
  estado            estado_derivacion not null default 'pendiente',
  resultado         text,
  creada_en         timestamptz not null default now(),
  check (num_nonnulls(a_veterinario_id, a_centro_id) = 1)
);

-- Recetas (NuevaReceta / MedicamentoReceta de interfaces.ts).
create table recetas (
  id               bigint generated always as identity primary key,
  mascota_id       bigint not null references mascotas (id) on delete restrict,
  veterinario_id   bigint not null references veterinarios (id),
  cita_id          bigint references citas (id) on delete set null,
  indicaciones     text,
  proximo_control  date,
  creada_en        timestamptz not null default now()
);

create table receta_medicamentos (
  id          bigint generated always as identity primary key,
  receta_id   bigint not null references recetas (id) on delete cascade,
  nombre      text not null,
  dosis       text not null,
  frecuencia  text not null,
  duracion    text not null
);


-- =====================================================================
-- CONTACTO Y PREGUNTAS FRECUENTES
-- =====================================================================

-- Reemplaza respuestasPorCategoria de constants.ts.
create table categorias_contacto (
  slug       text primary key,          -- 'precios', 'login', ...
  pregunta   text not null,
  respuesta  text not null
);

-- Reemplaza Contacto.ts.
create table mensajes_contacto (
  id         bigint generated always as identity primary key,
  nombre     text not null,
  correo     text not null,
  telefono   bigint,
  asunto     text not null,
  mensaje    text not null,
  categoria  text references categorias_contacto (slug),
  estado     estado_contacto not null default 'pendiente',
  creado_en  timestamptz not null default now()
);

-- Las preguntas frecuentes (la "moda" de los mensajes por categoría) las
-- calcula la función preguntas_frecuentes(), definida en la migración 02.


-- =====================================================================
-- ÍNDICES (para las consultas que ya hace getInfo.tsx)
-- =====================================================================
create index on mascotas (dueno_id);                         -- getMascotasPorDueno
create index on citas (mascota_id);                          -- getCitasPorDueno (vía mascota)
create index on citas (veterinario_id, fecha_hora);          -- getAgendaVeterinario
create index on citas (centro_id, fecha_hora);
create index on registros_medicos (mascota_id, fecha desc);  -- getHistorialPorMascota
create index on horarios_veterinario (veterinario_id, dia_semana);
create index on admins_centro (perfil_id);                   -- ¿de qué centros es admin esta persona?
create index on mensajes_contacto (categoria);


-- =====================================================================
-- PERFIL AUTOMÁTICO AL REGISTRARSE
-- Supabase Auth crea la fila en auth.users; este trigger crea su perfil.
-- El front manda nombre, teléfono y tipo de cuenta en options.data del signUp:
--   supabase.auth.signUp({ email, password,
--     options: { data: { nombre: "Camila Rojas", telefono: "56912345678", rol: "dueno" } } })
-- Por seguridad, nadie puede registrarse como superadmin: si el rol pedido
-- no es 'dueno' o 'veterinario', queda como 'dueno'.
-- =====================================================================
create function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  datos jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.perfiles (id, nombre, rol, telefono)
  values (
    new.id,
    coalesce(nullif(trim(datos ->> 'nombre'), ''), nullif(split_part(new.email, '@', 1), ''), 'Usuario'),
    case when datos ->> 'rol' = 'veterinario' then 'veterinario'::public.rol_usuario
         else 'dueno'::public.rol_usuario end,
    case when datos ->> 'telefono' ~ '^[0-9]{8,15}$' then (datos ->> 'telefono')::bigint end
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();


-- =====================================================================
-- SEGURIDAD
-- RLS activado en todas las tablas: sin políticas, nadie puede leer ni
-- escribir desde la app. Las políticas se agregan en las migraciones siguientes.
-- (El proyecto ya tiene "RLS automático", pero lo dejamos explícito para
-- que funcione igual en cualquier proyecto, como el de la demo.)
-- =====================================================================
alter table perfiles               enable row level security;
alter table especialidades         enable row level security;
alter table centros                enable row level security;
alter table horarios_centro        enable row level security;
alter table admins_centro          enable row level security;
alter table centro_especialidades  enable row level security;
alter table veterinarios           enable row level security;
alter table veterinario_centros    enable row level security;
alter table horarios_veterinario   enable row level security;
alter table mascotas               enable row level security;
alter table citas                  enable row level security;
alter table registros_medicos      enable row level security;
alter table derivaciones           enable row level security;
alter table recetas                enable row level security;
alter table receta_medicamentos    enable row level security;
alter table categorias_contacto    enable row level security;
alter table mensajes_contacto      enable row level security;
