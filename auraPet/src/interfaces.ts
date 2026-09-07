
export type TipoSolicitud = "veterinario" | "centro";
export type UrgenciaCita = "baja" | "media" | "alta" | "critica";
export type EstadoCita = "pendiente" | "confirmada" | "en_curso" | "completada" | "cancelada";
export type Rol = "dueno" | "veterinario" | "centro" | "superadmin";
export type EspecieMascota = "perro" | "gato" | "ave" | "conejo" | "otro";



export interface SolicitudPendiente {
  id: string;
  nombre: string;
  tipo: TipoSolicitud;
  fechaRegistro: string;
}

export interface CitaResumen {
  id: string;
  mascota: string;
  dueno: string;
  veterinario: string;
  centro: string;
  fechaHora: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
}

export interface RechazarModalProps {
  nombreSolicitud: string;
  onCancelar: () => void;
  onConfirmar: (razon: string) => void;
}

export interface KpiCardProps {
  icon: string;
  label: string;
  value: string;
  hint: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  telefono?: string;
  avatarUrl?: string;
  creadoEn: string; // ISO date
}

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
