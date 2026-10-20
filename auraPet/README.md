# AuraPet

Portal veterinario (Chile): los dueños piden hora y siguen la salud de sus mascotas; los veterinarios
gestionan su agenda, fichas, recetas y derivaciones; los centros administran su equipo y su plan; y el
superadmin aprueba cuentas, centros y planes.

**Stack:** React 19 + Vite + TypeScript · React Router · Supabase (Postgres con RLS, Auth y Edge Functions) · CSS Modules · lucide-react.

## Puesta en marcha

```bash
npm install
# .env.local (no se sube al repo)
#   VITE_SUPABASE_URL=https://<proyecto>.supabase.co
#   VITE_SUPABASE_PUBLISHABLE_KEY=<clave publicable>
npm run dev
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (http://localhost:5173) |
| `npm run build` | Revisa tipos (`tsc -b`) y arma `dist/` |
| `npm run lint` | ESLint |

## Backend (carpeta `auraPet-Backend`)

```bash
npm run db:push                                 # aplica las migraciones de supabase/migrations
npm run gen:types                               # regenera src/lib/database.types.ts
npm run functions:deploy -- crear-profesional   # publica una Edge Function
```

Las reglas importantes viven en la base, no en el front: permisos (RLS), límites de los planes,
quién puede ver una ficha, etc. El front llama funciones (`supabase.rpc`) que vuelven a validar todo.

## Estructura (`src/`)

| Carpeta / archivo | Contenido |
| --- | --- |
| `constants.ts` | Textos, colores, opciones y límites (única fuente de verdad) |
| `interfaces.ts` | Tipos y props de todos los componentes |
| `Api/getInfo.tsx`, `Api/postInfo.ts` | Lecturas y escrituras a Supabase |
| `lib/` | Reglas puras (sin React), fáciles de probar |
| `hooks/` | `useConsulta`, `useAccion`, `useFiltro`, `useTeclaEscape`… |
| `components/ui/` | Piezas reutilizables (Boton, Etiqueta, TablaPanel, KpiCard…) |
| `screens/` | Pantallas por rol (Home, Login, dueños, Veterinario, CentroAdmin, SuperAdmin) |
| `Modal/` | Modales |
| `css/` | Un CSS Module por componente/pantalla; colores en `theme.css` |

Convenciones: principios SOLID y clean code, sin estilos en línea, constantes en `constants.ts`,
interfaces en `interfaces.ts`.

## Rutas

- Públicas: `/`, `/como-funciona`, `/veterinarias`, `/duenos`, `/nosotros`, `/contacto`, `/solicitar-centro`
  (con sesión iniciada redirigen a `/panel`).
- Protegida: `/panel` (muestra el panel según el rol).
- `/nueva-contrasena`: destino del correo "restablecer contraseña".

## Despliegue

Pendiente de elegir el hosting. Al desplegar:
1. Comando `npm run build`, salida `dist`, variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
2. Configurar el hosting para que todas las rutas sirvan `index.html` (es una SPA), así recargar `/panel` funciona.
3. En Supabase → Authentication → URL Configuration: poner la URL final como *Site URL* y agregar
   `https://<tu-dominio>/nueva-contrasena` (y `http://localhost:5173/nueva-contrasena`) en *Redirect URLs*.

## Correos

Supabase envía los correos de Auth (recuperar contraseña) con su SMTP de prueba, que permite muy pocos
envíos por hora. Para producción hay que configurar un SMTP propio (p. ej. Resend) en
Authentication → Emails → SMTP Settings.
