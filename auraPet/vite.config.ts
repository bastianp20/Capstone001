import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vitest/config'

// Las pruebas corren siempre en hora de Chile, sin importar el computador.
process.env.TZ = 'America/Santiago'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // Pruebas unitarias con Vitest (https://vitest.dev/config/)
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    clearMocks: true,
    // Las pantallas grandes esperan a que todo cargue: en computadores lentos toma más de 5 s
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/lib/database.types.ts', 'src/lib/supabase.ts'],
    },
  },
})
