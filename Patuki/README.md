# Patuki 🐾

Portal web para veterinarias y refugios, con seguimiento del historial médico de mascotas,
una app móvil para dueños (React Native + Expo) y un modelo de Machine Learning / Deep
Learning que sugiere matches de adopción según el estilo de vida de cada familia.

Proyecto de Capstone — actualmente en etapa de diseño/desarrollo local, en espera de
aprobación y de la recopilación de datos reales de refugios y veterinarias.

## Estado actual

- ✅ Landing page (mockup visual) construida en componentes React
- ✅ Estructura de proyecto desglosada en capas (componentes + estilos + datos)
- ✅ Datos falsos (mock data) tipados en TypeScript para trabajar sin backend
- ✅ Panel de datos (`/panel`) para visualizar mascotas, historial médico, veterinarias y refugios
- ⏳ Backend / base de datos real (se evaluó PostgreSQL, probablemente vía Supabase)
- ⏳ App móvil (React Native + Expo)
- ⏳ Modelo de matching de adopción (ML/DL)
- ⏳ Datos reales de refugios y veterinarias

## Stack técnico

- **Frontend web:** React 19 + TypeScript + Vite
- **Routing:** react-router-dom
- **Estilos:** CSS por componente (sin librería de UI todavía)
- **Datos (por ahora):** mocks tipados en `src/data/`
- **Base de datos (planeada):** PostgreSQL (evaluado frente a Firebase — se optó por SQL
  por la naturaleza relacional del historial médico y por ser más directo para preparar
  datasets de cara al modelo de ML)
- **App móvil (planeada):** React Native + Expo

## Estructura del proyecto

```
src/
  screen/
    App.tsx           # Define las rutas (react-router-dom)
    LandingPage.tsx    # Landing / mockup visual del portal
    PanelPage.tsx       # Panel que visualiza los datos mockeados
  components/
    Navbar/  Hero/  Partners/  Features/  HowItWorks/
    MatchSection/  NetworkSection/  Testimonial/  CTASection/  Footer/
      # Cada componente tiene su propio .tsx (markup) y .css (estilos)
  styles/
    global.css          # Tokens de diseño (colores, radios), reset y clases compartidas
  data/
    types.ts             # Interfaces: Usuario, Mascota, RegistroMedico, Veterinaria,
                          # Refugio, MascotaEnAdopcion, etc.
    usuarios.ts           # Dueños, veterinarios y encargados de refugio (mock)
    veterinarias.ts        # Clínicas veterinarias (mock)
    mascotas.ts             # Mascotas + historial médico embebido (mock)
    refugios.ts               # Refugios + mascotas en adopción (mock)
    index.ts                   # Barrel export de todo lo anterior
```

> Nota sobre los estilos: no se usa CSS Modules, así que las clases siguen siendo
> globales aunque estén repartidas en distintos archivos por componente. Es organización
> por carpetas, no aislamiento real. Si el proyecto crece, evaluar CSS Modules,
> Tailwind o styled-components.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

- Landing / mockup visual: `http://localhost:5173/`
- Panel con datos mockeados: `http://localhost:5173/panel`

Otros comandos:

```bash
npm run build      # build de producción
npm run lint        # ESLint
npm run preview       # sirve el build de producción localmente
```

## Datos mockeados

Mientras se recopilan los datos reales de refugios y veterinarias, y mientras se define
el backend, el proyecto usa datos falsos tipados en `src/data/`. Todo está relacionado
por IDs (`duenoId`, `veterinariaId`, `refugioId`) simulando cómo se verían las relaciones
en la base de datos real, para que el paso a datos reales sea lo más directo posible.

Para reemplazar por datos reales más adelante: cambiar el contenido de esos archivos
(o, cuando exista el backend, reemplazar las importaciones por llamadas a la API) sin
tener que tocar los componentes que consumen los datos, siempre que se respeten los
tipos definidos en `types.ts`.

## Roadmap

1. **Modelo de datos (ERD):** cerrar entidades y relaciones definitivas antes de tocar backend.
2. **Backend + base de datos:** API (Node/TypeScript) + PostgreSQL, con autenticación por roles
   (dueño, veterinario, refugio, admin).
3. **Portal web:** conectar el panel y los formularios a la API real, reemplazando los mocks.
4. **App móvil (Expo):** vista para dueños — historial de sus mascotas, notificaciones de
   vacunas/citas.
5. **Modelo de matching (ML/DL):** empezar con un enfoque simple (similitud de perfiles /
   modelo clásico) antes de escalar a deep learning, usando como insumo los datos de
   refugios y el perfil de compatibilidad de cada mascota.
6. **Despliegue:** hosting del portal, backend y base de datos.

## Licencia

Proyecto académico (Capstone). Uso educativo.
