import styles from "../../css/modal/RecetaModal.module.css";
import { COLUMNAS_MEDICAMENTO, Iconos } from "../../constants";
import type { FilaMedicamentoProps } from "../../interfaces";

const iconos = Iconos;

// Una fila de la tabla: un input por columna (definidas en COLUMNAS_MEDICAMENTO)
// y el botón de eliminar al final.
export const FilaMedicamento = ({ medicamento, numero, puedeEliminar, onCambiar, onEliminar }: FilaMedicamentoProps) => (
  <div className={styles.filaTabla}>
    {COLUMNAS_MEDICAMENTO.map((col) => (
      <input
        key={col.campo}
        className={styles.input}
        placeholder={col.placeholder}
        value={medicamento[col.campo]}
        onChange={(e) => onCambiar(col.campo, e.target.value)}
        aria-label={`${col.titulo} del medicamento ${numero}`}
      />
    ))}
    <button
      type="button"
      className={styles.botonEliminar}
      onClick={onEliminar}
      disabled={!puedeEliminar}
      aria-label={`Eliminar medicamento ${numero}`}
      title={puedeEliminar ? "Eliminar" : "La receta necesita al menos un medicamento"}
    >
      <iconos.eliminar size={16} />
    </button>
  </div>
);
