import { useId, useState } from "react";
import { Iconos, TEXTOS_HORARIO_ATENCION as T } from "../../../constants";
import type { CampoComunasProps } from "../../../interfaces";
import styles from "../../../css/veterinario/HorarioAtencion.module.css";

// Comunas donde atiende un veterinario independiente, como chips que se quitan con la X.
export const CampoComunas = ({ comunas, onCambiar, deshabilitado }: CampoComunasProps) => {
  const id = useId();
  const [texto, setTexto] = useState("");

  const agregar = () => {
    const comuna = texto.trim();
    if (!comuna) return;
    if (!comunas.some((c) => c.toLowerCase() === comuna.toLowerCase())) onCambiar([...comunas, comuna]);
    setTexto("");
  };

  return (
    <div>
      <label htmlFor={`${id}-comuna`} className={styles.casilla}>{T.comunas}</label>
      <div className={styles.filaComuna}>
        <input
          id={`${id}-comuna`}
          className={styles.input}
          value={texto}
          maxLength={60}
          placeholder={T.placeholderComuna}
          disabled={deshabilitado}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              agregar();
            }
          }}
        />
        <button type="button" className={styles.botonSecundario} onClick={agregar} disabled={deshabilitado || !texto.trim()}>
          {T.agregarComuna}
        </button>
      </div>
      {comunas.length > 0 && (
        <ul className={`${styles.chips} ${styles.listaChips}`} aria-label={T.comunas}>
          {comunas.map((c) => (
            <li key={c} className={styles.chipQuitar}>
              {c}
              <button type="button" onClick={() => onCambiar(comunas.filter((x) => x !== c))} disabled={deshabilitado}
                aria-label={T.quitarComuna(c)}>
                <Iconos.cerrar size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
