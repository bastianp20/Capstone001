import { describe, test, expect } from 'vitest'
import { conComodines, montarHook, usarAcciones } from '../test/probarHook'
import { useElegirFamilia } from './useElegirFamilia'

describe('useElegirFamilia', () => {
  test('arranca sin errores', async () => {
    const { result } = await montarHook(() => conComodines(useElegirFamilia))
    expect(result.current).toBeDefined()
    // expect(estadoDe(result.current)).toMatchSnapshot()
  })

  test('sus acciones se pueden usar', async () => {
    const { result } = await montarHook(() => conComodines(useElegirFamilia))
    await usarAcciones(result.current)
    // expect(await usarAcciones(result.current)).toMatchSnapshot()
  })
})
