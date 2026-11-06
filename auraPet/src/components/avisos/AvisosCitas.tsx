import { Iconos, TEXTOS_AVISOS_CITAS as T } from "../../constants";
import { useAvisosCitas } from "../../hooks/useAvisosCitas";
import { formatDiaHora } from "../../lib/fechas";
import type { AvisosCitasProps } from "../../interfaces";
import styles from "../../css/ui/AvisosCitas.module.css";

// Avisos sin leer de cambios de hora hechos por un veterinario (reagendó o
// canceló). Va arriba del panel del dueño y del resumen del centro. Si no hay
// avisos, no muestra nada.
export const AvisosCitas = ({ centroId }: AvisosCitasProps) => {
  const { avisos, ocupado, marcarLeido, marcarTodos } = useAvisosCitas(centroId);
  if (avisos.length === 0) return null;

  return (
    <section className={styles.avisos} aria-label={T.titulo}>
      <div className={styles.encabezado}>
        <h2 className={styles.titulo}>
          <Iconos.notificaciones size={16} aria-hidden="true" /> {T.titulo}
          <span className={styles.contador}>{avisos.length}</span>
        </h2>
        {avisos.length > 1 && (
          <button type="button" className={styles.link} onClick={marcarTodos} disabled={ocupado}>
            {T.marcarTodos}
          </button>
        )}
      </div>

      <ul className={styles.lista}>
        {avisos.map((a) => (
          <li key={a.id} className={`${styles.aviso} ${a.tipo === "cita_cancelada" ? styles.cancelada : styles.reagendada}`}>
            <div className={styles.cuerpo}>
              <strong className={styles.avisoTitulo}>{a.titulo}</strong>
              {a.fechaAnterior && (
                <p className={styles.fechas}>
                  <span className={styles.anterior}>{formatDiaHora(a.fechaAnterior)}</span>
                  {a.fechaNueva && (
                    <>
                      <Iconos.siguiente size={13} aria-hidden="true" />
                      <span className={styles.nueva}>{formatDiaHora(a.fechaNueva)}</span>
                    </>
                  )}
                </p>
              )}
              <p className={styles.mensaje}>{a.mensaje}</p>
            </div>
            <button
              type="button"
              className={styles.cerrar}
              onClick={() => marcarLeido(a.id)}
              disabled={ocupado}
              aria-label={T.marcarLeido}
              title={T.marcarLeido}
            >
              <Iconos.cerrar size={15} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
