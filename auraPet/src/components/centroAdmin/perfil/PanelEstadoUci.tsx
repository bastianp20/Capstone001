import { ESTADOS_UCI, HORAS_VIGENCIA_UCI, MOTIVOS_UCI, TEXTOS_URGENCIAS_CENTRO as T } from "../../../constants";
import { usePanelEstadoUci } from "../../../hooks/usePanelEstadoUci";
import type { PanelEstadoUciProps } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import { Aviso } from "../../ui/Aviso";
import styles from "../../../css/centroAdmin/UrgenciasCentro.module.css";

// Estado de la UCI en vivo: cuatro botones grandes (un toque y queda) y, si
// no está operativa, el motivo. Muestra hace cuánto se actualizó.
export const PanelEstadoUci = ({ centroId, compacto = false }: PanelEstadoUciProps) => {
  const p = usePanelEstadoUci(centroId);
  const actual = p.estado?.estado ?? null;

  return (
    <div>
      <div className={styles.estadoCabecera}>
        <span className={styles.etiqueta}>{T.estadoTitulo}</span>
        <span className={styles.enVivo}>{T.enVivo}</span>
      </div>
      {!compacto && <p className={styles.ayuda}>{T.estadoAyuda}</p>}

      <div className={styles.estados} role="group" aria-label={T.estadoTitulo}>
        {ESTADOS_UCI.map((o) => (
          <button key={o.valor} type="button" disabled={p.ocupado || p.cargando} aria-pressed={actual === o.valor}
            className={`${styles.estado} ${styles[o.valor]} ${actual === o.valor ? styles.estadoActivo : ""}`}
            onClick={() => p.elegir(o.valor)}>
            {o.texto}
            <small>{o.ayuda}</small>
          </button>
        ))}
      </div>

      {p.pidiendoMotivo && (
        <div className={styles.motivo}>
          <span className={styles.etiqueta}>{T.motivo}</span>
          <div className={styles.chips} role="group" aria-label={T.motivo}>
            {MOTIVOS_UCI.map((m) => (
              <button key={m.valor} type="button" aria-pressed={p.motivo === m.valor} disabled={p.ocupado}
                className={`${styles.chip} ${p.motivo === m.valor ? styles.chipActivo : ""}`}
                onClick={() => p.setMotivo(m.valor)}>
                {m.texto}
              </button>
            ))}
          </div>
          <div className={styles.filaDetalle}>
            <input className={styles.input} value={p.detalle} maxLength={200} placeholder={T.detalle} aria-label={T.detalle}
              onChange={(e) => p.setDetalle(e.target.value)} disabled={p.ocupado} />
            <Boton onClick={p.guardarMotivo} cargando={p.ocupado}>{T.guardarMotivo}</Boton>
          </div>
        </div>
      )}

      {p.error && <Aviso tipo="error" texto={p.error} />}
      {!p.cargando && !p.estado && <p className={styles.actualizado}>{T.sinActualizar}</p>}
      {p.estado && p.vigente && <p className={styles.actualizado}>{T.actualizado(p.hace ?? "")}</p>}
      {p.estado && !p.vigente && <p className={styles.desactualizado}>{T.desactualizado(HORAS_VIGENCIA_UCI)}</p>}
    </div>
  );
};
