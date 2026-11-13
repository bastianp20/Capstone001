import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { FichaPacienteModal } from './FichaPacienteModal'

describe('FichaPacienteModal', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(FichaPacienteModal, { usuario: usuarioDePrueba('veterinario') })
    // expect(container).toMatchSnapshot()
  })
})
