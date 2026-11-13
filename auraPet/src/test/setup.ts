// Se carga antes de cada archivo de pruebas (ver `test.setupFiles` en vite.config.ts).
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { limpiarSupabaseFalso } from './supabaseFalso'

// Ninguna prueba usa la base real: todas reciben el Supabase falso.
vi.mock('../lib/supabase', async () => ({ supabase: (await import('./supabaseFalso')).supabaseFalso }))

// Fecha fija (miércoles 11-11-2026, 12:00 en Chile) para que las pruebas y los
// snapshots den lo mismo cualquier día. Solo se congela la fecha, no los temporizadores.
vi.useFakeTimers({ toFake: ['Date'] })
vi.setSystemTime(new Date('2026-11-11T15:00:00Z'))

// "Al azar" siempre igual (p. ej. el código para desbloquear cuentas reales), así los snapshots no cambian.
vi.spyOn(Math, 'random').mockReturnValue(0.42)

// Cosas del navegador que jsdom no trae
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})) as unknown as typeof window.matchMedia
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver
URL.createObjectURL ??= vi.fn(() => 'blob:prueba')
URL.revokeObjectURL ??= vi.fn()

// Desmonta lo que renderizó cada prueba y limpia las respuestas del Supabase falso.
afterEach(() => {
  cleanup()
  limpiarSupabaseFalso()
})
