import { TEXTOS_URGENCIAS_CENTRO as T } from "../../../constants";
import { useUrgenciasCentro } from "../../../hooks/useUrgenciasCentro";
import type { TarjetaDeCentroProps } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import { Aviso } from "../../ui/Aviso";
import { TarjetaCentro } from "../TarjetaCentro";
import { PanelEstadoUci } from "./PanelEstadoUci";
import styles from "../../../css/centroAdmin/UrgenciasCentro.module.css";

// Urgencias y UCI del centro: lo fijo (casillas) y, si tiene UCI, su estado en vivo.
export const TarjetaUrgenciasCentro = ({ centro, onGuardado }: TarjetaDeCentroProps) => {
  const u = useUrgenciasCentro(centro, onGuardado);

  return (
    <TarjetaCentro titulo={T.titulo}>
      <p className={styles.ayuda}>{T.ayuda}</p>
      <div className={styles.casillas}>
        <label className={styles.casilla}>
          <input type="checkbox" checked={u.tieneUci} disabled={u.ocupado} onChange={(e) => u.setTieneUci(e.target.checked)} />
          {T.tieneUci}
        </label>
        <label className={styles.casilla}>
          <input type="checkbox" checked={u.urgencias247} disabled={u.ocupado} onChange={(e) => u.setUrgencias247(e.target.checked)} />
          {T.urgencias247}
        </label>
      </div>
      {u.error && <Aviso tipo="error" texto={u.error} />}
      {u.guardado && <Aviso tipo="ok" texto={T.guardado} />}
      {u.cambiado && (
        <div className={styles.pie}>
          <Boton onClick={u.guardar} cargando={u.ocupado}>{T.guardar}</Boton>
        </div>
      )}

      {/* El estado en vivo aparece cuando ya quedó guardado que tiene UCI */}
      {centro.tieneUci && (
        <div className={styles.motivo}>
          <PanelEstadoUci centroId={centro.id} />
        </div>
      )}
    </TarjetaCentro>
  );
};
