
import { type RegistroHistorialMedico } from '../interfaces';

// Historial acumulado por mascota — vacunas, controles, cirugías y
// diagnósticos, con varios años de antigüedad para simular una
// plataforma que ya lleva tiempo funcionando.
export const historialMedicoMock: RegistroHistorialMedico[] = [
  { id: 1, mascotaId: 1, fecha: 20220410, tipo: "vacuna", descripcion: "Vacuna polivalente (primera dosis)", veterinarioId: 1, centroId: 1 },
  { id: 2, mascotaId: 1, fecha: 20230412, tipo: "vacuna", descripcion: "Refuerzo anual polivalente", veterinarioId: 1, centroId: 1 },
  { id: 3, mascotaId: 1, fecha: 20240415, tipo: "control", descripcion: "Control anual, peso y estado general normales", veterinarioId: 1, centroId: 1 },
  { id: 4, mascotaId: 1, fecha: 20251220, tipo: "control", descripcion: "Control anual y vacunas al día", veterinarioId: 1, centroId: 1 },

  { id: 5, mascotaId: 2, fecha: 20220801, tipo: "cirugia", descripcion: "Esterilización", veterinarioId: 1, centroId: 1 },
  { id: 6, mascotaId: 2, fecha: 20230805, tipo: "vacuna", descripcion: "Vacuna triple felina", veterinarioId: 1, centroId: 1 },

  { id: 7, mascotaId: 3, fecha: 20240110, tipo: "cirugia", descripcion: "Esterilización", veterinarioId: 1, centroId: 1 },
  { id: 8, mascotaId: 3, fecha: 20260828, tipo: "diagnostico", descripcion: "Esguince leve en pata trasera derecha", veterinarioId: 2, centroId: 2 },

  { id: 9, mascotaId: 4, fecha: 20230210, tipo: "diagnostico", descripcion: "Dermatitis alérgica leve", veterinarioId: 3, centroId: 2 },
  { id: 10, mascotaId: 4, fecha: 20240214, tipo: "control", descripcion: "Control dermatológico, sin recurrencia", veterinarioId: 3, centroId: 2 },

  { id: 11, mascotaId: 5, fecha: 20230422, tipo: "control", descripcion: "Chequeo general, plumaje y peso normales", veterinarioId: 4, centroId: 3 },

  { id: 12, mascotaId: 6, fecha: 20220701, tipo: "vacuna", descripcion: "Vacuna antirrábica (primera dosis)", veterinarioId: 1, centroId: 1 },
  { id: 13, mascotaId: 6, fecha: 20230703, tipo: "vacuna", descripcion: "Refuerzo antirrábica", veterinarioId: 1, centroId: 1 },
  { id: 14, mascotaId: 6, fecha: 20250705, tipo: "vacuna", descripcion: "Refuerzo antirrábica anual", veterinarioId: 1, centroId: 1 },

  { id: 15, mascotaId: 7, fecha: 20230914, tipo: "diagnostico", descripcion: "Maloclusión dental leve", veterinarioId: 2, centroId: 1 },
  { id: 16, mascotaId: 7, fecha: 20240320, tipo: "control", descripcion: "Control dental de seguimiento", veterinarioId: 2, centroId: 1 },

  { id: 17, mascotaId: 9, fecha: 20231215, tipo: "cirugia", descripcion: "Esterilización", veterinarioId: 1, centroId: 1 },
  { id: 18, mascotaId: 9, fecha: 20240119, tipo: "control", descripcion: "Control post-esterilización sin complicaciones", veterinarioId: 1, centroId: 1 },

  { id: 19, mascotaId: 10, fecha: 20240225, tipo: "diagnostico", descripcion: "Cataratas incipientes bilaterales", veterinarioId: 6, centroId: 5 },
  { id: 20, mascotaId: 10, fecha: 20250810, tipo: "cirugia", descripcion: "Cirugía de cataratas, ojo derecho", veterinarioId: 6, centroId: 5 },
  { id: 21, mascotaId: 10, fecha: 20260115, tipo: "control", descripcion: "Evolución favorable post-cirugía", veterinarioId: 6, centroId: 5 },

  { id: 22, mascotaId: 11, fecha: 20240315, tipo: "diagnostico", descripcion: "Dermatitis atópica", veterinarioId: 3, centroId: 2 },
  { id: 23, mascotaId: 11, fecha: 20250320, tipo: "control", descripcion: "Control dermatológico anual", veterinarioId: 3, centroId: 2 },

  { id: 24, mascotaId: 12, fecha: 20240430, tipo: "vacuna", descripcion: "Vacuna triple felina", veterinarioId: 4, centroId: 3 },

  { id: 25, mascotaId: 14, fecha: 20240722, tipo: "vacuna", descripcion: "Vacunas anuales (polivalente + antirrábica)", veterinarioId: 5, centroId: 4 },

  { id: 26, mascotaId: 15, fecha: 20240819, tipo: "diagnostico", descripcion: "Gastroenteritis leve", veterinarioId: 2, centroId: 1 },

  { id: 27, mascotaId: 16, fecha: 20240930, tipo: "diagnostico", descripcion: "Herida superficial en cojinete", veterinarioId: 6, centroId: 5 },
  { id: 28, mascotaId: 16, fecha: 20260304, tipo: "control", descripcion: "Cicatrización completa, alta médica", veterinarioId: 2, centroId: 1 },

  { id: 29, mascotaId: 18, fecha: 20241212, tipo: "diagnostico", descripcion: "Acumulación de sarro grado II", veterinarioId: 7, centroId: 5 },
  { id: 30, mascotaId: 18, fecha: 20241219, tipo: "cirugia", descripcion: "Profilaxis dental bajo sedación", veterinarioId: 7, centroId: 5 },

  { id: 31, mascotaId: 20, fecha: 20250308, tipo: "diagnostico", descripcion: "Sospecha de insuficiencia cardíaca temprana", veterinarioId: 2, centroId: 2 },
  { id: 32, mascotaId: 20, fecha: 20250610, tipo: "control", descripcion: "Control cardiológico, estable con tratamiento", veterinarioId: 2, centroId: 2 },
  { id: 33, mascotaId: 20, fecha: 20260518, tipo: "control", descripcion: "Control cardiológico de seguimiento", veterinarioId: 2, centroId: 2 },

  { id: 34, mascotaId: 22, fecha: 20250529, tipo: "diagnostico", descripcion: "Gastritis leve por ingesta de alimento inadecuado", veterinarioId: 1, centroId: 1 },

  { id: 35, mascotaId: 24, fecha: 20250814, tipo: "vacuna", descripcion: "Vacunas anuales (primera dosis, cachorro)", veterinarioId: 5, centroId: 4 },

  { id: 36, mascotaId: 25, fecha: 20250925, tipo: "diagnostico", descripcion: "Rinitis alérgica estacional", veterinarioId: 3, centroId: 2 },
];
