import { Iconos, TEXTOS_PROGRESO_CENTRO as T } from "../../../constants";
import { useProgresoPerfilCentro } from "../../../hooks/useProgresoPerfilCentro";
import type { PasoPerfilCentro, ProgresoPerfilCentroProps } from "../../../interfaces";
import { TarjetaProgreso } from "../../ui/TarjetaProgreso";

const ICONO_PASO = {
  telefono: Iconos.telefono,
  horario: Iconos.horario,
  especialidades: Iconos.diagnostico,
  equipo: Iconos.usuarios,
  urgencias: Iconos.urgenciaAlta,
} as const;

// "Completa el perfil del centro" en el Resumen. El equipo se gestiona en
// "Equipo"; todo lo demás, en "Mi centro". Desaparece al 100%.
export const ProgresoPerfilCentro = ({ centroId, recarga, onIrA }: ProgresoPerfilCentroProps) => {
  const { progreso, pendientes, porcentaje } = useProgresoPerfilCentro(centroId, recarga);
  if (!progreso) return null;
  return (
    <TarjetaProgreso
      titulo={T.titulo}
      porcentaje={porcentaje}
      textoPorcentaje={T.porcentaje(porcentaje)}
      ayuda={T.ayuda}
      pendientes={pendientes.map((paso) => ({ id: paso, texto: T.pasos[paso], Icono: ICONO_PASO[paso] }))}
      onElegir={(id) => onIrA((id as PasoPerfilCentro) === "equipo" ? "equipo" : "centro")}
    />
  );
};
