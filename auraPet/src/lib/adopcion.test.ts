import { describe, test, expect } from 'vitest'
import { edadAdopcion, especieAdopcion, estadoBotonAdoptar, etapaAdopcion, fechaDesdeEdad, urlFotoAdopcion } from './adopcion'

describe('adopcion', () => {
  test('ave y conejo se muestran como "otro"', () => {
    expect(especieAdopcion('perro')).toBe('perro')
    expect(especieAdopcion('conejo')).toBe('otro')
  })

  test('muestra la edad en meses o años', () => {
    expect(edadAdopcion('2026-07-11')).toBe('4 meses')
    expect(edadAdopcion('2025-11-01')).toBe('1 año')
    expect(edadAdopcion('2019-04-12')).toBe('7 años')
  })

  test('cachorro, adulto o senior según la especie', () => {
    expect(etapaAdopcion('perro', '2026-07-11')).toBe('cachorro')
    expect(etapaAdopcion('perro', '2018-01-01')).toBe('senior')
    expect(etapaAdopcion('gato', '2018-01-01')).toBe('adulto')
    expect(etapaAdopcion('gato', null)).toBe('adulto')
  })

  test('sin edad no hay fecha de nacimiento', () => {
    expect(fechaDesdeEdad('', '')).toBeNull()
    expect(fechaDesdeEdad('2', '0', new Date(2026, 10, 11))).toBe('2024-11-11')
  })

  test('el botón "Quiero adoptarlo" según la ficha', () => {
    const ficha = { adoptado: false, esMia: false, yaPostule: false, estado: 'disponible' } as Parameters<typeof estadoBotonAdoptar>[0]
    expect(estadoBotonAdoptar(ficha)).toBe('disponible')
    expect(estadoBotonAdoptar({ ...ficha, esMia: true })).toBe('mia')
    expect(estadoBotonAdoptar({ ...ficha, adoptado: true, esMia: true })).toBe('adoptado')
  })

  test('una foto con URL completa se deja igual', () => {
    expect(urlFotoAdopcion('https://fotos.cl/luna.jpg')).toBe('https://fotos.cl/luna.jpg')
    expect(urlFotoAdopcion(null)).toBeNull()
  })
})
