
import { type Diagnostico } from '../interfaces';

export const diagnosticosMock: Diagnostico[] = [
  { id: 1, citaId: 3, mascotaId: 3, veterinarioId: 2, fecha: 20260828, descripcion: "Esguince leve en pata trasera derecha, sin fractura.", tratamiento: "Reposo 10 días, antiinflamatorio.", derivadoA: { tipo: "centro", id: 3, motivo: "Radiografía de control en 2 semanas" } },
  { id: 2, citaId: 4, mascotaId: 4, veterinarioId: 3, fecha: 20230210, descripcion: "Dermatitis alérgica leve.", tratamiento: "Shampoo medicado y antihistamínico por 7 días." },
  { id: 3, citaId: 7, mascotaId: 7, veterinarioId: 2, fecha: 20230914, descripcion: "Maloclusión dental leve.", tratamiento: "Limado de dientes, control en 6 meses." },
  { id: 4, citaId: 9, mascotaId: 9, veterinarioId: 1, fecha: 20240119, descripcion: "Recuperación post-esterilización sin complicaciones.", tratamiento: "Retiro de puntos, alta médica." },
  { id: 5, citaId: 10, mascotaId: 10, veterinarioId: 6, fecha: 20240225, descripcion: "Cataratas incipientes bilaterales.", tratamiento: "Gotas oftálmicas, control cada 3 meses.", derivadoA: { tipo: "centro", id: 5, motivo: "Evaluación oftalmológica especializada" } },
  { id: 6, citaId: 11, mascotaId: 11, veterinarioId: 3, fecha: 20240315, descripcion: "Dermatitis atópica.", tratamiento: "Tratamiento tópico y cambio de dieta." },
  { id: 7, citaId: 15, mascotaId: 15, veterinarioId: 2, fecha: 20240819, descripcion: "Gastroenteritis leve, probable cambio de alimento.", tratamiento: "Dieta blanda 5 días, probiótico." },
  { id: 8, citaId: 16, mascotaId: 16, veterinarioId: 6, fecha: 20240930, descripcion: "Herida superficial en cojinete, sin compromiso óseo.", tratamiento: "Limpieza y sutura, antibiótico 7 días." },
  { id: 9, citaId: 18, mascotaId: 18, veterinarioId: 7, fecha: 20241212, descripcion: "Acumulación de sarro grado II.", tratamiento: "Profilaxis dental bajo sedación." },
  { id: 10, citaId: 20, mascotaId: 20, veterinarioId: 2, fecha: 20250308, descripcion: "Sospecha de insuficiencia cardíaca temprana.", tratamiento: "Derivado a control cardiológico continuo.", derivadoA: { tipo: "veterinario", id: 2, motivo: "Seguimiento cardiológico trimestral" } },
  { id: 11, citaId: 22, mascotaId: 22, veterinarioId: 1, fecha: 20250529, descripcion: "Gastritis leve por ingesta de alimento inadecuado.", tratamiento: "Dieta blanda, protector gástrico 5 días." },
  { id: 12, citaId: 25, mascotaId: 25, veterinarioId: 3, fecha: 20250925, descripcion: "Rinitis alérgica estacional.", tratamiento: "Antihistamínico durante primavera." },
  { id: 13, citaId: 28, mascotaId: 10, veterinarioId: 6, fecha: 20260115, descripcion: "Evolución favorable post-cirugía de cataratas.", tratamiento: "Alta de control oftalmológico." },
  { id: 14, citaId: 29, mascotaId: 16, veterinarioId: 2, fecha: 20260304, descripcion: "Cicatrización completa de herida en cojinete.", tratamiento: "Alta médica, sin restricciones." },
];
