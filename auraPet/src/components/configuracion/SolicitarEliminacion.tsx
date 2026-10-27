import { useState } from "react";
import { CONFIRMACIONES, MAX_CARACTERES_MOTIVO_ELIMINACION, TEXTOS_ELIMINACION as T } from "../../constants";
import { getMiSolicitudEliminacion } from "../../Api/getInfo";
import { solicitarEliminacionCuenta } from "../../Api/postInfo";
import { useAccion } from "../../hooks/useAccion";
import { useConsulta } from "../../hooks/useConsulta";
import { useConfirmar } from "../../hooks/useConfirmar";
import type { SolicitarEliminacionProps } from "../../interfaces";
import styles from "../../css/modal/ConfiguracionModal.module.css";

// Configuración → Privacidad: pedir la eliminación de la cuenta. Muestra si
// ya hay una en revisión o si la anterior fue rechazada (migración 32).
export const SolicitarEliminacion = ({ perfilId }: SolicitarEliminacionProps) => {
  const [recarga, setRecarga] = useState(0);
  const [motivo, setMotivo] = useState("");
  const { ejecutar, ocupado, error } = useAccion();
  const confirmar = useConfirmar();
  const { datos: solicitud } = useConsulta(() => getMiSolicitudEliminacion(perfilId), [perfilId, recarga]);

  const pedir = async () => {
    if (!(await confirmar(CONFIRMACIONES.pedirEliminacionCuenta()))) return;
    const ok = await ejecutar(() => solicitarEliminacionCuenta(motivo), "No se pudo enviar la solicitud.");
    if (ok) {
      setMotivo("");
      setRecarga((n) => n + 1);
    }
  };

  return (
    <>
      <p className={styles.subtitulo}>{T.titulo}</p>
      <small className={styles.ayudaTexto}>{T.ayuda}</small>

      {solicitud?.estado === "pendiente" ? (
        <p className={styles.exito}>{T.enRevision(solicitud.fecha)}</p>
      ) : (
        <>
          {solicitud?.estado === "rechazada" && (
            <p className={styles.error}>{T.rechazada}{solicitud.respuesta ? ` ${solicitud.respuesta}` : ""}</p>
          )}
          <textarea className={styles.textarea} value={motivo} onChange={(e) => setMotivo(e.target.value)}
            maxLength={MAX_CARACTERES_MOTIVO_ELIMINACION} placeholder={T.placeholderMotivo}
            aria-label={T.placeholderMotivo} disabled={ocupado} />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.acciones}>
            <button type="button" className={styles.btnSecundario} onClick={pedir} disabled={ocupado}>
              {ocupado ? T.pidiendo : T.pedir}
            </button>
          </div>
        </>
      )}
    </>
  );
};
