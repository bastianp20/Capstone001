import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../test/renderizar'
import { usuarioDePrueba } from '../../../test/supabaseFalso'
import { PanelRegistrarAtencion } from './PanelRegistrarAtencion'

describe('PanelRegistrarAtencion', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(PanelRegistrarAtencion, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
