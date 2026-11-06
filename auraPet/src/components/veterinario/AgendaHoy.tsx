import styles from "../../css/InicioVeterinario.module.css";
import { Badge, badgeStyles, ESTADO_LABEL, Iconos } from "../../constants";
import type { AgendaHoyProps } from "../../interfaces";
import { TarjetaPanel } from "../ui/TarjetaPanel";
import { EstadoVacio } from "../ui/EstadoVacio";

const iconos = Iconos;

// Las citas de hoy en orden de hora. La "próxima cita" va resaltada.
export const AgendaHoy = ({ citas, destacadaId }: AgendaHoyProps) => (
  <TarjetaPanel titulo="Agenda de hoy">
    {citas.length === 0 ? (
      <EstadoVacio icono={<iconos.calendario size={22} />} texto="No tienes citas agendadas para hoy." />
    ) : (
      <div className={styles.agenda}>
        {citas.map((c) => (
          <div key={c.id} className={`${styles.filaAgenda} ${c.id === destacadaId ? styles.filaDestacada : ""}`}>
            <span className={styles.hora}>{c.hora}</span>
            <span className={styles.textoCorto}>
              <strong>{c.mascota}</strong> · {c.motivo}
            </span>
            <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
          </div>
        ))}
      </div>
    )}
  </TarjetaPanel>
);
