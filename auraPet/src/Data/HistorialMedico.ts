
import { type RegistroHistorialMedico } from '../interfaces';

// Historial acumulado por mascota — vacunas, controles, cirugías y
// diagnósticos, con varios años de antigüedad para simular una
// plataforma que ya lleva tiempo funcionando.
export const historialMedicoMock: RegistroHistorialMedico[] = [
  { id: "hist-001", mascotaId: "m-001", fecha: "2022-04-10", tipo: "vacuna", descripcion: "Vacuna polivalente (primera dosis)", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-002", mascotaId: "m-001", fecha: "2023-04-12", tipo: "vacuna", descripcion: "Refuerzo anual polivalente", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-003", mascotaId: "m-001", fecha: "2024-04-15", tipo: "control", descripcion: "Control anual, peso y estado general normales", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-004", mascotaId: "m-001", fecha: "2025-12-20", tipo: "control", descripcion: "Control anual y vacunas al día", veterinarioId: "v-001", centroId: "c-001" },

  { id: "hist-005", mascotaId: "m-002", fecha: "2022-08-01", tipo: "cirugia", descripcion: "Esterilización", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-006", mascotaId: "m-002", fecha: "2023-08-05", tipo: "vacuna", descripcion: "Vacuna triple felina", veterinarioId: "v-001", centroId: "c-001" },

  { id: "hist-007", mascotaId: "m-003", fecha: "2024-01-10", tipo: "cirugia", descripcion: "Esterilización", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-008", mascotaId: "m-003", fecha: "2026-08-28", tipo: "diagnostico", descripcion: "Esguince leve en pata trasera derecha", veterinarioId: "v-002", centroId: "c-002" },

  { id: "hist-009", mascotaId: "m-004", fecha: "2023-02-10", tipo: "diagnostico", descripcion: "Dermatitis alérgica leve", veterinarioId: "v-003", centroId: "c-002" },
  { id: "hist-010", mascotaId: "m-004", fecha: "2024-02-14", tipo: "control", descripcion: "Control dermatológico, sin recurrencia", veterinarioId: "v-003", centroId: "c-002" },

  { id: "hist-011", mascotaId: "m-005", fecha: "2023-04-22", tipo: "control", descripcion: "Chequeo general, plumaje y peso normales", veterinarioId: "v-004", centroId: "c-003" },

  { id: "hist-012", mascotaId: "m-006", fecha: "2022-07-01", tipo: "vacuna", descripcion: "Vacuna antirrábica (primera dosis)", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-013", mascotaId: "m-006", fecha: "2023-07-03", tipo: "vacuna", descripcion: "Refuerzo antirrábica", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-014", mascotaId: "m-006", fecha: "2025-07-05", tipo: "vacuna", descripcion: "Refuerzo antirrábica anual", veterinarioId: "v-001", centroId: "c-001" },

  { id: "hist-015", mascotaId: "m-007", fecha: "2023-09-14", tipo: "diagnostico", descripcion: "Maloclusión dental leve", veterinarioId: "v-002", centroId: "c-001" },
  { id: "hist-016", mascotaId: "m-007", fecha: "2024-03-20", tipo: "control", descripcion: "Control dental de seguimiento", veterinarioId: "v-002", centroId: "c-001" },

  { id: "hist-017", mascotaId: "m-009", fecha: "2023-12-15", tipo: "cirugia", descripcion: "Esterilización", veterinarioId: "v-001", centroId: "c-001" },
  { id: "hist-018", mascotaId: "m-009", fecha: "2024-01-19", tipo: "control", descripcion: "Control post-esterilización sin complicaciones", veterinarioId: "v-001", centroId: "c-001" },

  { id: "hist-019", mascotaId: "m-010", fecha: "2024-02-25", tipo: "diagnostico", descripcion: "Cataratas incipientes bilaterales", veterinarioId: "v-006", centroId: "c-005" },
  { id: "hist-020", mascotaId: "m-010", fecha: "2025-08-10", tipo: "cirugia", descripcion: "Cirugía de cataratas, ojo derecho", veterinarioId: "v-006", centroId: "c-005" },
  { id: "hist-021", mascotaId: "m-010", fecha: "2026-01-15", tipo: "control", descripcion: "Evolución favorable post-cirugía", veterinarioId: "v-006", centroId: "c-005" },

  { id: "hist-022", mascotaId: "m-011", fecha: "2024-03-15", tipo: "diagnostico", descripcion: "Dermatitis atópica", veterinarioId: "v-003", centroId: "c-002" },
  { id: "hist-023", mascotaId: "m-011", fecha: "2025-03-20", tipo: "control", descripcion: "Control dermatológico anual", veterinarioId: "v-003", centroId: "c-002" },

  { id: "hist-024", mascotaId: "m-012", fecha: "2024-04-30", tipo: "vacuna", descripcion: "Vacuna triple felina", veterinarioId: "v-004", centroId: "c-003" },

  { id: "hist-025", mascotaId: "m-014", fecha: "2024-07-22", tipo: "vacuna", descripcion: "Vacunas anuales (polivalente + antirrábica)", veterinarioId: "v-005", centroId: "c-004" },

  { id: "hist-026", mascotaId: "m-015", fecha: "2024-08-19", tipo: "diagnostico", descripcion: "Gastroenteritis leve", veterinarioId: "v-002", centroId: "c-001" },

  { id: "hist-027", mascotaId: "m-016", fecha: "2024-09-30", tipo: "diagnostico", descripcion: "Herida superficial en cojinete", veterinarioId: "v-006", centroId: "c-005" },
  { id: "hist-028", mascotaId: "m-016", fecha: "2026-03-04", tipo: "control", descripcion: "Cicatrización completa, alta médica", veterinarioId: "v-002", centroId: "c-001" },

  { id: "hist-029", mascotaId: "m-018", fecha: "2024-12-12", tipo: "diagnostico", descripcion: "Acumulación de sarro grado II", veterinarioId: "v-007", centroId: "c-005" },
  { id: "hist-030", mascotaId: "m-018", fecha: "2024-12-19", tipo: "cirugia", descripcion: "Profilaxis dental bajo sedación", veterinarioId: "v-007", centroId: "c-005" },

  { id: "hist-031", mascotaId: "m-020", fecha: "2025-03-08", tipo: "diagnostico", descripcion: "Sospecha de insuficiencia cardíaca temprana", veterinarioId: "v-002", centroId: "c-002" },
  { id: "hist-032", mascotaId: "m-020", fecha: "2025-06-10", tipo: "control", descripcion: "Control cardiológico, estable con tratamiento", veterinarioId: "v-002", centroId: "c-002" },
  { id: "hist-033", mascotaId: "m-020", fecha: "2026-05-18", tipo: "control", descripcion: "Control cardiológico de seguimiento", veterinarioId: "v-002", centroId: "c-002" },

  { id: "hist-034", mascotaId: "m-022", fecha: "2025-05-29", tipo: "diagnostico", descripcion: "Gastritis leve por ingesta de alimento inadecuado", veterinarioId: "v-001", centroId: "c-001" },

  { id: "hist-035", mascotaId: "m-024", fecha: "2025-08-14", tipo: "vacuna", descripcion: "Vacunas anuales (primera dosis, cachorro)", veterinarioId: "v-005", centroId: "c-004" },

  { id: "hist-036", mascotaId: "m-025", fecha: "2025-09-25", tipo: "diagnostico", descripcion: "Rinitis alérgica estacional", veterinarioId: "v-003", centroId: "c-002" },
];
