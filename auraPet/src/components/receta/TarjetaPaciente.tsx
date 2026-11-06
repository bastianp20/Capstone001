import styles from "../../css/modal/RecetaModal.module.css";
import { Iconos } from "../../constants";
import { calcularEdad } from "../../lib/fechas";
import type { TarjetaPacienteProps } from "../../interfaces";

const iconos = Iconos;

// Tarjeta con los datos del paciente elegido: especie, raza, edad, peso,
// dueño y, si tiene, una advertencia de alergias (importante al recetar).
export const TarjetaPaciente = ({ paciente, onCambiar }: TarjetaPacienteProps) => {
  const edad = calcularEdad(paciente.fechaNacimiento);

  // Solo mostramos los datos que existen: "Perro · Labrador · 4 años · 28 kg"
  const detalle = [
    paciente.especie,
    paciente.raza !== "—" ? paciente.raza : null,
    edad !== null ? `${edad} ${edad === 1 ? "año" : "años"}` : null,
    paciente.pesoKg !== null ? `${paciente.pesoKg} kg` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={styles.tarjetaPaciente}>
      <div className={styles.avatar}>
        <iconos.huella size={20} />
      </div>

      <div className={styles.datosPaciente}>
        <span className={styles.nombrePaciente}>{paciente.nombre}</span>
        <span className={styles.textoSuave}>{detalle}</span>
        <span className={styles.textoSuave}>Dueño: {paciente.dueno}</span>
      </div>

      <div className={styles.ladoDerecho}>
        {paciente.alergias && (
          <span className={styles.alergia} title={paciente.alergias}>
            <iconos.urgenciaAlta size={13} />
            Alergia: {paciente.alergias}
          </span>
        )}
        {onCambiar && (
          <button type="button" className={styles.linkCambiar} onClick={onCambiar}>
            Cambiar paciente
          </button>
        )}
      </div>
    </div>
  );
};
