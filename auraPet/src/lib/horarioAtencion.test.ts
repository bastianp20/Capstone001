import { describe, test, expect } from 'vitest'
import { claveLugar, validarTramos } from './horarioAtencion'

const tramo = (diaSemana: number, desde: string, hasta: string) => ({ centroId: null, diaSemana, desde, hasta })

describe('horarioAtencion', () => {
  test('la atención independiente tiene su propia clave', () => {
    expect(claveLugar(5)).toBe('5')
    expect(claveLugar(null)).not.toBe('5')
  })

  test('falla si no hay ningún día', () => {
    expect(validarTramos([])).not.toBeNull()
  })

  test('falla si "hasta" es antes de "desde"', () => {
    expect(validarTramos([tramo(1, '18:00', '09:00')])).not.toBeNull()
  })

  test('falla si dos tramos del mismo día se cruzan', () => {
    expect(validarTramos([tramo(1, '09:00', '14:00'), tramo(1, '13:00', '18:00')])).not.toBeNull()
  })

  test('acepta tramos seguidos sin cruce', () => {
    expect(validarTramos([tramo(1, '09:00', '13:00'), tramo(1, '13:00', '18:00')])).toBeNull()
  })
})
