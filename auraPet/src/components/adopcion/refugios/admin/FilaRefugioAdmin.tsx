import { COLOR_RECEPCION_REFUGIO, RECEPCION_REFUGIO_OPCIONES, TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import type { FilaRefugioAdminProps } from "../../../../interfaces";
import { iniciales, ocupacionRefugio } from "../../../../lib/publicacionesAdopcion";
import { AnilloProgreso } from "../../comun/AnilloProgreso";
import { ChipEstadoRefugio } from "../gestion/ChipEstadoRefugio";
import { IconosEspecies } from "../gestion/IconosEspecies";
import { LogoRefugio } from "../gestion/LogoRefugio";
import { MenuAccionesRefugio } from "./MenuAccionesRefugio";

const MAX_AVATARES = 3;

/** Una fila de la tabla de refugios (clic = abrir el detalle). */
export const FilaRefugioAdmin = ({ refugio: r, seleccionado, onVer, onEditar, onVerAnimales, onVerificar }: FilaRefugioAdminProps) => {
  const recepcion = RECEPCION_REFUGIO_OPCIONES.find((o) => o.valor === r.recibe);
  const extra = r.administradores.length - MAX_AVATARES;
  return (
    <tr className={`ra-fila ${seleccionado ? "ra-fila-activa" : ""}`} onClick={() => onVer(r)}>
      <td>
        <div className="ra-celda-refugio">
          <LogoRefugio nombre={r.nombre} logoUrl={r.logoUrl} />
          <div>
            <button type="button" className="ra-nombre" onClick={(e) => { e.stopPropagation(); onVer(r); }}>
              {r.nombre}
            </button>
            {r.esPrueba && <span className="ap-chip ap-chip-prueba">{T.prueba}</span>}
            <small>
              {r.comuna}, {r.region}
            </small>
          </div>
        </div>
      </td>
      <td>
        <ChipEstadoRefugio estado={r.estado} />
      </td>
      <td>
        <span className="ra-recepcion">
          <span className="ra-punto" style={{ background: COLOR_RECEPCION_REFUGIO[r.recibe] }} aria-hidden />
          {recepcion?.titulo}
        </span>
      </td>
      <td>
        <span className="ra-cupos">
          <AnilloProgreso porcentaje={ocupacionRefugio(r)} tamano={26} grosor={4} etiqueta="" color={COLOR_RECEPCION_REFUGIO[r.recibe]} />
          {r.cuposOcupados}/{r.cuposTotales}
        </span>
      </td>
      <td>
        <IconosEspecies especies={r.especies} />
      </td>
      <td className="ra-numero">{r.enAdopcion}</td>
      <td>
        {r.administradores.length ? (
          <span className="ra-avatares" title={r.administradores.map((a) => a.nombre).join(", ")}>
            {r.administradores.slice(0, MAX_AVATARES).map((a) => (
              <span key={a.id} className="ap-avatar ap-avatar-chico">
                {iniciales(a.nombre)}
              </span>
            ))}
            {extra > 0 && <small>+{extra}</small>}
          </span>
        ) : (
          <small className="ap-suave">{T.sinAdmins}</small>
        )}
      </td>
      <td>
        <MenuAccionesRefugio
          refugio={r}
          onVer={() => onVer(r)}
          onEditar={() => onEditar(r)}
          onVerAnimales={() => onVerAnimales(r)}
          onVerificar={(aprobar) => onVerificar(r, aprobar)}
        />
      </td>
    </tr>
  );
};
