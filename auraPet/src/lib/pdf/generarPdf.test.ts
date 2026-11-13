import { describe, test, expect, vi } from 'vitest'
import { fichaDePrueba } from '../../test/datos'
import { descargarFicha, descargarReceta } from './generarPdf'

// En vez de descargar el archivo, se anota el nombre con que se guardaría
const guardar = vi.hoisted(() => vi.fn())
vi.mock('jspdf', async (original) => {
  const modulo = await original<typeof import('jspdf')>()
  class PdfSinDescarga extends modulo.jsPDF {
    save = guardar as never
  }
  return { ...modulo, jsPDF: PdfSinDescarga }
})

// No se baja el logo (no hay internet en las pruebas): el PDF sale sin logo
vi.mock('./logo', () => ({ cargarLogo: async () => null }))

describe('generarPdf', () => {
  test('descarga la ficha con el nombre de la mascota en el archivo', async () => {
    await descargarFicha(fichaDePrueba, 'completa')
    expect(guardar.mock.calls[0][0]).toContain('luna')
  })

  test('descarga una receta', async () => {
    await descargarReceta(fichaDePrueba, 9)
    expect(guardar.mock.calls[0][0]).toContain('receta-9')
  })

  test('avisa si la receta no existe', async () => {
    await expect(descargarReceta(fichaDePrueba, 999)).rejects.toThrow('No se encontró la receta.')
  })
})
