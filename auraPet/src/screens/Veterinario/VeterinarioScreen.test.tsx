import { describe, test, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { VeterinarioScreen } from './VeterinarioScreen'
import { recorrerMenu, renderizar } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'

describe('VeterinarioScreen', () => {
  test('muestra el panel con el nombre de la persona', async () => {
    await renderizar(<VeterinarioScreen onAdministrarCentro={vi.fn()} />, { usuario: usuarioDePrueba('veterinario') })
    expect(screen.getAllByText(/Camila/).length).toBeGreaterThan(0)
    // expect(container).toMatchSnapshot()
  })

  test('cada opción del menú abre su sección', async () => {
    const { container } = await renderizar(<VeterinarioScreen onAdministrarCentro={vi.fn()} />, { usuario: usuarioDePrueba('veterinario') })
    // El menú del veterinario usa <div> en vez de botones
    const secciones = await recorrerMenu(() => [...container.querySelectorAll<HTMLElement>('.vet-nav-item')])
    expect(secciones.length).toBeGreaterThan(0)
    // expect(secciones).toMatchSnapshot()
    // expect(container).toMatchSnapshot()
  })
})
