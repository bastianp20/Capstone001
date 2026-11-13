import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../test/renderizar'
import { usuarioDePrueba } from '../../../test/supabaseFalso'
import { FormDatosClinicos } from './FormDatosClinicos'

describe('FormDatosClinicos', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(FormDatosClinicos, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
