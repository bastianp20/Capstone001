import { useState } from "react";
import {
  ESTADO_DERIVACION, MAX_CARACTERES_RESULTADO_DERIVACION, TEXTOS_DERIVACION as T,
} from "../../constants";
import { responderDerivacion } from "../../Api/postInfo";
import { useAccion } from "../../hooks/useAccion";
import type { TarjetaDerivacionProps } from "../../interfaces";
import { Etiqueta } from "../ui/Etiqueta";
import { Boton } from "../ui/Boton";
import styles from "../../css/ficha/Derivaciones.module.css";

type Respuesta = "realizada" | "rechazo" | null;

// Una derivación: destino, motivo, estado y resultado. Si corresponde,
// muestra las acciones (el destino responde; quien derivó puede cancelar).
export const TarjetaDerivacion = ({ derivacion: d, mostrarMascota, onCambio, onVerFicha }: TarjetaDerivacionProps) => {
  const [respuesta, setRespuesta] = useState<Respuesta>(null);
  const [texto, setTexto] = useState("");
  const { ejecutar, ocupado, error } = useAccion();

  const enviar = async (realizada: boolean) => {
    const ok = await ejecutar(() => responderDerivacion(d.id, realizada, texto), "No se pudo actualizar la derivación.");
    if (ok) {
      setRespuesta(null);
      setTexto("");
      onCambio?.();
    }
  };

  const cancelar = () => {
    if (window.confirm(T.confirmarCancelar)) enviar(false);
  };

  const titulo = d.direccion === "recibida"
    ? `${d.mascota}${d.especie ? ` · ${d.especie}` : ""} — de ${d.origen}`
    : `${mostrarMascota ? `${d.mascota} → ` : "A "}${d.destino}`;

  return (
    <li className={`${styles.tarjeta} ${d.estado === "pendiente" ? styles.tarjetaPendiente : ""}`}>
      <div className={styles.cabecera}>
        <p className={styles.titulo}>{titulo}</p>
        <Etiqueta {...ESTADO_DERIVACION[d.estado]} />
      </div>
      <span className={styles.meta}>
        {d.fecha}
        {d.direccion !== "recibida" && ` · derivó ${d.origen}`}
        {d.direccion === "recibida" && d.dueno && ` · dueño: ${d.dueno}`}
        {d.direccion === "recibida" && ` · a ${d.destino}`}
      </span>
      <p className={styles.motivo}>{d.motivo}</p>
      {d.resultado && <p className={styles.resultado}><strong>Resultado:</strong> {d.resultado}</p>}

      {respuesta && (
        <div className={styles.respuesta}>
          <textarea
            className={styles.textarea}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={MAX_CARACTERES_RESULTADO_DERIVACION}
            placeholder={respuesta === "realizada" ? T.placeholderResultado : T.placeholderRechazo}
            aria-label={respuesta === "realizada" ? T.resultado : T.placeholderRechazo}
            disabled={ocupado}
            autoFocus
          />
          <div className={styles.acciones}>
            <Boton variante="secundario" onClick={() => setRespuesta(null)} disabled={ocupado}>Volver</Boton>
            <Boton
              variante={respuesta === "realizada" ? "primario" : "peligro"}
              cargando={ocupado}
              disabled={respuesta === "realizada" && !texto.trim()}
              onClick={() => enviar(respuesta === "realizada")}
            >
              {respuesta === "realizada" ? T.enviar : T.rechazar}
            </Boton>
          </div>
        </div>
      )}

      {!respuesta && (d.puedoResponder || d.puedoCancelar || onVerFicha) && (
        <div className={styles.acciones}>
          {onVerFicha && (
            <Boton variante="secundario" onClick={() => onVerFicha(d.mascotaId)}>{T.verFicha}</Boton>
          )}
          {d.puedoResponder && (
            <>
              <Boton onClick={() => setRespuesta("realizada")}>{T.marcarRealizada}</Boton>
              <Boton variante="peligro" onClick={() => setRespuesta("rechazo")}>{T.rechazar}</Boton>
            </>
          )}
          {d.puedoCancelar && (
            <Boton variante="peligro" cargando={ocupado} onClick={cancelar}>{T.cancelar}</Boton>
          )}
        </div>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </li>
  );
};
