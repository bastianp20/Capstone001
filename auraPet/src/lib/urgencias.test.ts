import { describe, test, expect } from 'vitest'
import type { HorarioCentro } from '../interfaces'
import { abiertoAhora, enlaceLlamar } from './urgencias'

// Horario de un miércoles: de 09:00 a 18:00, con colación de 13:00 a 14:00
const horario: HorarioCentro = {
  diaSemana: 3,
  abre: '09:00',
  cierra: '18:00',
  inicioColacion: '13:00',
  finColacion: '14:00',
}

describe('urgencias', () => {
  test('el centro está abierto un miércoles a las 12:00', () => {
    const ahora = new Date('2026-11-11T15:00:00Z') // 12:00 en Chile
    expect(abiertoAhora([horario], ahora)).toBe(true)
  })

  test('el centro está cerrado durante la colación', () => {
    const ahora = new Date('2026-11-11T16:30:00Z') // 13:30 en Chile
    expect(abiertoAhora([horario], ahora)).toBe(false)
  })

  test('el enlace para llamar empieza con tel:+', () => {
    expect(enlaceLlamar(56912345678)).toBe('tel:+56912345678')
  })
})
