import { Iconos } from "../../constants";
import type { PaginacionProps } from "../../interfaces";
import styles from "../../css/ui/Paginacion.module.css";

// "Mostrando 21–40 de 134" con botones de anterior / siguiente.
export const Paginacion = ({ pagina, porPagina, total, onCambiar }: PaginacionProps) => {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  if (total === 0) return null;
  const desde = (pagina - 1) * porPagina + 1;
  const hasta = Math.min(total, pagina * porPagina);

  return (
    <nav className={styles.paginacion} aria-label="Paginación">
      <span className={styles.rango}>Mostrando {desde}–{hasta} de {total}</span>
      <div className={styles.botones}>
        <button type="button" className={styles.boton} onClick={() => onCambiar(pagina - 1)} disabled={pagina <= 1} aria-label="Página anterior">
          <Iconos.volver size={16} />
        </button>
        <span className={styles.pagina}>{pagina} / {totalPaginas}</span>
        <button type="button" className={styles.boton} onClick={() => onCambiar(pagina + 1)} disabled={pagina >= totalPaginas} aria-label="Página siguiente">
          <Iconos.verMas size={16} />
        </button>
      </div>
    </nav>
  );
};
