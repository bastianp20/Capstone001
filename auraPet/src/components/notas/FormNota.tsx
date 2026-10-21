import { useState, type FormEvent } from "react";
import { COLORES_NOTA, LISTA_COLORES_NOTA, MAX_CARACTERES_NOTA, MAX_CARACTERES_TITULO_NOTA, NOTA_VACIA, TEXTOS_NOTAS as T } from "../../constants";
import type { ColorNota, FormNotaProps } from "../../interfaces";
import { Boton } from "../ui/Boton";
import { ContadorCaracteres } from "../ui/ContadorCaracteres";
import styles from "../../css/notas/Notas.module.css";

// Formulario para crear o editar una nota (título, texto y color).
export const FormNota = ({ inicial = NOTA_VACIA, ocupado, onGuardar, onCancelar }: FormNotaProps) => {
  const [titulo, setTitulo] = useState(inicial.titulo);
  const [contenido, setContenido] = useState(inicial.contenido);
  const [color, setColor] = useState<ColorNota>(inicial.color);
  const puedeGuardar = titulo.trim().length > 0 && !ocupado;

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (puedeGuardar) onGuardar({ titulo, contenido, color });
  };

  return (
    <form className={`${styles.form} ${styles[color]}`} onSubmit={guardar}>
      <input className={styles.inputTitulo} value={titulo} onChange={(e) => setTitulo(e.target.value)}
        placeholder={T.placeholderTitulo} maxLength={MAX_CARACTERES_TITULO_NOTA} aria-label={T.placeholderTitulo}
        disabled={ocupado} autoFocus required />
      <textarea className={styles.inputContenido} value={contenido} onChange={(e) => setContenido(e.target.value)}
        placeholder={T.placeholderContenido} maxLength={MAX_CARACTERES_NOTA} aria-label={T.placeholderContenido}
        disabled={ocupado} />
      <ContadorCaracteres actual={contenido.length} maximo={MAX_CARACTERES_NOTA} />

      <div className={styles.formPie}>
        <div className={styles.colores} role="radiogroup" aria-label={T.color}>
          {LISTA_COLORES_NOTA.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={COLORES_NOTA[c]}
              title={COLORES_NOTA[c]} className={`${styles.muestra} ${styles[c]} ${color === c ? styles.muestraActiva : ""}`}
              onClick={() => setColor(c)} disabled={ocupado} />
          ))}
        </div>
        <div className={styles.formAcciones}>
          <Boton variante="secundario" onClick={onCancelar} disabled={ocupado}>{T.cancelar}</Boton>
          <Boton type="submit" disabled={!puedeGuardar} cargando={ocupado}>{ocupado ? T.guardando : T.guardar}</Boton>
        </div>
      </div>
    </form>
  );
};
