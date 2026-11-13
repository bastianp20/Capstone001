import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { ModalAgenda } from './AgendaModal'

describe('ModalAgenda', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(ModalAgenda, { usuario: usuarioDePrueba('veterinario') })
    // expect(container).toMatchSnapshot()
  })
})
