import { useState } from "react";
import { MAX_CARACTERES_ESPECIALIDAD_OTRA, NOMBRE_MEDICINA_GENERAL, TEXTOS_REGISTRO_VETERINARIO } from "../../../constants";
import type { SelectorEspecialidadProps } from "../../../interfaces";
import styles from "../../../css/veterinario/RegistroVeterinario.module.css";

// Especialidades además de medicina general: todas las que quiera del catálogo
// (sin límite) y "Otra", que abre un campo para escribirla (p. ej. Etología).
export const SelectorEspecialidad = ({ especialidades, especialidadIds, especialidadOtra, onCambiar, opcional = true }: SelectorEspecialidadProps) => {
  const [escribiendoOtra, setEscribiendoOtra] = useState(Boolean(especialidadOtra));

  const alternar = (id: number) =>
    onCambiar({ especialidadIds: especialidadIds.includes(id) ? especialidadIds.filter((x) => x !== id) : [...especialidadIds, id] });

  const alternarOtra = () => {
    const abrir = !escribiendoOtra;
    setEscribiendoOtra(abrir);
    if (!abrir) onCambiar({ especialidadOtra: "" });
  };

  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.etiqueta}>
        {TEXTOS_REGISTRO_VETERINARIO.especialidad} {opcional && <span className={styles.opcional}>(opcional)</span>}
      </legend>
      <small className={styles.ayuda}>{TEXTOS_REGISTRO_VETERINARIO.ayudaEspecialidad}</small>

      <div className={styles.chips} role="group">
        {especialidades
          .filter((e) => e.nombre.toLowerCase() !== NOMBRE_MEDICINA_GENERAL) // todos la tienen
          .map((e) => {
            const activa = especialidadIds.includes(e.id);
            return (
              <button
                key={e.id}
                type="button"
                aria-pressed={activa}
                className={`${styles.chip} ${activa ? styles.chipActivo : ""}`}
                onClick={() => alternar(e.id)}
              >
                {e.nombre}
              </button>
            );
          })}
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
