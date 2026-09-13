
import { type Veterinario } from '../interfaces';

export const veterinariosMock: Veterinario[] = [
  { id: 1, usuarioId: 3, centroIds: [1], especialidad: "Medicina general", numeroColegiado: "COL-4521" },
  { id: 2, usuarioId: 4, centroIds: [1, 2], especialidad: "Cirugía", numeroColegiado: "COL-7788" },
  { id: 3, usuarioId: 17, centroIds: [2], especialidad: "Dermatología", numeroColegiado: "COL-5190" },
  { id: 4, usuarioId: 18, centroIds: [3], especialidad: "Medicina felina", numeroColegiado: "COL-6023" },
  { id: 5, usuarioId: 19, centroIds: [4], especialidad: "Traumatología", numeroColegiado: "COL-7344" },
  { id: 6, usuarioId: 20, centroIds: [1, 5], especialidad: "Oftalmología", numeroColegiado: "COL-8112" },
  { id: 7, usuarioId: 21, centroIds: [5], especialidad: "Odontología veterinaria", numeroColegiado: "COL-9207" },
];
