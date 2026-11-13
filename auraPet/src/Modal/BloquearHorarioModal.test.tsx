import { describe, test, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderizar } from '../test/renderizar'
import { usuarioDePrueba } from '../test/supabaseFalso'
import { BloquearHorarioModal } from './BloquearHorarioModal'

describe('BloquearHorarioModal', () => {
  test('se muestra para bloquear un horario', async () => {
    await renderizar(<BloquearHorarioModal citas={[]} onCerrar={vi.fn()} onListo={vi.fn()} />, {
      usuario: usuarioDePrueba('veterinario'),
    })
    expect(screen.getAllByText(/bloquear/i).length).toBeGreaterThan(0)
    // expect(container).toMatchSnapshot()
  })
})
