import styles from "../../css/ui/Panel.module.css";
import { Iconos } from "../../constants";
import type { BarraFiltrosProps } from "../../interfaces";

const iconos = Iconos;

// Buscador + chips de filtro. Se usa junto con el hook useFiltro:
//   <BarraFiltros busqueda={busqueda} onBuscar={setBusqueda}
//                 opciones={FILTROS_USUARIOS} filtro={filtro} onFiltro={setFiltro}
//                 cantidad={cantidad} placeholder="Buscar…" />
export const BarraFiltros = <F extends string>({
  busqueda, onBuscar, placeholder, opciones, filtro, onFiltro, cantidad,
}: BarraFiltrosProps<F>) => (
  <div className={styles.barraFiltros}>
    <div className={styles.buscador}>
      <iconos.buscar size={15} className={styles.buscadorIcono} />
      <input
        type="search"
        placeholder={placeholder}
        value={busqueda}
        onChange={(e) => onBuscar(e.target.value)}
        aria-label={placeholder}
      />
    </div>

    {opciones.map((op) => (
      <button
        key={op.valor}
        type="button"
        className={filtro === op.valor ? styles.chipFiltroActivo : styles.chipFiltro}
        onClick={() => onFiltro(op.valor)}
      >
        {op.texto}
        {cantidad && <span className={styles.chipCantidad}>{cantidad(op.valor)}</span>}
      </button>
    ))}
  </div>
);
