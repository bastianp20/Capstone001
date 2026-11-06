import { useId } from "react";
import { Iconos, PREFIJO_TELEFONO_CL, TEXTOS_DETALLE_SOLICITUD } from "../constants";
import { getSolicitudCentro } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import type { DetalleSolicitudCentroModalProps } from "../interfaces";
import { Boton } from "../components/ui/Boton";
import { DatoFicha } from "../components/veterinario/ficha/DatoFicha";
import styles from "../css/modal/DetalleSolicitudCentroModal.module.css";

const telefono = (numero: number) => `${PREFIJO_TELEFONO_CL} ${numero}`;

// El superadmin revisa todo lo que envió un centro en /solicitar-centro
// y decide: aprobar (crea el centro) o rechazar (abre RechazarModal).
// Solo muestra y avisa: quien lo abre resuelve la solicitud.
export const DetalleSolicitudCentroModal = ({ solicitudId, ocupado, error, onAprobar, onRechazar, onCerrar }: DetalleSolicitudCentroModalProps) => {
  const { datos: s, cargando, error: errorCarga } = useConsulta(() => getSolicitudCentro(solicitudId), [solicitudId]);
  const idTitulo = useId();
  useTeclaEscape(onCerrar, !ocupado);

  return (
    <div className={styles.overlay} onClick={ocupado ? undefined : onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.encabezadoTextos}>
            <span className={styles.etiqueta}>{TEXTOS_DETALLE_SOLICITUD.titulo}</span>
            <h3 id={idTitulo} className={styles.titulo}>{s?.nombreCentro ?? "Solicitud"}</h3>
            {s && <p className={styles.subtitulo}>Recibida el {s.fecha}</p>}
          </div>
          <button type="button" className={styles.cerrar} onClick={onCerrar} disabled={ocupado} aria-label="Cerrar">
            <Iconos.cerrar size={20} />
          </button>
        </header>

        <div className={styles.cuerpo}>
          {cargando && <p className={styles.estado}>Cargando solicitud…</p>}
          {errorCarga && <p className={styles.estado}>{errorCarga}</p>}

          {s && (
            <>
              <section className={styles.seccion}>
                <h4 className={styles.seccionTitulo}>{TEXTOS_DETALLE_SOLICITUD.seccionCentro}</h4>
                <div className={styles.grilla}>
                  <div className={styles.completa}>
                    <DatoFicha etiqueta="Dirección" valor={`${s.direccion}, ${s.comuna}`} />
                  </div>
                  <DatoFicha etiqueta="Teléfono" valor={<a className={styles.enlace} href={`tel:+56${s.telefonoCentro}`}>{telefono(s.telefonoCentro)}</a>} />
                  <DatoFicha etiqueta="Sitio web o redes" valor={s.sitioWeb} />
                  <div className={styles.completa}>
                    <DatoFicha etiqueta="Especialidades" valor={s.especialidades.join(", ")} />
                  </div>
                </div>
              </section>

              <section className={styles.seccion}>
                <h4 className={styles.seccionTitulo}>{TEXTOS_DETALLE_SOLICITUD.seccionResponsable}</h4>
                <div className={styles.grilla}>
                  <DatoFicha etiqueta="Nombre" valor={s.nombreResponsable} />
                  <DatoFicha etiqueta="Cargo" valor={s.cargo} />
                  <DatoFicha etiqueta="Correo" valor={<a className={styles.enlace} href={`mailto:${s.correo}`}>{s.correo}</a>} />
                  <DatoFicha etiqueta="Teléfono" valor={<a className={styles.enlace} href={`tel:+56${s.telefonoResponsable}`}>{telefono(s.telefonoResponsable)}</a>} />
                </div>
              </section>

              {s.mensaje && (
                <section className={styles.seccion}>
                  <h4 className={styles.seccionTitulo}>{TEXTOS_DETALLE_SOLICITUD.seccionMensaje}</h4>
                  <p className={styles.mensaje}>{s.mensaje}</p>
                </section>
              )}

              <p className={styles.ayuda}>{TEXTOS_DETALLE_SOLICITUD.ayudaAprobar}</p>
              {error && <div className={styles.error} role="alert">{error}</div>}
            </>
          )}
        </div>

        {s && (
          <footer className={styles.pie}>
            <Boton variante="secundario" onClick={onRechazar} disabled={ocupado}>
              {TEXTOS_DETALLE_SOLICITUD.rechazar}
            </Boton>
            <Boton onClick={onAprobar} cargando={ocupado} icono={<Iconos.check size={16} />}>
              {ocupado ? TEXTOS_DETALLE_SOLICITUD.aprobando : TEXTOS_DETALLE_SOLICITUD.aprobar}
            </Boton>
          </footer>
        )}
      </div>
    </div>
  );
};
