
export type Rol = "dueno" | "veterinario" | "centro" | "superadmin";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  telefono?: string;
  avatarUrl?: string;
  creadoEn: string; // ISO date
}

export type EspecieMascota = "perro" | "gato" | "ave" | "conejo" | "otro";

export interface Mascota {
  id: string;
  duenoId: string; // FK -> Usuario (rol dueno)
  nombre: string;
  especie: EspecieMascota;
  raza: string;
  fechaNacimiento: string; // ISO date
  sexo: "macho" | "hembra";
  esterilizado: boolean;
  fotoUrl?: string;
}

export interface Centro {
  id: string;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: string;
  horarioApertura: string; // "09:00"
  horarioCierre: string; // "19:00"
  diasAtencion: string[]; // ["lunes", "martes", ...]
  especialidades: string[];
}

export interface Veterinario {
  id: string;
  usuarioId: string; // FK -> Usuario (rol veterinario)
  centroIds: string[]; // FK -> Centro (puede atender en varios)
  especialidad: string;
  numeroColegiado: string;
}

export type EstadoCita =
  | "pendiente"
  | "confirmada"
  | "en_curso"
  | "completada"
  | "cancelada";

export type UrgenciaCita = "baja" | "media" | "alta" | "critica";

export interface Cita {
  id: string;
  mascotaId: string; // FK -> Mascota
  duenoId: string; // FK -> Usuario
  veterinarioId?: string; // FK -> Veterinario (puede no estar asignado aun)
  centroId: string; // FK -> Centro
  fechaHora: string; // ISO datetime
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita; // sugerida por el sistema de IA
  sintomasReportados?: string[];
  creadaEn: string;
}

export interface Diagnostico {
  id: string;
  citaId: string; // FK -> Cita
  mascotaId: string; // FK -> Mascota
  veterinarioId: string; // FK -> Veterinario
  fecha: string; // ISO date
  descripcion: string;
  tratamiento?: string;
  derivadoA?: {
    tipo: "veterinario" | "centro";
    id: string;
    motivo: string;
  };
}

export interface RegistroHistorialMedico {
  id: string;
  mascotaId: string; // FK -> Mascota
  fecha: string; // ISO date
  tipo: "diagnostico" | "vacuna" | "cirugia" | "control" | "otro";
  descripcion: string;
  veterinarioId?: string;
  centroId?: string;
}

// ============================================================
// USUARIOS
// ============================================================

export const usuariosMock: Usuario[] = [
  {
    id: "u-001",
    nombre: "Camila Rojas",
    email: "camila.rojas@example.com",
    rol: "dueno",
    telefono: "+56 9 1234 5678",
    creadoEn: "2025-11-02T10:15:00Z",
  },
  {
    id: "u-002",
    nombre: "Matías Fuentes",
    email: "matias.fuentes@example.com",
    rol: "dueno",
    telefono: "+56 9 8765 4321",
    creadoEn: "2025-12-10T09:00:00Z",
  },
  {
    id: "u-003",
    nombre: "Dra. Valentina Soto",
    email: "valentina.soto@auravet.com",
    rol: "veterinario",
    telefono: "+56 9 2222 3333",
    creadoEn: "2025-09-20T08:00:00Z",
  },
  {
    id: "u-004",
    nombre: "Dr. Ignacio Pérez",
    email: "ignacio.perez@auravet.com",
    rol: "veterinario",
    telefono: "+56 9 4444 5555",
    creadoEn: "2025-09-22T08:00:00Z",
  },
  {
    id: "u-005",
    nombre: "Clínica VetSur",
    email: "contacto@vetsur.com",
    rol: "centro",
    telefono: "+56 2 2555 1010",
    creadoEn: "2025-08-01T08:00:00Z",
  },
  {
    id: "u-006",
    nombre: "Admin AuraPet",
    email: "admin@aurapet.com",
    rol: "superadmin",
    creadoEn: "2025-07-01T08:00:00Z",
  },
];

// ============================================================
// CENTROS
// ============================================================

export const centrosMock: Centro[] = [
  {
    id: "c-001",
    nombre: "Clínica VetSur",
    direccion: "Av. Providencia 1234",
    comuna: "Providencia",
    telefono: "+56 2 2555 1010",
    horarioApertura: "09:00",
    horarioCierre: "20:00",
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
    especialidades: ["medicina general", "cirugia", "imagenologia"],
  },
  {
    id: "c-002",
    nombre: "Centro Veterinario Las Condes",
    direccion: "Av. Apoquindo 5678",
    comuna: "Las Condes",
    telefono: "+56 2 2777 2020",
    horarioApertura: "08:30",
    horarioCierre: "19:00",
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes"],
    especialidades: ["medicina general", "dermatologia", "laboratorio"],
  },
  {
    id: "c-003",
    nombre: "PetLab Diagnóstico",
    direccion: "Manuel Montt 890",
    comuna: "Ñuñoa",
    telefono: "+56 2 2999 3030",
    horarioApertura: "09:00",
    horarioCierre: "18:00",
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes"],
    especialidades: ["laboratorio", "radiografia", "ecografia"],
  },
];

