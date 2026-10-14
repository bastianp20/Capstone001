import styles from "../../css/InicioVeterinario.module.css";
import { URGENCIA_LABEL } from "../../constants";
import { formatDiaMes, formatFechaCorta } from "../../lib/fechas";
import type { PendientesVeterinarioProps } from "../../interfaces";
import { TarjetaPanel } from "../ui/TarjetaPanel";

// Columna derecha: lo que viene "más adelante".
// Tres bloques en lista vertical, cada uno con su estado vacío.
export const PendientesVeterinario = ({ urgencias, controles, recetas }: PendientesVeterinarioProps) => (
  <TarjetaPanel titulo="Pendientes">
    <div className={styles.bloque}>
      <h3 className={styles.bloqueTitulo}>
        Urgencias por confirmar
        {urgencias.length > 0 && <span className={styles.contador}>{urgencias.length}</span>}
      </h3>
      {urgencias.length === 0 ? (
        <p className={styles.vacioCorto}>Nada por revisar.</p>
      ) : (
        <ul className={styles.lista}>
          {urgencias.map((u) => (
            <li key={u.citaId} className={styles.itemLista}>
              <span>{u.mascota} <span className={styles.itemSecundario}>· IA: {URGENCIA_LABEL[u.urgenciaSugerida]}</span></span>
              <span className={styles.itemSecundario}>{u.fechaHora}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className={styles.bloque}>
      <h3 className={styles.bloqueTitulo}>Controles próximos</h3>
      {controles.length === 0 ? (
        <p className={styles.vacioCorto}>Sin controles esta semana.</p>
      ) : (
        <ul className={styles.lista}>
          {controles.map((c) => (
            <li key={c.recetaId} className={styles.itemLista}>
              <span>{c.mascota}</span>
              <span className={styles.itemSecundario}>{formatDiaMes(c.fecha)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className={styles.bloque}>
      <h3 className={styles.bloqueTitulo}>Últimas recetas</h3>
      {recetas.length === 0 ? (
        <p className={styles.vacioCorto}>Todavía no has emitido recetas.</p>
      ) : (
        <ul className={styles.lista}>
          {recetas.map((r) => (
            <li key={r.id} className={styles.itemLista}>
              <span>{r.mascota}</span>
              <span className={styles.itemSecundario}>{formatFechaCorta(r.creadaEn)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </TarjetaPanel>
);
