import { useState } from "react";
import styles from '../css/modal/CrearProfesionalModal.module.css';
import type { CrearProfesionalModalProps } from "../interfaces";


// Por ahora fijas; después las traemos de la tabla "especialidades"
const ESPECIALIDADES = ["Medicina general", "Cirugía", "Dermatología", "Oftalmología"];

export const ModalCrearProfesional = ({ onClose }: CrearProfesionalModalProps) => {
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);

  const handleEspecialidad = (especialidad: string) => {
    setSeleccionadas((prev) =>
      prev.includes(especialidad) ? prev.filter((e) => e !== especialidad) : [...prev, especialidad]
    );
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Nueva cuenta profesional</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <form className={styles.grid} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.campo}>
            Nombre completo
            <input type="text" />
          </label>

          <label className={styles.campo}>
            Correo
            <input type="email" />
          </label>

          <label className={styles.campo}>
            Teléfono
            <div className={styles.telefono}>
              <span>+56</span>
              <input type="tel" placeholder="9 1234 5678" />
            </div>
          </label>

          <label className={styles.campo}>
            RUT
            <input type="text" placeholder="12.345.678-K" />
          </label>

          <label className={`${styles.campo} ${styles.completo}`}>
            N° de registro profesional
            <input type="text" />
          </label>

          <div className={`${styles.campo} ${styles.completo}`}>
            Especialidades
            <div className={styles.chips}>
              {ESPECIALIDADES.map((esp) => (
                <button
                  key={esp}
                  type="button"
                  className={seleccionadas.includes(esp) ? styles.chipActivo : styles.chip}
                  onClick={() => handleEspecialidad(esp)}
                >
                  {esp}
                </button>
              ))}
            </div>
          </div>

          <label className={`${styles.campo} ${styles.completo}`}>
            Centro asignado
            <select defaultValue="">
              <option value="" disabled>Selecciona un centro</option>
              <option value="pruebas">Pruebas AuraPet</option>
            </select>
          </label>

          <label className={`${styles.check} ${styles.completo}`}>
            <input type="checkbox" />
            Hacer administrador del centro
          </label>

          <div className={`${styles.acciones} ${styles.completo}`}>
            <button type="button" className={styles.cancelar} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.enviar}>
              Enviar invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}