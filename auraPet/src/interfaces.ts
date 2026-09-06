
export type TipoSolicitud = "veterinario" | "centro";
export type UrgenciaCita = "baja" | "media" | "alta" | "critica";
export type EstadoCita = "pendiente" | "confirmada" | "en_curso" | "completada" | "cancelada";

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
