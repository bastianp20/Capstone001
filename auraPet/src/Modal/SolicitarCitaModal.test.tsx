import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { ModalSolicitarCita } from './SolicitarCitaModal'

describe('ModalSolicitarCita', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(ModalSolicitarCita, { usuario: usuarioDePrueba('veterinario') })
    // expect(container).toMatchSnapshot()
  })
})
