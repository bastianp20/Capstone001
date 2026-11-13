import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../../test/renderizar'
import { usuarioDePrueba } from '../../../../test/supabaseFalso'
import { FilaRefugioAdmin } from './FilaRefugioAdmin'

describe('FilaRefugioAdmin', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(FilaRefugioAdmin, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
