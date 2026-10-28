import { Ban, BadgeCheck, Ellipsis, Eye, PawPrint, Pencil } from "lucide-react";
import { TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import { useMenuEmergente } from "../../../../hooks/useMenuEmergente";
import type { MenuAccionesRefugioProps } from "../../../../interfaces";

/** Botón "⋯" de cada fila con sus acciones. */
export const MenuAccionesRefugio = ({ refugio, onVer, onEditar, onVerAnimales, onVerificar }: MenuAccionesRefugioProps) => {
  const { abierto, contenedor, alternar, cerrar } = useMenuEmergente<HTMLDivElement>();
  const elegir = (accion: () => void) => () => {
    cerrar();
    accion();
  };
  return (
    <div className="ra-menu" ref={contenedor} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="ap-icono-btn ra-menu-boton" aria-haspopup="menu" aria-expanded={abierto} aria-label={`${T.acciones}: ${refugio.nombre}`} onClick={alternar}>
        <Ellipsis size={18} />
      </button>
      {abierto && (
        <div className="ra-menu-lista" role="menu">
          <button type="button" role="menuitem" onClick={elegir(onVer)}>
            <Eye size={16} aria-hidden /> {T.verDetalle}
          </button>
          <button type="button" role="menuitem" onClick={elegir(onEditar)}>
            <Pencil size={16} aria-hidden /> {T.editar}
          </button>
          <button type="button" role="menuitem" onClick={elegir(onVerAnimales)} disabled={!refugio.enAdopcion}>
            <PawPrint size={16} aria-hidden /> {T.verAnimales}
          </button>
          {refugio.estado !== "aprobado" && (
            <button type="button" role="menuitem" onClick={elegir(() => onVerificar(true))}>
              <BadgeCheck size={16} aria-hidden /> {refugio.estado === "pendiente" ? T.aprobar : T.volverAVerificar}
            </button>
          )}
          {refugio.estado !== "rechazado" && (
            <button type="button" role="menuitem" className="ra-menu-peligro" onClick={elegir(() => onVerificar(false))}>
              <Ban size={16} aria-hidden /> {T.rechazar}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
