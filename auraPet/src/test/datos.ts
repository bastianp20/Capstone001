// Datos de ejemplo que comparten varias pruebas.
import type { FichaPdf } from '../interfaces'

export const fichaDePrueba: FichaPdf = {
  codigo: '#000342',
  emitida: '11 de noviembre de 2026, 12:00 h',
  paciente: { nombre: 'Luna', especie: 'Perro', raza: 'Mestiza', sexo: 'Hembra', nacimiento: '12 abr 2019 (7 años)',
    peso: '12 kg', esterilizado: 'Sí', microchip: 'Sin registrar' },
  tutor: { nombre: 'Camila Rojas', telefono: '+56 9 1234 5678' },
  alergias: 'Penicilina',
  condicionesCronicas: null,
  vacunas: [{ registroId: 1, nombre: 'Óctuple', aplicada: '20 dic 2025', proximaDosis: '20 dic 2026', estado: 'al_dia' }],
  historial: [{ id: 1, fecha: '20 dic 2025', tipo: 'vacuna', descripcion: 'Óctuple', tratamiento: null, proximaDosis: '2026-12-20',
    veterinario: 'Dr. Pérez', centro: 'Clínica Patitas', esMio: false }],
  recetas: [{ id: 9, fecha: '20 oct 2026', indicaciones: 'Con comida', proximoControl: null, veterinario: 'Dr. Pérez',
    colegiado: '1234', centro: null, medicamentos: [{ nombre: 'Amoxicilina', dosis: '250 mg', frecuencia: 'Cada 12 h', duracion: '7 días' }] }],
  derivaciones: [{ fecha: '20/10/2026', origen: 'Dr. Pérez', destino: 'Imagenología', motivo: 'Radiografía', estado: 'pendiente', resultado: null }],
}
