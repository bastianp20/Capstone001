import { useCallback, useId, useState } from "react";
import { Iconos, MAX_CARACTERES_RECHAZO, TEXTOS_RECHAZO } from "../constants";
import type { RechazarModalProps } from "../interfaces";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { Spinner } from "../components/ui/Spinner";
import { ContadorCaracteres } from "../components/ui/ContadorCaracteres";
import styles from "../css/modal/RechazarModal.module.css";

// Modal para rechazar algo pidiendo un motivo obligatorio.
// Lo usan el superadmin (solicitudes de verificación) y el veterinario
// (solicitudes de cita). Solo recoge el motivo: quién lo abre decide qué hacer.
export const RechazarModal = ({
  nombreSolicitud,
  onCancelar,
  onConfirmar,
  titulo = TEXTOS_RECHAZO.titulo,
  descripcion = TEXTOS_RECHAZO.descripcion,
  ocupado = false,
}: RechazarModalProps) => {
  const [razon, setRazon] = useState("");
  const id = useId(); // ids únicos para enlazar título, descripción y label (accesibilidad)
  const puedeConfirmar = razon.trim().length > 0 && !ocupado;

  // Mientras guarda no se puede cerrar (ni con Escape, ni con el fondo, ni con la X)
  const cancelar = useCallback(() => {
    if (!ocupado) onCancelar();
  }, [ocupado, onCancelar]);
  useTeclaEscape(cancelar, !ocupado);

  const confirmar = () => {
    if (puedeConfirmar) onConfirmar(razon.trim());
  };

  return (
    <div className={styles.overlay} onClick={cancelar}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-descripcion`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <Iconos.advertencia size={24} className={styles.iconoAdvertencia} aria-hidden="true" />
          <div className={styles.encabezadoTextos}>
            <h3 id={`${id}-titulo`} className={styles.titulo}>{titulo}</h3>
            <p className={styles.subtitulo} title={nombreSolicitud}>{nombreSolicitud}</p>
          </div>
          <button
            type="button"
            className={styles.botonCerrar}
            onClick={cancelar}
            disabled={ocupado}
            aria-label={TEXTOS_RECHAZO.cerrar}
          >
            <Iconos.cerrar size={20} />
          </button>
        </header>

        <div className={styles.cuerpo}>
          <p id={`${id}-descripcion`} className={styles.descripcion}>{descripcion}</p>

          <label htmlFor={`${id}-razon`} className={styles.etiqueta}>
            {TEXTOS_RECHAZO.etiqueta}
            <span className={styles.requerido} aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${id}-razon`}
            className={styles.textarea}
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            rows={4}
            maxLength={MAX_CARACTERES_RECHAZO}
            placeholder={TEXTOS_RECHAZO.placeholder}
            disabled={ocupado}
            required
            autoFocus
          />
          <ContadorCaracteres actual={razon.length} maximo={MAX_CARACTERES_RECHAZO} />
        </div>

        <footer className={styles.pie}>
          <button
            type="button"
            className={`${styles.boton} ${styles.botonSecundario}`}
            onClick={cancelar}
            disabled={ocupado}
          >
            {TEXTOS_RECHAZO.cancelar}
          </button>
          <button
            type="button"
            className={`${styles.boton} ${styles.botonPeligro} ${ocupado ? styles.botonPeligroCargando : ""}`}
            onClick={confirmar}
            disabled={!puedeConfirmar}
            aria-busy={ocupado}
          >
            {ocupado && <Spinner />}
            {ocupado ? TEXTOS_RECHAZO.procesando : TEXTOS_RECHAZO.confirmar}
          </button>
        </footer>
      </div>
    </div>
  );
};
