import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'
import { SeccionResumenCentro } from './SeccionResumenCentro'

describe('SeccionResumenCentro', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(SeccionResumenCentro, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
