import { describe, test, expect } from 'vitest'
import type { PublicacionPropia } from '../interfaces'
import { haceCuanto, hitosCumplidos, iniciales, publicacionDestacada, telefonoParaWhatsapp, valoresUnicos } from './publicacionesAdopcion'

const publicacion = (cambios: Partial<PublicacionPropia>): PublicacionPropia => ({
  id: 1, nombre: 'Luna', especie: 'perro', raza: 'Mestiza', edad: '2 años', comuna: 'Ñuñoa', fotoUrl: null, estado: 'publicada',
  creadaEn: '2026-11-01T12:00:00Z', adoptadaEn: null, testimonio: null, solicitaChequeo: false, revisadaPor: null,
  postulaciones: 0, nuevas: 0, elegido: null, refugio: null, ...cambios,
})

describe('publicacionesAdopcion', () => {
  test('una publicación adoptada cumplió todos los hitos', () => {
    expect(hitosCumplidos(publicacion({ estado: 'adoptada', revisadaPor: 'Dra. Rojas' })).size).toBe(5)
  })

  test('la destacada es la que tiene más postulaciones nuevas', () => {
    const lista = [publicacion({ id: 1, nuevas: 0 }), publicacion({ id: 2, nuevas: 3 }), publicacion({ id: 3, estado: 'retirada', nuevas: 9 })]
    expect(publicacionDestacada(lista)?.id).toBe(2)
  })

  test('dice hace cuánto pasó algo', () => {
    const ahora = new Date('2026-11-11T15:00:00Z')
    expect(haceCuanto('2026-11-11T15:00:00Z', ahora)).toBe('recién')
    expect(haceCuanto('2026-11-10T15:00:00Z', ahora)).toBe('ayer')
    expect(haceCuanto('2026-10-28T15:00:00Z', ahora)).toBe('hace 2 semanas')
  })

  test('saca las iniciales del nombre', () => {
    expect(iniciales('Javiera Soto Pérez')).toBe('JS')
  })

  test('valores sin repetir y ordenados', () => {
    expect(valoresUnicos(['Ñuñoa', 'Maipú', '', 'Ñuñoa'])).toEqual(['Maipú', 'Ñuñoa'])
  })

  test('el teléfono para WhatsApp siempre lleva 56', () => {
    expect(telefonoParaWhatsapp(912345678)).toBe('56912345678')
    expect(telefonoParaWhatsapp(56912345678)).toBe('56912345678')
  })
})
