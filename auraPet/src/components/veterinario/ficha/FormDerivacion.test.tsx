import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../test/renderizar'
import { usuarioDePrueba } from '../../../test/supabaseFalso'
import { FormDerivacion } from './FormDerivacion'

describe('FormDerivacion', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(FormDerivacion, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
