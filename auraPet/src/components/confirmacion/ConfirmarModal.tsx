import { useCallback, useId } from "react";
import { Iconos, TEXTOS_CONFIRMACION as T } from "../../constants";
import { useTeclaEscape } from "../../hooks/useTeclaEscape";
import type { ConfirmarModalProps } from "../../interfaces";
import styles from "../../css/confirmacion/ConfirmarModal.module.css";

// Modal de confirmación: título, mensaje, lo que se afecta y, si borra algo
// para siempre, un aviso de "se eliminará de forma permanente". El foco parte
// en "Cancelar" para que un Enter apurado no borre nada.
export const ConfirmarModal = ({ opciones, onResponder }: ConfirmarModalProps) => {
  const id = useId();
  const { tipo, titulo, mensaje, detalle, permanente, textoConfirmar, textoCancelar = T.cancelar } = opciones;
  const cancelar = useCallback(() => onResponder(false), [onResponder]);
  useTeclaEscape(cancelar);

  return (
    <div className={styles.overlay} onClick={cancelar}>
      <div className={`${styles.modal} ${styles[tipo]}`} role="alertdialog" aria-modal="true"
        aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-mensaje`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cuerpo}>
          <span className={styles.icono} aria-hidden="true">
            {tipo === "peligro" ? <Iconos.eliminar size={22} /> : <Iconos.advertencia size={22} />}
          </span>
          <div className={styles.textos}>
            <h3 id={`${id}-titulo`} className={styles.titulo}>{titulo}</h3>
            <p id={`${id}-mensaje`} className={styles.mensaje}>{mensaje}</p>
            {detalle && <p className={styles.detalle} title={detalle}>{detalle}</p>}
            {permanente && (
              <p className={styles.permanente} role="note">
                <Iconos.advertencia size={16} aria-hidden="true" /> {T.permanente}
              </p>
            )}
          </div>
          <button type="button" className={styles.cerrar} onClick={cancelar} aria-label={T.cerrar}>
            <Iconos.cerrar size={18} />
          </button>
        </div>

        <footer className={styles.pie}>
          <button type="button" className={styles.botonCancelar} onClick={cancelar} autoFocus>
            {textoCancelar}
          </button>
          <button type="button" className={styles.botonConfirmar} onClick={() => onResponder(true)}>
            {textoConfirmar}
          </button>
        </footer>
      </div>
    </div>
  );
};
