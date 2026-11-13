# AuraPet

**Proyecto Capstone (APT122)**

> Nombre en evaluación: **PetAin** (posible cambio de nombre).

## 1. Nombre del proyecto

AuraPet: plataforma integral de salud y adopción de mascotas.

## 2. Descripción

### ¿Qué hace?

AuraPet es una plataforma web y móvil que reúne en un solo lugar la gestión veterinaria y la adopción responsable de mascotas. Centraliza la agenda de citas, el historial clínico, las recetas y las derivaciones entre profesionales, ofrece una página pública de urgencias con el estado en vivo de las UCI y un módulo de adopción con fichas médicas verificadas.

### ¿A quién va dirigido?

A los actores del ecosistema veterinario de la Región Metropolitana de Santiago, con potencial de escalar a otras regiones. La plataforma tiene cinco perfiles, cada uno con su propia vista y permisos:

- **Dueños de mascotas:** registran a sus mascotas, piden horas, revisan el historial médico y reciben avisos.
- **Veterinarios:** gestionan su agenda y horario, atienden, registran fichas, emiten recetas y derivan a otros profesionales.
- **Administradores de centro:** gestionan el equipo, horario, especialidades, urgencias y el estado de la UCI de su centro.
- **Refugios:** publican animales en adopción y evalúan a los postulantes.
- **Superadministrador:** aprueba cuentas, centros y refugios, y modera las publicaciones.

### ¿Qué problema resuelve?

Hoy el cuidado de una mascota está repartido en canales informales y desconectados: las citas se coordinan por teléfono o WhatsApp, el historial clínico queda disperso entre distintas clínicas y las publicaciones de adopción muchas veces no tienen datos validados, lo que genera desconfianza. AuraPet conecta a todos los actores en un solo sistema, con la información centralizada y protegida.

## 3. Tecnologías utilizadas

- **Lenguajes:** TypeScript, SQL (PostgreSQL) y CSS.
- **Frontend web:** React 19, Vite, React Router y CSS Modules.
- **App móvil:** Expo SDK 58, React Native 0.88 y Expo Router (Android).
- **Base de datos:** PostgreSQL 17 con seguridad por fila (RLS) y funciones SQL (RPC).
- **Cloud:** Supabase (Auth, base de datos, API, Storage, Realtime y Edge Functions en Deno) y Expo EAS para generar la app Android.
- **Otras herramientas:** jsPDF (fichas y recetas en PDF), lucide-react (íconos), ESLint, Git y GitHub.
- **Pruebas:** Vitest y Testing Library (unitarias), Apache JMeter (rendimiento) y OWASP ZAP (seguridad).

## 4. Instrucciones para ejecutar el proyecto localmente

El proyecto se ejecuta en localhost, sin contenedores: la web y la app corren con Node.js y la base de datos está en la nube de Supabase. Las credenciales no se guardan en el código; cada aplicación las lee de un archivo `.env.local` que no se sube al repositorio.

Requisitos: Node.js 22 (22.22 o superior para correr las pruebas), npm, Git y, para la app, Android Studio con un emulador o Expo Go en el teléfono.

### Paso 1. Obtener el código

```bash
git clone https://github.com/bastianp20/Capstone001.git
cd Capstone001
```

### Paso 2. Base de datos (solo la primera vez o si hay migraciones nuevas)

```bash
cd auraPet-Backend
npm install
npx supabase login
npx supabase link --project-ref <ID del proyecto>
npm run db:push      # aplica las migraciones
```

### Paso 3. Aplicación web

Crear `auraPet/.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Luego:

```bash
cd auraPet
npm install
npm run dev          # abre http://localhost:5173
npm test             # corre las pruebas unitarias
```

### Paso 4. Aplicación móvil

Crear `aurApp/.env.local` con `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `EXPO_PUBLIC_URL_WEB`. Luego, con el emulador abierto o con Expo Go:

```bash
cd aurApp
npm install
npx expo start --android
```

La guía completa está en `Fase 2/Evidencias Proyecto/Levantamiento_Localhost.docx`.

## 5. Integrantes del equipo

- **Alan Penroz:** Product Owner y desarrollo. Prioriza el Product Backlog, acepta o rechaza las historias en cada revisión de sprint y desarrolla interfaz y pantallas.
- **Bastián Palavecino:** Scrum Master y desarrollo. Vela por que se cumpla la Definition of Done y por el proceso Scrum, y desarrolla la web, la app móvil y la base de datos.

## 6. Metodología de trabajo

El equipo trabaja con Scrum, en 9 sprints de 2 semanas distribuidos en las tres fases de la asignatura.

- **Artefactos:** Product Vision, Product Backlog priorizado (17 historias de usuario), Sprint Backlog por sprint y Definition of Done.
- **Eventos:** planificación al inicio de cada sprint, revisión (sprint review) donde el Product Owner acepta las historias terminadas y retrospectiva con acuerdos de mejora.
- **Definition of Done:** una historia está terminada solo si cumple sus criterios de validación, compila, respeta las convenciones del código, deja los cambios de base de datos en migraciones, se prueba con cada rol, se integra en main sin conflictos y el Product Owner la acepta.
- **Avance:** sprints 1 a 7 cerrados. La priorización de urgencias con inteligencia artificial volvió al backlog como mejora futura.

## 7. Arquitectura de la solución

AuraPet usa una arquitectura cliente–BaaS (Backend as a Service). Hay dos clientes, la aplicación web y la aplicación móvil, que se conectan directamente al mismo proyecto de Supabase con su librería oficial (supabase-js). No existe un servidor propio intermedio.

En resumen, el flujo es: **usuarios → aplicación web o móvil → Supabase**, donde cada servicio cumple una función:

- Auth maneja el inicio de sesión y el rol de cada cuenta.
- PostgreSQL guarda toda la información. Las reglas de negocio y los permisos (RLS y funciones SQL) viven en la propia base de datos, así cada rol solo puede ver y modificar lo que le corresponde, venga de la web o de la app.
- Storage guarda las fotos de perfil, de mascotas en adopción y de refugios.
- Realtime avisa al instante cuando un centro cambia el estado de su UCI.
- Edge Functions ejecutan en el servidor las acciones sensibles, como crear cuentas de profesionales o invitar a un refugio aprobado.

## Pruebas

- **Unitarias:** 50 archivos y 253 casos con Vitest y Testing Library, todos aprobados.
- **Integración:** 13 flujos completos probados manualmente con cuentas de prueba, todos aprobados.
- **Rendimiento:** 4 escenarios de 10 a 100 usuarios con Apache JMeter, sin errores.
- **Seguridad:** análisis pasivo y activo con OWASP ZAP.

El detalle está en `Plan_de_pruebas.docx` e `Informe_de_Pruebas.docx`.

## Organización del repositorio

- **auraPet:** aplicación web.
- **aurApp:** aplicación móvil.
- **auraPet-Backend:** base de datos (56 migraciones), Edge Functions y datos de prueba.
- **Fase 1:** evidencias de la primera fase (autoevaluaciones, diarios de reflexión y presentación).
- **Fase 2:** documentos del proyecto (Product Vision, Product Backlog, Sprint Backlog, Definition of Done, arquitectura, modelo de datos, diagramas UML, requisitos no funcionales, plan e informe de pruebas, innovación, retrospectivas y levantamiento en localhost) y evidencias de la fase.
