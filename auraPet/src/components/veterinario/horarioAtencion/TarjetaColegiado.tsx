import { useId, useState } from "react";
import { TEXTOS_HORARIO_ATENCION as T } from "../../../constants";
import { registrarMiColegiado } from "../../../Api/postInfo";
import { useAccion } from "../../../hooks/useAccion";
import type { TarjetaColegiadoProps } from "../../../interfaces";
import { Aviso } from "../../ui/Aviso";
import styles from "../../../css/veterinario/HorarioAtencion.module.css";

// Solo aparece si el veterinario no puso su N° de colegiado al registrarse.
export const TarjetaColegiado = ({ onRegistrado }: TarjetaColegiadoProps) => {
  const id = useId();
  const [numero, setNumero] = useState("");
  const { ejecutar, ocupado, error } = useAccion();

  const guardar = async () => {
    if (await ejecutar(() => registrarMiColegiado(numero), "No se pudo guardar el número.")) onRegistrado();
  };

  return (
    <section className={styles.tarjeta} aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className={styles.tarjetaTitulo}>{T.colegiadoTitulo}</h2>
      <p className={styles.ayuda}>{T.colegiadoAyuda}</p>
      {error && <Aviso tipo="error" texto={error} />}
      <div className={styles.filaComuna}>
        <input className={styles.input} value={numero} maxLength={30} aria-label={T.colegiadoTitulo}
          onChange={(e) => setNumero(e.target.value)} disabled={ocupado} />
        <button type="button" className={styles.boton} onClick={guardar} disabled={ocupado || !numero.trim()}>
          {T.colegiadoGuardar}
        </button>
      </div>
    </section>
  );
};
