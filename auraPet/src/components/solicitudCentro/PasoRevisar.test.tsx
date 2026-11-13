import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'
import { PasoRevisar } from './PasoRevisar'

describe('PasoRevisar', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(PasoRevisar, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
