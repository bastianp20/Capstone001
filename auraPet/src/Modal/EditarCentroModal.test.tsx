import { describe, test, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type { CentroListado } from '../interfaces'
import { renderizar } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { ModalEditarCentro } from './EditarCentroModal'

const centro: CentroListado = {
  id: 1,
  nombre: 'Clínica Patitas',
  direccion: 'Av. Grecia 123',
  comuna: 'Ñuñoa',
  telefono: 56912345678,
  estado: 'aprobado',
  esPrueba: true,
  veterinarios: 2,
  creadoEn: '2026-10-01T12:00:00Z',
  eliminadoEn: null,
  motivoEliminacion: null,
}

describe('ModalEditarCentro', () => {
  test('muestra los datos del centro para editarlos', async () => {
    await renderizar(<ModalEditarCentro centro={centro} onClose={vi.fn()} onGuardado={vi.fn()} />, {
      usuario: usuarioDePrueba('superadmin'),
    })
    expect(screen.getByDisplayValue('Clínica Patitas')).toBeInTheDocument()
    // expect(container).toMatchSnapshot()
  })
})
