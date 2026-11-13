import { describe, test, expect, vi } from 'vitest'
import { montarHook } from '../test/probarHook'
import { useConsulta } from './useConsulta'

describe('useConsulta', () => {
  test('entrega los datos cuando la consulta responde', async () => {
    const { result } = await montarHook(() => useConsulta(async () => ['Luna', 'Toby'], []))
    expect(result.current).toEqual({ datos: ['Luna', 'Toby'], error: undefined, cargando: false })
  })

  test('muestra un mensaje si la consulta falla', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = await montarHook(() => useConsulta(async () => Promise.reject(new Error('sin conexión')), []))
    expect(result.current.error).toBe('No pudimos cargar la información.')
    expect(result.current.cargando).toBe(false)
  })
})
