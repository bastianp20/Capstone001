import { Iconos, TEXTOS_PROGRESO_PERFIL as T } from "../../constants";
import { useProgresoPerfil } from "../../hooks/useProgresoPerfil";
import type { PasoPerfilVeterinario, ProgresoPerfilProps } from "../../interfaces";
import { TarjetaProgreso } from "../ui/TarjetaProgreso";

const ICONO_PASO = {
  foto: Iconos.perfil,
  telefono: Iconos.telefono,
  especialidades: Iconos.diagnostico,
  colegiado: Iconos.permisos,
  horario: Iconos.horario,
  zona: Iconos.ubicacion,
} as const;

// "Completa tu perfil" en el inicio del veterinario. Desaparece al 100%.
export const ProgresoPerfil = ({ recarga, onCompletar }: ProgresoPerfilProps) => {
  const { progreso, porcentaje, pendientes } = useProgresoPerfil(recarga);
  if (!progreso) return null;
  return (
    <TarjetaProgreso
      titulo={T.titulo}
      porcentaje={porcentaje}
      textoPorcentaje={T.porcentaje(porcentaje)}
      ayuda={T.ayuda}
      pendientes={pendientes.map((paso) => ({ id: paso, texto: T.pasos[paso], Icono: ICONO_PASO[paso] }))}
      onElegir={(id) => onCompletar(id as PasoPerfilVeterinario)}
    />
  );
};
