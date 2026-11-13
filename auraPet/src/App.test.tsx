import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { App } from './App'
import { renderizar } from './test/renderizar'
import { usuarioDePrueba } from './test/supabaseFalso'

describe('App', () => {
  test('muestra la página de inicio sin sesión', async () => {
    await renderizar(<App />, { ruta: '/' })
    expect(screen.getAllByText(/AuraPet/i)).not.toHaveLength(0)
    // expect(container).toMatchSnapshot()
  })

  test.each(['/como-funciona', '/veterinarias', '/duenos', '/nosotros', '/contacto', '/urgencias', '/adopta', '/adopta/refugios', '/adopta/refugios/sumate', '/adopta/refugios/postular', '/adopta/1', '/solicitar-centro', '/nueva-contrasena'])(
    'muestra la página pública %s',
    async (ruta) => {
      await renderizar(<App />, { ruta })
      expect(document.body.textContent).not.toBe('')
      // expect(container).toMatchSnapshot()
    },
  )

  test.each(['dueno', 'veterinario', 'administrativo', 'superadmin'] as const)('con sesión de %s entra a su panel', async (rol) => {
    await renderizar(<App />, { ruta: '/panel', usuario: usuarioDePrueba(rol) })
    expect(screen.getAllByText(/Camila/)).not.toHaveLength(0)
    // expect(container).toMatchSnapshot()
  })

  test('con sesión se puede abrir "Dar en adopción"', async () => {
    await renderizar(<App />, { ruta: '/adopta/publicar', usuario: usuarioDePrueba('dueno') })
    expect(document.body.textContent).not.toBe('')
  })
})
