import { describe, test, expect } from 'vitest'
import { generarCodigo, getIniciales } from './utils'

describe('utils', () => {
  test('saca las iniciales del primer nombre y el último apellido', () => {
    expect(getIniciales('María José Pérez')).toBe('MP')
    expect(getIniciales('Camila')).toBe('C')
    expect(getIniciales('   ')).toBe('')
  })

  test('el código tiene el largo pedido y solo usa los caracteres permitidos', () => {
    const codigo = generarCodigo(6, 'ABC23')
    expect(codigo).toHaveLength(6)
    expect(codigo).toMatch(/^[ABC23]+$/)
  })
})
