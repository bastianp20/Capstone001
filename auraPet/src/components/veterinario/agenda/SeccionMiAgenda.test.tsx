import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../../test/renderizar'
import { usuarioDePrueba } from '../../../test/supabaseFalso'
import { SeccionMiAgenda } from './SeccionMiAgenda'

describe('SeccionMiAgenda', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(SeccionMiAgenda, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
