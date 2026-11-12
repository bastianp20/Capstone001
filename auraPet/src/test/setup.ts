// Se carga antes de cada archivo de pruebas (ver `test.setupFiles` en vite.config.ts).
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta lo que renderizó cada prueba para que no se mezclen entre sí.
afterEach(() => {
  cleanup()
})
