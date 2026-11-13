import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../test/renderizar'
import { usuarioDePrueba } from '../../../test/supabaseFalso'
import { PanelAdoptada } from './PanelAdoptada'

describe('PanelAdoptada', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(PanelAdoptada, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
