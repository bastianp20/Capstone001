import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'
import { FormularioCentro } from './FormularioCentro'

describe('FormularioCentro', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(FormularioCentro, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
