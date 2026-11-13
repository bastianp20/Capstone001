import { describe, test, expect } from 'vitest'
import { claveCelda, fechasDeSemana, horaDesdeMinutos, lunesDe, minutosDe, sumarDias } from './agendaSemana'

describe('agendaSemana', () => {
  test('convierte horas a minutos y de vuelta', () => {
    expect(minutosDe('09:30')).toBe(570)
    expect(horaDesdeMinutos(570)).toBe('09:30')
  })

  test('el lunes de la semana de un domingo es el lunes anterior', () => {
    expect(lunesDe('2026-11-15')).toBe('2026-11-09')
    expect(lunesDe('2026-11-11')).toBe('2026-11-09')
  })

  test('la semana tiene 7 días seguidos', () => {
    expect(fechasDeSemana('2026-11-09')).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'])
  })

  test('sumar días cruza el cambio de año', () => {
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01')
  })

  test('la clave de una celda junta fecha y hora', () => {
    expect(claveCelda('2026-11-11', '10:00')).toBe('2026-11-11|10:00')
  })
})
