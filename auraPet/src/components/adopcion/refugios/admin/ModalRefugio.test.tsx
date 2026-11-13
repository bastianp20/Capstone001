import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../../test/renderizar'
import { usuarioDePrueba } from '../../../../test/supabaseFalso'
import { ModalRefugio } from './ModalRefugio'

describe('ModalRefugio', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(ModalRefugio, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
