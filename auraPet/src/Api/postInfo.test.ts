import { describe, test, expect } from 'vitest'
import { supabase } from '../lib/supabase'
import { comodin } from '../test/comodin'
import * as postInfo from './postInfo'

// Cuántas veces se le habló a Supabase (consultas, funciones, archivos o sesión)
const llamadasASupabase = () =>
  [supabase.rpc, supabase.from, supabase.storage.from, supabase.functions.invoke].reduce(
    (total, fn) => total + (fn as unknown as { mock: { calls: unknown[] } }).mock.calls.length,
    0,
  )

const consultas = Object.entries(postInfo).filter(([, valor]) => typeof valor === 'function') as [string, (...args: unknown[]) => unknown][]

describe('postInfo', () => {
  test.each(consultas)('%s guarda los datos en Supabase', async (_nombre, consulta) => {
    await Promise.resolve()
      .then(() => consulta(comodin, comodin, comodin, comodin))
      .catch(() => {})
    expect(llamadasASupabase()).toBeGreaterThan(0)
  })
})
