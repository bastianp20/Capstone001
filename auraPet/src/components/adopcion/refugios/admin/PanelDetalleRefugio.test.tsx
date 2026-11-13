import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../../test/renderizar'
import { usuarioDePrueba } from '../../../../test/supabaseFalso'
import { PanelDetalleRefugio } from './PanelDetalleRefugio'

describe('PanelDetalleRefugio', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(PanelDetalleRefugio, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
