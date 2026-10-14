import styles from "../../css/modal/RecetaModal.module.css";
import { COLUMNAS_MEDICAMENTO, Iconos } from "../../constants";
import type { TablaMedicamentosProps } from "../../interfaces";
import { FilaMedicamento } from "./FilaMedicamento";

const iconos = Iconos;

// Tabla editable de medicamentos: encabezado, una FilaMedicamento por
// medicamento y el botón para agregar otro. No guarda estado propio:
// todo lo maneja el modal y llega por props.
export const TablaMedicamentos = ({ medicamentos, onCambiar, onAgregar, onEliminar }: TablaMedicamentosProps) => (
  <>
    {/* Encabezado: mismas columnas que las filas (en celular se oculta) */}
    <div className={`${styles.filaTabla} ${styles.encabezadoTabla}`}>
      {COLUMNAS_MEDICAMENTO.map((col) => (
        <span key={col.campo}>{col.titulo}</span>
      ))}
      <span />
    </div>

    <div className={styles.filasMedicamentos}>
      {medicamentos.map((m, i) => (
        <FilaMedicamento
          // El índice sirve de key porque las filas no se reordenan
          key={i}
          medicamento={m}
          numero={i + 1}
          puedeEliminar={medicamentos.length > 1}
          onCambiar={(campo, valor) => onCambiar(i, campo, valor)}
          onEliminar={() => onEliminar(i)}
        />
      ))}
    </div>

    <button type="button" className={styles.botonAgregar} onClick={onAgregar}>
      <iconos.agregar size={15} />
      Agregar medicamento
    </button>
  </>
);