// ============================================================
// VETERINARIOS
// ============================================================

export const veterinariosMock: Veterinario[] = [
  {
    id: "v-001",
    usuarioId: "u-003",
    centroIds: ["c-001"],
    especialidad: "Medicina general",
    numeroColegiado: "COL-4521",
  },
  {
    id: "v-002",
    usuarioId: "u-004",
    centroIds: ["c-001", "c-002"],
    especialidad: "Cirugía",
    numeroColegiado: "COL-7788",
  },
];

// ============================================================
// MASCOTAS
// ============================================================

export const mascotasMock: Mascota[] = [
  {
    id: "m-001",
    duenoId: "u-001",
    nombre: "Firulais",
    especie: "perro",
    raza: "Labrador",
    fechaNacimiento: "2021-03-15",
    sexo: "macho",
    esterilizado: true,
  },
  {
    id: "m-002",
    duenoId: "u-001",
    nombre: "Michi",
    especie: "gato",
    raza: "Común europeo",
    fechaNacimiento: "2022-07-08",
    sexo: "hembra",
    esterilizado: false,
  },
  {
    id: "m-003",
    duenoId: "u-002",
    nombre: "Rocky",
    especie: "perro",
    raza: "Bulldog Francés",
    fechaNacimiento: "2020-01-20",
    sexo: "macho",
    esterilizado: true,
  },
];

// ============================================================
// CITAS
// ============================================================

export const citasMock: Cita[] = [
  {
    id: "cita-001",
    mascotaId: "m-001",
    duenoId: "u-001",
    veterinarioId: "v-001",
    centroId: "c-001",
    fechaHora: "2026-09-05T10:30:00Z",
    motivo: "Control anual y vacunas",
    estado: "confirmada",
    urgencia: "baja",
    sintomasReportados: [],
    creadaEn: "2026-09-01T14:00:00Z",
  },
  {
    id: "cita-002",
    mascotaId: "m-002",
    duenoId: "u-001",
    veterinarioId: undefined,
    centroId: "c-001",
    fechaHora: "2026-09-04T16:00:00Z",
    motivo: "Vómitos y decaimiento hace 2 días",
    estado: "pendiente",
    urgencia: "alta",
    sintomasReportados: ["vomitos", "decaimiento", "falta de apetito"],
    creadaEn: "2026-09-03T09:20:00Z",
  },
  {
    id: "cita-003",
    mascotaId: "m-003",
    duenoId: "u-002",
    veterinarioId: "v-002",
    centroId: "c-002",
    fechaHora: "2026-08-28T11:00:00Z",
    motivo: "Cojera pata trasera",
    estado: "completada",
    urgencia: "media",
    sintomasReportados: ["cojera", "dolor al caminar"],
    creadaEn: "2026-08-25T18:45:00Z",
  },
];

// ============================================================
// DIAGNÓSTICOS
// ============================================================

export const diagnosticosMock: Diagnostico[] = [
  {
    id: "diag-001",
    citaId: "cita-003",
    mascotaId: "m-003",
    veterinarioId: "v-002",
    fecha: "2026-08-28",
    descripcion: "Esguince leve en pata trasera derecha, sin fractura.",
    tratamiento: "Reposo 10 días, antiinflamatorio.",
    derivadoA: {
      tipo: "centro",
      id: "c-003",
      motivo: "Radiografía de control en 2 semanas",
    },
  },
];

// ============================================================
// HISTORIAL MÉDICO
// ============================================================

export const historialMedicoMock: RegistroHistorialMedico[] = [
  {
    id: "hist-001",
    mascotaId: "m-001",
    fecha: "2025-03-15",
    tipo: "vacuna",
    descripcion: "Vacuna polivalente (primera dosis)",
    veterinarioId: "v-001",
    centroId: "c-001",
  },
  {
    id: "hist-002",
    mascotaId: "m-003",
    fecha: "2026-08-28",
    tipo: "diagnostico",
    descripcion: "Esguince leve en pata trasera derecha",
    veterinarioId: "v-002",
    centroId: "c-002",
  },
  {
    id: "hist-003",
    mascotaId: "m-003",
    fecha: "2024-01-10",
    tipo: "cirugia",
    descripcion: "Esterilización",
    veterinarioId: "v-001",
    centroId: "c-001",
  },
];

// ============================================================
// HELPERS RÁPIDOS (útiles mientras no hay backend)
// ============================================================

export const getMascotasPorDueno = (duenoId: string): Mascota[] =>
  mascotasMock.filter((m) => m.duenoId === duenoId);

export const getCitasPorDueno = (duenoId: string): Cita[] =>
  citasMock.filter((c) => c.duenoId === duenoId);

export const getCitasPorVeterinario = (veterinarioId: string): Cita[] =>
  citasMock.filter((c) => c.veterinarioId === veterinarioId);

export const getHistorialPorMascota = (
  mascotaId: string
): RegistroHistorialMedico[] =>
  historialMedicoMock
    .filter((h) => h.mascotaId === mascotaId)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));