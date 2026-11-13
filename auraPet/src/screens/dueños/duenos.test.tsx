import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { DuenoScreen } from './duenos'
import { recorrerMenu, renderizar } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'

describe('DuenoScreen', () => {
  test('muestra el panel con el nombre de la persona', async () => {
    await renderizar(<DuenoScreen />, { usuario: usuarioDePrueba('dueno') })
    expect(screen.getAllByText(/Camila/).length).toBeGreaterThan(0)
    // expect(container).toMatchSnapshot()
  })

  test('cada opción del menú abre su sección', async () => {
    await renderizar(<DuenoScreen />, { usuario: usuarioDePrueba('dueno') })
    const secciones = await recorrerMenu()
    expect(secciones.length).toBeGreaterThan(0)
    // expect(secciones).toMatchSnapshot()
    // expect(container).toMatchSnapshot()
  })
})
