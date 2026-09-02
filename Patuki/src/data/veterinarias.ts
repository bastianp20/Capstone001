import type { Veterinaria } from './types'

// Clínicas veterinarias de prueba, referenciadas desde mascotas.ts (campo veterinariaId).
export const veterinarias: Veterinaria[] = [
  {
    id: 'vet-001',
    nombre: 'Clínica Veterinaria VetSur',
    direccion: 'Av. Irarrázaval 1234',
    comuna: 'Ñuñoa',
    telefono: '+56 2 2345 6789',
    email: 'contacto@vetsur.cl',
  },
  {
    id: 'vet-002',
    nombre: 'Centro Veterinario VetNorte',
    direccion: 'Av. Recoleta 890',
    comuna: 'Recoleta',
    telefono: '+56 2 2456 7890',
    email: 'contacto@vetnorte.cl',
  },
  {
    id: 'vet-003',
    nombre: 'Hospital Veterinario Providencia',
    direccion: 'Av. Providencia 2020',
    comuna: 'Providencia',
    telefono: '+56 2 2567 8901',
    email: 'hola@hvprovidencia.cl',
  },
]
