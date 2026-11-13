import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CasoModeracion } from '../../../interfaces'
import { FilaCasoModeracion } from './FilaCasoModeracion'

const caso: CasoModeracion = {
  adopcionId: 5,
  nombre: 'Luna',
  especie: 'perro',
  raza: null,
  edad: '2 años',
  comuna: 'Ñuñoa',
  fotoUrl: null,
  estadoPublicacion: 'publicada',
  publicadaEn: '2026-11-01T12:00:00Z',
  publicador: 'Rescatista particular',
  esPrueba: false,
  reportes: 3,
  motivoPrincipal: 'estafa',
  urgente: true,
  ultimoReporte: '2026-11-11T13:00:00Z',
  publicaciones: 1,
  reportesPrevios: 0,
  cuentaCreadaEn: '2026-10-01T12:00:00Z',
  decision: null,
  detalle: [],
}

describe('FilaCasoModeracion', () => {
  test('muestra el animal reportado', () => {
    render(<FilaCasoModeracion caso={caso} activo={false} onElegir={vi.fn()} />)
    expect(screen.getByText('Luna')).toBeInTheDocument()
    // expect(container).toMatchSnapshot()
  })

  test('al hacer clic elige el caso', async () => {
    const onElegir = vi.fn()
    render(<FilaCasoModeracion caso={caso} activo={false} onElegir={onElegir} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onElegir).toHaveBeenCalledWith(caso)
  })
})
