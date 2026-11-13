import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CeldaAgenda } from '../../../interfaces'
import { CeldaAgendaBoton } from './CeldaAgendaBoton'

const celdaLibre: CeldaAgenda = {
  fecha: '2026-11-12',
  hora: '10:00',
  inicio: '2026-11-12T13:00:00Z',
  fin: '2026-11-12T13:30:00Z',
  tipo: 'libre',
  cita: null,
  bloqueo: null,
  fueraDeHorario: false,
}

describe('CeldaAgendaBoton', () => {
  test('una hora libre se puede elegir para bloquearla', async () => {
    const onElegir = vi.fn()
    render(<CeldaAgendaBoton celda={celdaLibre} onElegir={onElegir} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onElegir).toHaveBeenCalledWith(celdaLibre)
    // expect(container).toMatchSnapshot()
  })

  test('sin celda no muestra nada', () => {
    const { container } = render(<CeldaAgendaBoton celda={undefined} onElegir={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })
})
