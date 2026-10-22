import styles from "../../css/DuenoSecciones.module.css";
import { COLUMNAS_MEDICAMENTO } from "../../constants";
import type { TarjetaRecetaProps } from "../../interfaces";
import { BotonRecetaPdf } from "../pdf/BotonRecetaPdf";

// Una receta como la ve el dueño: medicamentos, indicaciones y próximo control.
export const TarjetaReceta = ({ receta }: TarjetaRecetaProps) => (
  <div className={styles.receta}>
    <div className={styles.registroCabecera}>
      <strong>{receta.mascota}</strong>
      <span className={styles.textoSuave}>{receta.fecha}</span>
    </div>

    {receta.medicamentos.length > 0 && (
      <table className={styles.tablaMedicamentos}>
        <thead>
          {/* Mismas columnas que el modal de receta del veterinario */}
          <tr>{COLUMNAS_MEDICAMENTO.map((col) => <th key={col.campo}>{col.titulo}</th>)}</tr>
        </thead>
        <tbody>
          {receta.medicamentos.map((m, i) => (
            <tr key={i}>{COLUMNAS_MEDICAMENTO.map((col) => <td key={col.campo}>{m[col.campo]}</td>)}</tr>
          ))}
        </tbody>
      </table>
    )}

    {receta.indicaciones && <p className={styles.indicacionesReceta}>{receta.indicaciones}</p>}
    {receta.proximoControl && <span className={styles.textoSuave}>Próximo control: {receta.proximoControl}</span>}
    <div className={styles.accionesReceta}>
      <BotonRecetaPdf mascotaId={receta.mascotaId} recetaId={receta.id} />
    </div>
  </div>
);
