import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { ModalCrearProfesional } from './CrearProfesionalModal'

describe('ModalCrearProfesional', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(ModalCrearProfesional, { usuario: usuarioDePrueba('veterinario') })
    // expect(container).toMatchSnapshot()
  })
})
