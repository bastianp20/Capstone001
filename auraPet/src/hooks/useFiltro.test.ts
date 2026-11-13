import { describe, test, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFiltro } from './useFiltro'

const nombres = ['María', 'Camilo', 'Ana']
const camposBusqueda = (nombre: string) => [nombre]
const filtros = { todos: () => true }

describe('useFiltro', () => {
  test('parte mostrando todos los nombres', () => {
    const { result } = renderHook(() => useFiltro({ items: nombres, camposBusqueda, filtros, filtroInicial: 'todos' }))
    expect(result.current.visibles).toHaveLength(3)
  })

  test('busca sin importar tildes ni mayúsculas', () => {
    const { result } = renderHook(() => useFiltro({ items: nombres, camposBusqueda, filtros, filtroInicial: 'todos' }))
    act(() => result.current.setBusqueda('MARIA'))
    expect(result.current.visibles).toEqual(['María'])
  })
})
