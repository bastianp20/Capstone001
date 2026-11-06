import { TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import type { TablaRefugiosAdminProps } from "../../../../interfaces";
import { FilaRefugioAdmin } from "./FilaRefugioAdmin";

/** Tabla limpia de refugios: una fila por refugio. */
export const TablaRefugiosAdmin = ({ refugios, seleccionadoId, ...acciones }: TablaRefugiosAdminProps) => (
  <div className="ra-tabla-marco">
    <table className="ra-tabla">
      <thead>
        <tr>
          {T.columnas.map((c, i) => (
            <th key={i} scope="col">
              {c || <span className="ap-solo-lector">{T.acciones}</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {refugios.map((r) => (
          <FilaRefugioAdmin key={r.id} refugio={r} seleccionado={r.id === seleccionadoId} {...acciones} />
        ))}
      </tbody>
    </table>
  </div>
);
