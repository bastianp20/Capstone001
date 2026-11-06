import { ESTADOS_UCI, TEXTOS_URGENCIAS as T } from "../../constants";
import { estadoUciVigente, haceCuanto } from "../../lib/estadoUci";
import type { EtiquetaEstadoUciProps } from "../../interfaces";

// "UCI: Disponible · hace 10 min", o "Sin información reciente" si nadie la
// actualiza hace horas. Se reutiliza donde haga falta mostrar la UCI.
export const EtiquetaEstadoUci = ({ estado, ahora }: EtiquetaEstadoUciProps) => {
  if (!estadoUciVigente(estado.actualizadoEn, ahora)) {
    return <span className="urg-etiqueta urg-uci-sin-info">{T.uci}: {T.sinInfoReciente}</span>;
  }
  const texto = ESTADOS_UCI.find((o) => o.valor === estado.estado)?.texto ?? estado.estado;
  return (
    <span className={`urg-etiqueta urg-uci-${estado.estado}`}>
      {T.uci}: {texto} · {haceCuanto(estado.actualizadoEn, ahora)}
    </span>
  );
};
