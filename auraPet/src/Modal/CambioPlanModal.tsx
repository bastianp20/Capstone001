import { useId, useState } from "react";
import { BENEFICIO_PLAN, Iconos, MAX_CARACTERES_MENSAJE_PLAN, TEXTOS_SUSCRIPCION } from "../constants";
import { solicitarCambioPlan } from "../Api/postInfo";
import { useAccion } from "../hooks/useAccion";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { precioPlan } from "../lib/suscripcion";
import type { CambioPlanModalProps } from "../interfaces";
import { Boton } from "../components/ui/Boton";
import { ContadorCaracteres } from "../components/ui/ContadorCaracteres";
import styles from "../css/modal/CambioPlanModal.module.css";

const T = TEXTOS_SUSCRIPCION;

// El admin del centro pide cambiar de plan. No hay cobro: la solicitud le
// llega al equipo de AuraPet (solicitar_cambio_plan, migración 24).
export const CambioPlanModal = ({ centroId, plan, onCerrar, onEnviado }: CambioPlanModalProps) => {
  const [mensaje, setMensaje] = useState("");
  const [enviada, setEnviada] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();
  const idTitulo = useId();
  useTeclaEscape(onCerrar, !ocupado);

  const enviar = async () => {
    const ok = await ejecutar(() => solicitarCambioPlan(centroId, plan.id, mensaje), "No se pudo enviar la solicitud.");
    if (ok) {
      setEnviada(true);
      onEnviado();
    }
  };

  return (
    <div className={styles.overlay} onClick={ocupado ? undefined : onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        {enviada ? (
          <div className={styles.exito} role="status">
            <span className={styles.exitoIcono}><Iconos.check size={28} aria-hidden="true" /></span>
            <h3 id={idTitulo}>{T.modalExitoTitulo}</h3>
            <p>{T.modalExitoTexto}</p>
            <Boton onClick={onCerrar}>{T.modalListo}</Boton>
          </div>
        ) : (
          <>
            <header className={styles.header}>
              <h3 id={idTitulo}>{T.modalTitulo(plan.nombre)}</h3>
              <button type="button" className={styles.cerrar} onClick={onCerrar} disabled={ocupado} aria-label="Cerrar">
                <Iconos.cerrar size={20} />
              </button>
            </header>

            <div className={styles.cuerpo}>
              <div className={styles.resumen}>
                <strong>{precioPlan(plan)}</strong>
                <span>{BENEFICIO_PLAN[plan.id]}</span>
              </div>

              <label htmlFor="cambio-plan-mensaje" className={styles.etiqueta}>
                {T.modalMensaje} <span className={styles.opcional}>(opcional)</span>
              </label>
              <textarea
                id="cambio-plan-mensaje"
                className={styles.textarea}
                rows={3}
                value={mensaje}
                maxLength={MAX_CARACTERES_MENSAJE_PLAN}
                onChange={(e) => setMensaje(e.target.value)}
                disabled={ocupado}
              />
              <ContadorCaracteres actual={mensaje.length} maximo={MAX_CARACTERES_MENSAJE_PLAN} />

              <p className={styles.nota}>{T.modalNota}</p>
              {error && <div className={styles.error} role="alert">{error}</div>}
            </div>

            <footer className={styles.pie}>
              <Boton variante="secundario" onClick={onCerrar} disabled={ocupado}>{T.modalCancelar}</Boton>
              <Boton onClick={enviar} cargando={ocupado}>{ocupado ? T.modalEnviando : T.modalEnviar}</Boton>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
