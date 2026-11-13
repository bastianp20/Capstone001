import { describe, test, expect } from 'vitest'
import { conComodines, montarHook, usarAcciones } from '../test/probarHook'
import { useUrgencias } from './useUrgencias'

describe('useUrgencias', () => {
  test('arranca sin errores', async () => {
    const { result } = await montarHook(() => conComodines(useUrgencias))
    expect(result.current).toBeDefined()
    // expect(estadoDe(result.current)).toMatchSnapshot()
  })

  test('sus acciones se pueden usar', async () => {
    const { result } = await montarHook(() => conComodines(useUrgencias))
    await usarAcciones(result.current)
    // expect(await usarAcciones(result.current)).toMatchSnapshot()
  })
})
