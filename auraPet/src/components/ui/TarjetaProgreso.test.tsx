import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Clock } from 'lucide-react'
import { TarjetaProgreso } from './TarjetaProgreso'

const pendientes = [{ id: 'horario', texto: 'Configura tu horario', Icono: Clock }]

describe('TarjetaProgreso', () => {
  test('muestra el título y el porcentaje', () => {
    render(
      <TarjetaProgreso titulo="Completa tu perfil" porcentaje={60} textoPorcentaje="Tu perfil está al 60%"
        ayuda="Te falta poco" pendientes={pendientes} onElegir={vi.fn()} />,
    )
    expect(screen.getByText('Completa tu perfil')).toBeInTheDocument()
    expect(screen.getByText('Tu perfil está al 60%')).toBeInTheDocument()
  })

  test('al hacer clic en un paso avisa cuál fue', async () => {
    const onElegir = vi.fn()
    render(
      <TarjetaProgreso titulo="Completa tu perfil" porcentaje={60} textoPorcentaje="Tu perfil está al 60%"
        ayuda="Te falta poco" pendientes={pendientes} onElegir={onElegir} />,
    )
    await userEvent.click(screen.getByText('Configura tu horario'))
    expect(onElegir).toHaveBeenCalledWith('horario')
  })

  test('no muestra nada si no quedan pasos', () => {
    const { container } = render(
      <TarjetaProgreso titulo="Completa tu perfil" porcentaje={100} textoPorcentaje="Tu perfil está al 100%"
        ayuda="Listo" pendientes={[]} onElegir={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })
})
