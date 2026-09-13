import type { CSSProperties } from "react";
import type {EstadoCita, UrgenciaCita} from '../src/interfaces'; 
import {
  Menu, Search, Bell, User, UserCircle, LogOut, Settings, Calendar, Filter, ChevronDown, ChevronRight, X, Plus, MoreVertical, Home,
  PawPrint, Heart, CalendarPlus, History, FileText,Stethoscope, Syringe, ClipboardList, ClipboardPlus, Share2, Microscope, Activity,
  Building2, Clock, MapPin, Phone, Users, ShieldCheck, Building, Settings2, AlertTriangle, AlertCircle, Info, Brain, ListOrdered,
  CheckCircle2, XCircle, Clock3, Loader2, Dog, Cat, ShieldPlus, Scissors,
} from 'lucide-react';

export const Colors = {
  bg: "rgb(31, 27, 27)",
  sidebarBg: "#12181f",
  sidebarActive: "#0f8f80",
  sidebarText: "#b8c1cc",
  border: "#e4e6ea",
  text: "#1a1f27",
  textMuted: "#6b7280",
  accent: "#0f8f80",
  accentSoft: "#e3f5f2",
};

export const badgeStyles: Record<string, CSSProperties> = {
  // estado de cita
  confirmada: { background: "#e3edfb", color: "#2452a8" },
  en_curso: { background: "#dff3ea", color: "#177a4f" },
  cancelada: { background: "#fbe4e4", color: "#a4272a" },
  pendiente: { background: "#eceef1", color: "#4b5563" },
  completada: { background: "#dff3ea", color: "#177a4f" },
  // urgencia
  critica: { background: "#e0403f", color: "#ffffff" },
  alta: { background: "#f4a13a", color: "#5a3600" },
  media: { background: "#f0d251", color: "#5a4b00" },
  baja: { background: "#dff3ea", color: "#177a4f" },
};

export const ESTADO_LABEL: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  en_curso: "En curso",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const URGENCIA_LABEL: Record<UrgenciaCita, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Urgente",
  critica: "Crítica",
};

export const Badge = (style: CSSProperties): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  ...style,
});


export const Iconos = {
  // y esto es de caracter general nmas
  menu: Menu,
  buscar: Search,
  notificaciones: Bell,
  usuario: User,
  perfil: UserCircle,
  cerrarSesion: LogOut,
  configuracion: Settings,
  calendario: Calendar,
  filtro: Filter,
  flechaAbajo: ChevronDown,
  flechaDerecha: ChevronRight,
  cerrar: X,
  agregar: Plus,
  opciones: MoreVertical,
  inicio: Home,

  // esto es pa los dueños de mascotas
  huella: PawPrint,
  favoritos: Heart,
  solicitarCita: CalendarPlus,
  historial: History,
  fichaMedica: FileText,

  // esto es pa los veterinarios :P 
  diagnostico: Stethoscope,
  vacuna: Syringe,
  receta: ClipboardList,
  nuevoDiagnostico: ClipboardPlus,
  derivacion: Share2,
  muestra: Microscope,
  signosVitales: Activity,

  // esto es pa los centros 
  centro: Building2,
  horario: Clock,
  ubicacion: MapPin,
  telefono: Phone,

  // para el super admin :p 
  usuarios: Users,
  permisos: ShieldCheck,
  veterinarias: Building,
  configuracionSistema: Settings2,

  // esto es para el sistema de ia y su agrupación por urgencia
  urgenciaAlta: AlertTriangle,
  urgenciaMedia: AlertCircle,
  urgenciaBaja: Info,
  ia: Brain,
  prioridad: ListOrdered,

  // esto es para los estados 
  completado: CheckCircle2,
  cancelado: XCircle,
  pendiente: Clock3,
  cargando: Loader2,

  // esto se usará para el modulo de adopción
  perro: Dog,
  gato: Cat,
  vacunasAlDia: ShieldPlus,
  esterilizado: Scissors,
};