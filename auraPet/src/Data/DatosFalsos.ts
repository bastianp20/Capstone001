

import type {SolicitudPendiente, CitaResumen} from '../../src/interfaces'; 

export const solicitudesPendientesMock: SolicitudPendiente[] = [
  { id: "sol-1", nombre: "Clínica Veterinaria El Sol", tipo: "centro", fechaRegistro: "23/07/2026" },
  { id: "sol-2", nombre: "Dr. Andrés Cortés", tipo: "veterinario", fechaRegistro: "21/07/2026" },
  { id: "sol-3", nombre: "Centro Veterinario Bosque Nativo", tipo: "centro", fechaRegistro: "18/07/2026" },
];

export const citasMock: CitaResumen[] = [
  { id: "c-1", mascota: "Firulais", dueno: "Camila Rojas", veterinario: "Dra. Valentina Soto", centro: "Clínica VetSur", fechaHora: "23/07 · 13:00", estado: "confirmada", urgencia: "critica" },
  { id: "c-2", mascota: "Michi", dueno: "Matías Fuentes", veterinario: "Dr. Ignacio Pérez", centro: "C. Las Condes", fechaHora: "26/07 · 12:00", estado: "en_curso", urgencia: "alta" },
  { id: "c-3", mascota: "Rocky", dueno: "Francisca Muñoz", veterinario: "Dra. Valentina Soto", centro: "Clínica VetSur", fechaHora: "17/07 · 06:00", estado: "cancelada", urgencia: "media" },
  { id: "c-4", mascota: "Kiwi", dueno: "Camila Rojas", veterinario: "Dr. Ignacio Pérez", centro: "PetLab", fechaHora: "23/07 · 12:30", estado: "pendiente", urgencia: "baja" },
];