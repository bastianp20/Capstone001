import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RechazarModal } from './ReachazarModal'

describe('RechazarModal', () => {
  test('muestra el nombre de la solicitud', () => {
    render(<RechazarModal nombreSolicitud="Clínica Patitas" onCancelar={vi.fn()} onConfirmar={vi.fn()} />)
    expect(screen.getByText('Clínica Patitas')).toBeInTheDocument()
  })

  test('no deja confirmar sin escribir un motivo', () => {
    render(<RechazarModal nombreSolicitud="Clínica Patitas" onCancelar={vi.fn()} onConfirmar={vi.fn()} />)
    expect(screen.getByText('Confirmar rechazo')).toBeDisabled()
  })

  test('confirma con el motivo escrito', async () => {
    const onConfirmar = vi.fn()
    render(<RechazarModal nombreSolicitud="Clínica Patitas" onCancelar={vi.fn()} onConfirmar={onConfirmar} />)
    await userEvent.type(screen.getByRole('textbox'), 'Faltan documentos')
    await userEvent.click(screen.getByText('Confirmar rechazo'))
    expect(onConfirmar).toHaveBeenCalledWith('Faltan documentos')
  })
})
