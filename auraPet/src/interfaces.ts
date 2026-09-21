
export type TipoSolicitud = "veterinario" | "centro";
export type UrgenciaCita = "baja" | "media" | "alta" | "critica";
export type EstadoCita = "pendiente" | "confirmada" | "en_curso" | "completada" | "cancelada";
export type Rol = "dueno" | "veterinario" | "centro" | "superadmin";
export type EspecieMascota = "perro" | "gato" | "ave" | "conejo" | "otro";



export interface SolicitudPendiente {
  id: number;
  nombre: string;
  tipo: TipoSolicitud;
  fechaRegistro: string;
}

export interface CitaResumen {
  id: number;
  mascota: string;
  dueno: string;
  veterinario: string;
  centro: string;
  fechaHora: string; // ya viene formateada para mostrar ("dd/mm · HH:mm"), a diferencia de Cita.fechaHora que es la fecha cruda en number
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
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  telefono?: number; // ya que un numero telefonico siempre será un numero 
  avatarUrl?: string;
  creadoEn: number; // si nos da un valor de date lo más seguro es que sea decimal por ende podemos truncarlo y extraer los valores que necesitamos
}

export interface Mascota {
  id: number;
  duenoId: number; // FK -> Usuario (rol dueno)
  nombre: string;
  especie: EspecieMascota;
  raza: string;
  fechaNacimiento: number; // lo mismo, si nos da un valor tipo float o date podemos truncarlo y dejarlo prolijo 
  sexo: "macho" | "hembra";
  esterilizado: boolean; // pa saber si es verdadero o falso 
  fotoUrl?: string;
}

export interface Centro {
  id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: number;
  horarioApertura: number // y este lo mismo que con el horario de cierre. 
  horarioCierre: number // puede que nos de un valor tipo 19.40, si fuese el caso, podemos mapearlo y extraer los valores.
  diasAtencion: string[]; // ["lunes", "martes", ...]
  especialidades: string[];
}


export interface Veterinario {
  id: number;
  usuarioId: number // FK -> Usuario (rol veterinario)
  centroIds: number[]; // FK -> Centro (puede atender en varios)
  especialidad: string;
  numeroColegiado: string;
}

export interface Cita {
  id: number;
  mascotaId: number; // FK -> Mascota
  duenoId: number; // FK -> Usuario
  veterinarioId?: number; // FK -> Veterinario (puede no estar asignado aun)
  centroId: number; // FK -> Centro
  fechaHora: number // este tipo de dato tiene que estar en number para que luego podamos mapearlo y extraer los atributs, tales como la hora o la fecha :p
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita; // sugerida por el sistema de IA
  sintomasReportados?: string[];
  creadaEn: string;
}


export interface Diagnostico {
  id: number;
  citaId: number; // FK -> Cita
  mascotaId: number; // FK -> Mascota
  veterinarioId: number; // FK -> Veterinario
  fecha: number; // ISO date
  descripcion: string;
  tratamiento?: string;
  derivadoA?: {
    tipo: "veterinario" | "centro";
    id: number;
    motivo: string;
  };
}


export interface RegistroHistorialMedico {
  id: number;
  mascotaId: number; // FK -> Mascota
  fecha: number; // 
  tipo: "diagnostico" | "vacuna" | "cirugia" | "control" | "otro";
  descripcion: string;
  veterinarioId?: number;
  centroId?: number;
}

export interface PacienteVeterinario {
  id: number; // mascotaId
  nombre: string;
  especie: string;
  raza: string;
  dueno: string;
  ultimaVisita: string;
  totalVisitas: number;
}

export interface MedicamentoReceta {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

export interface NuevaReceta {
  mascotaId: number;
  veterinarioId: number;
  fecha: number; // YYYYMMDD, se genera al guardar — mismo formato que el resto del mock
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  proximoControl?: string;
}
export interface RecetaModalProps {
  veterinarioId: number;
  onCerrar: () => void;
  // El guardado real (Supabase) se define después; por ahora el padre
  // decide qué hacer con la receta ya armada (loguearla, mostrarla, etc.).
  onGuardar: (receta: NuevaReceta) => void;
}
export interface CitaProximaDueno {
  id: number;
  mascotaId: number;
  mascota: string;
  centro: string;
  dia: string;
  mes: string;
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
}

export interface HistorialRecienteItem {
  id: number;
  mascota: string;
  descripcion: string;
  fecha: string;
}
