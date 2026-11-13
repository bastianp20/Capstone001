import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'
import { LoginScreen } from './LoginScreen'

describe('LoginScreen', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(LoginScreen, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
