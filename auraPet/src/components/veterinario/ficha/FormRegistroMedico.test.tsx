import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../test/renderizar'
import { usuarioDePrueba } from '../../../test/supabaseFalso'
import { FormRegistroMedico } from './FormRegistroMedico'

describe('FormRegistroMedico', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(FormRegistroMedico, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
