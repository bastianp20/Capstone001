import type { MascotaEnAdopcion, Refugio } from './types'

// Refugios de prueba. Reemplazar por datos reales cuando se contacte a las
// organizaciones (ver tarea pendiente: "recopilar datos de refugios reales").
export const refugios: Refugio[] = [
  {
    id: 'ref-001',
    nombre: 'Refugio Patitas Felices',
    comuna: 'Maipú',
    telefono: '+56 9 4567 8901',
    email: 'contacto@refugiopatitas.cl',
    sitioWeb: 'https://refugiopatitas.example.cl',
  },
  {
    id: 'ref-002',
    nombre: 'Fundación Huellas de Amor',
    comuna: 'Puente Alto',
    telefono: '+56 9 6789 0123',
    email: 'contacto@huellasdeamor.cl',
  },
]

// Mascotas disponibles para adopción, referenciando refugios.ts (refugioId).
// El campo `perfil` es el insumo que más adelante alimentará al modelo de
// matching (ML/DL) para sugerir compatibilidad con el hogar del adoptante.
export const mascotasEnAdopcion: MascotaEnAdopcion[] = [
  {
    id: 'ado-001',
    nombre: 'Luna',
    especie: 'perro',
    raza: 'Mestiza',
    edadAprox: 2,
    sexo: 'hembra',
    refugioId: 'ref-001',
    descripcion: 'Muy juguetona y cariñosa, se lleva bien con niños y otros perros.',
    perfil: {
      nivelEnergia: 'alto',
      tamano: 'mediano',
      aptoNinos: true,
      aptoOtrasMascotas: true,
    },
    fechaIngreso: '2026-05-02',
    disponible: true,
  },
  {
    id: 'ado-002',
    nombre: 'Toby',
    especie: 'perro',
    raza: 'Beagle',
    edadAprox: 4,
    sexo: 'macho',
    refugioId: 'ref-001',
    descripcion: 'Tranquilo, ideal para departamentos, ya sabe caminar con correa.',
    perfil: {
      nivelEnergia: 'medio',
      tamano: 'mediano',
      aptoNinos: true,
      aptoOtrasMascotas: false,
    },
    fechaIngreso: '2026-03-18',
    disponible: true,
  },
  {
    id: 'ado-003',
    nombre: 'Nube',
    especie: 'gato',
    raza: 'Común europeo',
    edadAprox: 1,
    sexo: 'hembra',
    refugioId: 'ref-002',
    descripcion: 'Gatita tímida al principio, muy independiente y limpia.',
    perfil: {
      nivelEnergia: 'bajo',
      tamano: 'pequeño',
      aptoNinos: true,
      aptoOtrasMascotas: true,
    },
    fechaIngreso: '2026-06-10',
    disponible: true,
  },
  {
    id: 'ado-004',
    nombre: 'Rocky',
    especie: 'perro',
    raza: 'Pitbull mix',
    edadAprox: 3,
    sexo: 'macho',
    refugioId: 'ref-002',
    descripcion: 'Muy leal, necesita patio y una familia con experiencia con perros grandes.',
    perfil: {
      nivelEnergia: 'alto',
      tamano: 'grande',
      aptoNinos: false,
      aptoOtrasMascotas: false,
    },
    fechaIngreso: '2026-02-25',
    disponible: false,
  },
]
