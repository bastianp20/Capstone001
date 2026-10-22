import { useId } from "react";
import { Iconos, TEXTOS_NOTAS as T } from "../constants";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import type { NotasModalProps } from "../interfaces";
import { PanelNotas } from "../components/notas/PanelNotas";
import styles from "../css/modal/FichaPacienteModal.module.css";

// Notas personales del veterinario, en un modal (mismo marco que la ficha).
export const NotasModal = ({ onCerrar }: NotasModalProps) => {
  const idTitulo = useId();
  useTeclaEscape(onCerrar);

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.encabezadoTextos}>
            <h3 id={idTitulo} className={styles.titulo}>{T.titulo}</h3>
          </div>
          <button type="button" className={styles.botonIcono} onClick={onCerrar} aria-label="Cerrar">
            <Iconos.cerrar size={20} />
          </button>
        </header>
        <div className={styles.cuerpo}>
          <PanelNotas descripcion={T.descripcionVeterinario} />
        </div>
      </div>
    </div>
  );
};
