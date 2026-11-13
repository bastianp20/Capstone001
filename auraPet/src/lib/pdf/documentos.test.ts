import { describe, test, expect } from 'vitest'
import { jsPDF } from 'jspdf'
import { fichaDePrueba as ficha } from '../../test/datos'
import { dibujarFichaCompleta, dibujarReceta, dibujarResumen } from './documentos'


describe('documentos PDF', () => {
  test('dibuja la ficha completa', () => {
    const doc = new jsPDF({ format: 'letter' })
    dibujarFichaCompleta(doc, ficha, null)
    expect(doc.getNumberOfPages()).toBeGreaterThan(0)
  })

  test('dibuja el resumen en una página', () => {
    const doc = new jsPDF({ format: 'letter' })
    dibujarResumen(doc, ficha, null)
    expect(doc.getNumberOfPages()).toBe(1)
  })

  test('dibuja la receta', () => {
    const doc = new jsPDF({ format: 'letter' })
    dibujarReceta(doc, ficha, ficha.recetas[0], null)
    expect(doc.getNumberOfPages()).toBeGreaterThan(0)
  })
})
