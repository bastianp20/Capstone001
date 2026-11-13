import { describe, test, expect } from 'vitest'
import { supabase } from '../lib/supabase'
import { responderRpc } from '../test/supabaseFalso'
import { comodin } from '../test/comodin'
import * as getInfo from './getInfo'
import { estadoUciDesdeFila, getAllCitas, getUrgencias } from './getInfo'

// Cuántas veces se le habló a Supabase (consultas, funciones, archivos o sesión)
const llamadasASupabase = () =>
  [supabase.rpc, supabase.from, supabase.storage.from, supabase.functions.invoke].reduce(
    (total, fn) => total + (fn as unknown as { mock: { calls: unknown[] } }).mock.calls.length,
    0,
  )

// estadoUciDesdeFila y getAllCitas tienen sus propias pruebas más abajo
const consultas = Object.entries(getInfo).filter(
  ([nombre, valor]) => typeof valor === 'function' && !['estadoUciDesdeFila', 'getAllCitas'].includes(nombre),
) as [string, (...args: unknown[]) => unknown][]

describe('getInfo', () => {
  test.each(consultas)('%s le pide los datos a Supabase', async (_nombre, consulta) => {
    await Promise.resolve()
      .then(() => consulta(comodin, comodin, comodin, comodin))
      .catch(() => {})
    expect(llamadasASupabase()).toBeGreaterThan(0)
  })
})

describe('getUrgencias', () => {
  test('pide los datos a la función listar_urgencias', async () => {
    await getUrgencias()
    expect(supabase.rpc).toHaveBeenCalledWith('listar_urgencias')
  })

  test('devuelve listas vacías si no hay datos', async () => {
    expect(await getUrgencias()).toEqual({ centros: [], veterinarios: [] })
  })

  test('transforma los datos de la base al formato de la pantalla', async () => {
    responderRpc('listar_urgencias', {
      centros: [{ id: 7, nombre: 'Clínica Patitas', direccion: 'Av. Grecia 123', comuna: 'Ñuñoa', telefono: 56912345678,
        urgencias_24_7: true, tiene_uci: false, estado_uci: null, horarios: [] }],
      veterinarios: [],
    })
    const { centros } = await getUrgencias()
    expect(centros[0].urgencias247).toBe(true)
    // expect(centros[0]).toMatchSnapshot()
  })
})

describe('getAllCitas', () => {
  test('pide la página de citas a listar_citas y arma el total', async () => {
    responderRpc('listar_citas', [
      { id: 1, mascota: 'Luna', dueno: null, veterinario: null, centro: 'Clínica Patitas', fecha_hora: '2026-11-12T13:30:00Z',
        estado: 'pendiente', urgencia: null, motivo: 'Control', es_prueba: true, total: 1 },
    ])
    const pagina = await getAllCitas({ busqueda: '', estado: null, urgencia: null, rango: 'proximas', pagina: 1, porPagina: 10 })
    expect(pagina.total).toBe(1)
    // expect(pagina.citas[0]).toMatchSnapshot()
  })
})

describe('estadoUciDesdeFila', () => {
  test('pasa la fila de la base al formato de la pantalla', () => {
    const fila = { centro_id: 4, estado: 'disponible', motivo: null, detalle: null, actualizado_en: '2026-11-11T14:00:00Z' }
    expect(estadoUciDesdeFila(fila)).toEqual({ centroId: 4, estado: 'disponible', motivo: null, detalle: null, actualizadoEn: '2026-11-11T14:00:00Z' })
  })
})
