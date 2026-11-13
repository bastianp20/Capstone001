import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { ConfiguracionModal } from './ConfiguracionModal'

describe('ConfiguracionModal', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(ConfiguracionModal, { usuario: usuarioDePrueba('veterinario') })
    // expect(container).toMatchSnapshot()
  })
})
