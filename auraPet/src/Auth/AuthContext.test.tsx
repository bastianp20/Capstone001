import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { AuthProvider } from './AuthContext'

describe('AuthProvider', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(AuthProvider, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
