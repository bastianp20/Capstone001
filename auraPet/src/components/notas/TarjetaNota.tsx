import { Iconos, TEXTOS_NOTAS as T } from "../../constants";
import type { TarjetaNotaProps } from "../../interfaces";
import styles from "../../css/notas/Notas.module.css";

// Una nota: título, texto, fecha de edición y acciones (fijar, editar, borrar).
export const TarjetaNota = ({ nota, ocupado, onEditar, onFijar, onBorrar }: TarjetaNotaProps) => (
  <article className={`${styles.nota} ${styles[nota.color]}`}>
    <header className={styles.notaCabecera}>
      <h3 className={styles.notaTitulo}>{nota.titulo}</h3>
      <button type="button" className={`${styles.icono} ${nota.fijada ? styles.iconoActivo : ""}`}
        onClick={onFijar} disabled={ocupado} aria-pressed={nota.fijada}
        aria-label={nota.fijada ? T.desfijar : T.fijar} title={nota.fijada ? T.desfijar : T.fijar}>
        {nota.fijada ? <Iconos.fijar size={15} /> : <Iconos.desfijar size={15} />}
      </button>
    </header>
    {nota.contenido && <p className={styles.notaTexto}>{nota.contenido}</p>}
    <footer className={styles.notaPie}>
      <span className={styles.notaFecha}>{T.editada(nota.actualizada)}</span>
      <div className={styles.notaAcciones}>
        <button type="button" className={styles.icono} onClick={onEditar} disabled={ocupado} aria-label={T.editar} title={T.editar}>
          <Iconos.editar size={15} />
        </button>
        <button type="button" className={`${styles.icono} ${styles.iconoPeligro}`} onClick={onBorrar} disabled={ocupado}
          aria-label={T.borrar} title={T.borrar}>
          <Iconos.eliminar size={15} />
        </button>
      </div>
    </footer>
  </article>
);
