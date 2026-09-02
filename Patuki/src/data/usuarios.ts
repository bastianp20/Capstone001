import type { Usuario } from './types'

// Datos falsos de usuarios (dueños de mascotas, veterinarios y encargados de refugio).
// Uso temporal mientras se define el backend real y se recopilan datos de refugios.
export const usuarios: Usuario[] = [
  {
    id: 'usr-001',
    nombre: 'Bastián Palavecino',
    email: 'bastian.palavecino89@gmail.com',
    rol: 'dueño',
    telefono: '+56 9 1234 5678',
    comuna: 'Providencia',
  },
  {
    id: 'usr-002',
    nombre: 'Camila Rojas',
    email: 'camila.rojas@vetsur.cl',
    rol: 'veterinario',
    telefono: '+56 9 2345 6789',
    comuna: 'Ñuñoa',
  },
  {
    id: 'usr-003',
    nombre: 'Matías Fuentes',
    email: 'matias.fuentes@gmail.com',
    rol: 'dueño',
    telefono: '+56 9 3456 7890',
    comuna: 'La Florida',
  },
  {
    id: 'usr-004',
    nombre: 'Valentina Soto',
    email: 'valentina.soto@refugiopatitas.cl',
    rol: 'refugio',
    telefono: '+56 9 4567 8901',
    comuna: 'Maipú',
  },
  {
    id: 'usr-005',
    nombre: 'Ignacio Herrera',
    email: 'ignacio.herrera@vetnorte.cl',
    rol: 'veterinario',
    telefono: '+56 9 5678 9012',
    comuna: 'Recoleta',
  },
]
