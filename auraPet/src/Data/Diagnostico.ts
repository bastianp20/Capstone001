
import { type Diagnostico } from '../interfaces';

export const diagnosticosMock: Diagnostico[] = [
  { id: "diag-001", citaId: "cita-003", mascotaId: "m-003", veterinarioId: "v-002", fecha: "2026-08-28", descripcion: "Esguince leve en pata trasera derecha, sin fractura.", tratamiento: "Reposo 10 días, antiinflamatorio.", derivadoA: { tipo: "centro", id: "c-003", motivo: "Radiografía de control en 2 semanas" } },
  { id: "diag-002", citaId: "cita-004", mascotaId: "m-004", veterinarioId: "v-003", fecha: "2023-02-10", descripcion: "Dermatitis alérgica leve.", tratamiento: "Shampoo medicado y antihistamínico por 7 días." },
  { id: "diag-003", citaId: "cita-007", mascotaId: "m-007", veterinarioId: "v-002", fecha: "2023-09-14", descripcion: "Maloclusión dental leve.", tratamiento: "Limado de dientes, control en 6 meses." },
  { id: "diag-004", citaId: "cita-009", mascotaId: "m-009", veterinarioId: "v-001", fecha: "2024-01-19", descripcion: "Recuperación post-esterilización sin complicaciones.", tratamiento: "Retiro de puntos, alta médica." },
  { id: "diag-005", citaId: "cita-010", mascotaId: "m-010", veterinarioId: "v-006", fecha: "2024-02-25", descripcion: "Cataratas incipientes bilaterales.", tratamiento: "Gotas oftálmicas, control cada 3 meses.", derivadoA: { tipo: "centro", id: "c-005", motivo: "Evaluación oftalmológica especializada" } },
  { id: "diag-006", citaId: "cita-011", mascotaId: "m-011", veterinarioId: "v-003", fecha: "2024-03-15", descripcion: "Dermatitis atópica.", tratamiento: "Tratamiento tópico y cambio de dieta." },
  { id: "diag-007", citaId: "cita-015", mascotaId: "m-015", veterinarioId: "v-002", fecha: "2024-08-19", descripcion: "Gastroenteritis leve, probable cambio de alimento.", tratamiento: "Dieta blanda 5 días, probiótico." },
  { id: "diag-008", citaId: "cita-016", mascotaId: "m-016", veterinarioId: "v-006", fecha: "2024-09-30", descripcion: "Herida superficial en cojinete, sin compromiso óseo.", tratamiento: "Limpieza y sutura, antibiótico 7 días." },
  { id: "diag-009", citaId: "cita-018", mascotaId: "m-018", veterinarioId: "v-007", fecha: "2024-12-12", descripcion: "Acumulación de sarro grado II.", tratamiento: "Profilaxis dental bajo sedación." },
  { id: "diag-010", citaId: "cita-020", mascotaId: "m-020", veterinarioId: "v-002", fecha: "2025-03-08", descripcion: "Sospecha de insuficiencia cardíaca temprana.", tratamiento: "Derivado a control cardiológico continuo.", derivadoA: { tipo: "veterinario", id: "v-002", motivo: "Seguimiento cardiológico trimestral" } },
  { id: "diag-011", citaId: "cita-022", mascotaId: "m-022", veterinarioId: "v-001", fecha: "2025-05-29", descripcion: "Gastritis leve por ingesta de alimento inadecuado.", tratamiento: "Dieta blanda, protector gástrico 5 días." },
  { id: "diag-012", citaId: "cita-025", mascotaId: "m-025", veterinarioId: "v-003", fecha: "2025-09-25", descripcion: "Rinitis alérgica estacional.", tratamiento: "Antihistamínico durante primavera." },
  { id: "diag-013", citaId: "cita-028", mascotaId: "m-010", veterinarioId: "v-006", fecha: "2026-01-15", descripcion: "Evolución favorable post-cirugía de cataratas.", tratamiento: "Alta de control oftalmológico." },
  { id: "diag-014", citaId: "cita-029", mascotaId: "m-016", veterinarioId: "v-002", fecha: "2026-03-04", descripcion: "Cicatrización completa de herida en cojinete.", tratamiento: "Alta médica, sin restricciones." },
];
