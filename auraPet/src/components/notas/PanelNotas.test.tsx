import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'
import { PanelNotas } from './PanelNotas'

describe('PanelNotas', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(PanelNotas, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
