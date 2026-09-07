
import { type Veterinario } from '../interfaces';

export const veterinariosMock: Veterinario[] = [
  { id: "v-001", usuarioId: "u-003", centroIds: ["c-001"], especialidad: "Medicina general", numeroColegiado: "COL-4521" },
  { id: "v-002", usuarioId: "u-004", centroIds: ["c-001", "c-002"], especialidad: "Cirugía", numeroColegiado: "COL-7788" },
  { id: "v-003", usuarioId: "u-017", centroIds: ["c-002"], especialidad: "Dermatología", numeroColegiado: "COL-5190" },
  { id: "v-004", usuarioId: "u-018", centroIds: ["c-003"], especialidad: "Medicina felina", numeroColegiado: "COL-6023" },
  { id: "v-005", usuarioId: "u-019", centroIds: ["c-004"], especialidad: "Traumatología", numeroColegiado: "COL-7344" },
  { id: "v-006", usuarioId: "u-020", centroIds: ["c-001", "c-005"], especialidad: "Oftalmología", numeroColegiado: "COL-8112" },
  { id: "v-007", usuarioId: "u-021", centroIds: ["c-005"], especialidad: "Odontología veterinaria", numeroColegiado: "COL-9207" },
];
