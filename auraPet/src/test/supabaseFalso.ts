// Supabase falso para las pruebas: ninguna prueba toca la base real.
//
// Por defecto toda consulta responde { data: [], error: null }.
// Para que una consulta devuelva algo:
//   responderRpc('listar_urgencias', { centros: [...] })
//   responderTabla('mascotas', [{ id: 1, nombre: 'Luna' }])
//   iniciarSesion(usuarioDePrueba('veterinario'))   // simula una sesión iniciada
// Se limpia solo después de cada prueba (ver setup.ts).
import { vi } from 'vitest'
import type { UsuarioActual } from '../interfaces'

const rpcs = new Map<string, unknown>()
const tablas = new Map<string, unknown>()
let sesion: UsuarioActual | null = null

export const responderRpc = (nombre: string, data: unknown) => rpcs.set(nombre, data)
export const responderTabla = (tabla: string, data: unknown) => tablas.set(tabla, data)
export const iniciarSesion = (usuario: UsuarioActual) => {
  sesion = usuario
}

export const limpiarSupabaseFalso = () => {
  rpcs.clear()
  tablas.clear()
  sesion = null
}

// Usuario de ejemplo para cada rol
export const usuarioDePrueba = (rol: UsuarioActual['rol']): UsuarioActual => ({
  id: `usuario-${rol}`,
  email: `${rol}@aurapet.cl`,
  nombre: 'Camila Rojas',
  rol,
  telefono: 56912345678,
  avatarUrl: null,
  avatarRuta: null,
  esPrueba: true,
})

// Consulta encadenable: .select().eq().order()... y al final se espera con await.
const consulta = (data: unknown): unknown =>
  new Proxy(() => {}, {
    get: (_, prop) => {
      if (prop === 'then') {
        return (resolver: (r: unknown) => unknown) => resolver({ data, error: null, count: Array.isArray(data) ? data.length : 0 })
      }
      if (prop === 'single' || prop === 'maybeSingle') {
        return () => consulta(Array.isArray(data) ? (data[0] ?? null) : data)
      }
      if (prop === Symbol.toPrimitive || prop === 'toString') return () => ''
      return consulta(data)
    },
    apply: () => consulta(data),
  })

const perfilDeSesion = () =>
  sesion && {
    id: sesion.id,
    nombre: sesion.nombre,
    rol: sesion.rol,
    telefono: sesion.telefono,
    avatar_url: null,
    desactivado_en: null,
    es_prueba: sesion.esPrueba,
  }

export const supabaseFalso = {
  rpc: vi.fn((nombre: string) => consulta(rpcs.get(nombre) ?? [])),
  from: vi.fn((tabla: string) => consulta(tabla === 'perfiles' ? perfilDeSesion() : (tablas.get(tabla) ?? []))),
  channel: vi.fn(() => consulta(null)),
  removeChannel: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      getPublicUrl: (ruta: string) => ({ data: { publicUrl: `https://fotos.aurapet.cl/${ruta}` } }),
      upload: vi.fn(async () => ({ data: {}, error: null })),
      remove: vi.fn(async () => ({ data: {}, error: null })),
    })),
  },
  functions: { invoke: vi.fn(async () => ({ data: {}, error: null })) },
  auth: {
    getSession: vi.fn(async () => ({
      data: { session: sesion ? { user: { id: sesion.id, email: sesion.email } } : null },
    })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
    signUp: vi.fn(async () => ({ data: { session: null }, error: null })),
    signOut: vi.fn(async () => ({ error: null })),
    resetPasswordForEmail: vi.fn(async () => ({ data: {}, error: null })),
    updateUser: vi.fn(async () => ({ data: {}, error: null })),
  },
}
