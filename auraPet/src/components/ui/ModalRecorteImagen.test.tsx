import { describe, test } from 'vitest'
import { renderizarConRelleno } from '../../test/renderizar'
import { usuarioDePrueba } from '../../test/supabaseFalso'
import { ModalRecorteImagen } from './ModalRecorteImagen'

describe('ModalRecorteImagen', () => {
  test('se muestra sin errores', async () => {
    await renderizarConRelleno(ModalRecorteImagen, { usuario: usuarioDePrueba('dueno') })
    // expect(container).toMatchSnapshot()
  })
})
