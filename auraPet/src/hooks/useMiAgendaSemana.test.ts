import { describe, test, expect } from 'vitest'
import { conComodines, montarHook, usarAcciones } from '../test/probarHook'
import { useMiAgendaSemana } from './useMiAgendaSemana'

describe('useMiAgendaSemana', () => {
  test('arranca sin errores', async () => {
    const { result } = await montarHook(() => conComodines(useMiAgendaSemana))
    expect(result.current).toBeDefined()
    // expect(estadoDe(result.current)).toMatchSnapshot()
  })

  test('sus acciones se pueden usar', async () => {
    const { result } = await montarHook(() => conComodines(useMiAgendaSemana))
    await usarAcciones(result.current)
    // expect(await usarAcciones(result.current)).toMatchSnapshot()
  })
})
