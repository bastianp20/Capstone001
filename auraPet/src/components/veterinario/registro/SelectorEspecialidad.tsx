import { useState } from "react";
import { MAX_CARACTERES_ESPECIALIDAD_OTRA, TEXTOS_REGISTRO_VETERINARIO } from "../../../constants";
import type { SelectorEspecialidadProps } from "../../../interfaces";
import styles from "../../../css/veterinario/RegistroVeterinario.module.css";

// Especialidad además de medicina general (opcional): una del catálogo
// o "Otra", que abre un campo para escribirla (p. ej. Etología).
export const SelectorEspecialidad = ({ especialidades, especialidadId, especialidadOtra, onCambiar }: SelectorEspecialidadProps) => {
  const [escribiendoOtra, setEscribiendoOtra] = useState(Boolean(especialidadOtra));

  const elegir = (id: number) => {
    setEscribiendoOtra(false);
    onCambiar({ especialidadId: especialidadId === id ? null : id, especialidadOtra: "" });
  };

  const alternarOtra = () => {
    const abrir = !escribiendoOtra;
    setEscribiendoOtra(abrir);
    onCambiar({ especialidadId: null, especialidadOtra: "" });
  };

  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.etiqueta}>
        {TEXTOS_REGISTRO_VETERINARIO.especialidad} <span className={styles.opcional}>(opcional)</span>
      </legend>
      <small className={styles.ayuda}>{TEXTOS_REGISTRO_VETERINARIO.ayudaEspecialidad}</small>

      <div className={styles.chips}>
        {especialidades
          .filter((e) => e.nombre.toLowerCase() !== "medicina general")   // todos la tienen
          .map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={especialidadId === e.id}
              className={`${styles.chip} ${especialidadId === e.id ? styles.chipActivo : ""}`}
              onClick={() => elegir(e.id)}
            >
              {e.nombre}
            </button>
          ))}
        <button
          type="button"
          aria-pressed={escribiendoOtra}
          className={`${styles.chip} ${escribiendoOtra ? styles.chipActivo : ""}`}
          onClick={alternarOtra}
        >
          {TEXTOS_REGISTRO_VETERINARIO.otra}
        </button>
      </div>

      {escribiendoOtra && (
        <input
          className={styles.control}
          value={especialidadOtra}
          maxLength={MAX_CARACTERES_ESPECIALIDAD_OTRA}
          onChange={(e) => onCambiar({ especialidadOtra: e.target.value })}
          placeholder={TEXTOS_REGISTRO_VETERINARIO.especialidadOtraPlaceholder}
          aria-label="Escribe tu especialidad"
          autoFocus
        />
      )}
    </fieldset>
  );
};
