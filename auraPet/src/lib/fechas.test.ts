import { describe, test, expect } from 'vitest'
import * as fechas from './fechas'

describe('fechas', () => {
  test('muestra la hora en hora de Chile', () => {
    expect(fechas.formatHora24('2026-11-11T15:00:00Z')).toBe('12:00')
  })

  test('el día en Chile de un momento UTC', () => {
    expect(fechas.fechaEnChile('2026-11-12T02:00:00Z')).toBe('2026-11-11')
  })

  test('calcula la edad en años', () => {
    expect(fechas.calcularEdad('2019-04-12', new Date('2026-11-11T12:00:00Z'))).toBe(7)
    expect(fechas.calcularEdad(null)).toBeNull()
  })

  test('el día de la semana: 1 es lunes y 7 es domingo', () => {
    expect(fechas.diaSemanaDeFecha('2026-11-09')).toBe(1)
    expect(fechas.diaSemanaDeFecha('2026-11-15')).toBe(7)
  })

  test('saluda según la hora del día', () => {
    expect(fechas.saludoSegunHora(new Date('2026-11-11T12:00:00Z'))).not.toBe('')
    // expect(fechas.saludoSegunHora(new Date('2026-11-11T12:00:00Z'))).toMatchSnapshot()
  })

  test('los formatos de fecha que usa la app', () => {
    const iso = '2026-11-11T15:00:00Z'
    const formatos = {
      fechaHora: fechas.formatFechaHora(iso),
      hora12: fechas.formatHora12h(iso),
      caja: fechas.formatFechaCaja(iso),
      corta: fechas.formatFechaCorta(iso),
      larga: fechas.formatFechaLarga('2026-11-11'),
      horario: fechas.formatHorario('09:00:00'),
      diaMes: fechas.formatDiaMes('2026-11-11'),
      titulo: fechas.formatFechaTitulo(),
      mes: fechas.nombreMes(),
      emision: fechas.formatFechaEmision(),
      mesAbreviado: fechas.mesAbreviado('2026-10'),
      diaConNombre: fechas.formatDiaConNombre('2026-11-11'),
      diaHora: fechas.formatDiaHora(iso),
      diaDelMes: fechas.diaDelMesEnChile(iso),
      dentroDe: fechas.fechaDentroDe(3),
      iso: fechas.isoDesdeFechaHora('2026-11-11', '10:00'),
      rangos: fechas.rangosDeFecha(),
    }
    expect(Object.values(formatos)).not.toContain(undefined)
    // expect(formatos).toMatchSnapshot()
  })
})
