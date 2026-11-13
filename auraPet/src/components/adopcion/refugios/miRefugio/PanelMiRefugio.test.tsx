import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../../test/renderizar'
import { usuarioDePrueba } from '../../../../test/supabaseFalso'
import { PanelMiRefugio } from './PanelMiRefugio'

describe('PanelMiRefugio', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(PanelMiRefugio, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
