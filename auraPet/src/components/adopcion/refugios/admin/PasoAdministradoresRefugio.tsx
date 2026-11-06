import { Info } from "lucide-react";
import { TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import type { PasoAdministradoresRefugioProps } from "../../../../interfaces";
import { BuscadorCuentas } from "../gestion/BuscadorCuentas";
import { ListaAdministradores } from "../gestion/ListaAdministradores";

/** Paso 3: quiénes administran el refugio (mismo tipo de cuenta que el refugio). */
export const PasoAdministradoresRefugio = ({ datos, errores, onAgregar, onQuitar }: PasoAdministradoresRefugioProps) => (
  <div className="ra-paso">
    <BuscadorCuentas excluir={datos.administradores.map((a) => a.id)} refugioDePrueba={datos.esPrueba} onAgregar={onAgregar} />
    <h3 className="ra-paso-subtitulo">{T.administradores(datos.administradores.length)}</h3>
    {datos.administradores.length ? (
      <ListaAdministradores administradores={datos.administradores} onQuitar={onQuitar} />
    ) : (
      <p className="ap-suave">{T.sinAdministradores}</p>
    )}
    {errores.administradores && <p className="adopta-campo-error">{errores.administradores}</p>}
    <p className="ra-nota">
      <Info size={16} aria-hidden /> {T.ayudaAdmins}
    </p>
  </div>
);
