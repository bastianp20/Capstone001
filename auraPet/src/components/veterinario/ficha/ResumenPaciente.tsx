import { SEXO_LABEL } from "../../../constants";
import { formatEdad } from "../../../lib/fichaPaciente";
import type { ResumenPacienteProps } from "../../../interfaces";
import { DatoFicha } from "./DatoFicha";
import styles from "../../../css/ficha/FichaPaciente.module.css";

// Datos generales del paciente + contacto del dueño.
export const ResumenPaciente = ({ ficha }: ResumenPacienteProps) => {
  const { datosClinicos: d } = ficha;
  return (
    <section className={styles.seccion}>
      <h4 className={styles.seccionTitulo}>Resumen</h4>
      <div className={styles.grillaDatos}>
        <DatoFicha etiqueta="Especie" valor={`${ficha.especie} · ${ficha.raza}`} />
        <DatoFicha etiqueta="Sexo" valor={SEXO_LABEL[ficha.sexo]} />
        <DatoFicha etiqueta="Edad" valor={formatEdad(ficha.edad)} />
        <DatoFicha etiqueta="Peso" valor={d.pesoKg !== null ? `${d.pesoKg} kg` : null} />
        <DatoFicha etiqueta="Esterilizado" valor={d.esterilizado ? "Sí" : "No"} />
        <DatoFicha etiqueta="Microchip" valor={d.microchip} />
      </div>
      <div className={styles.dueno}>
        <span>Dueño: <strong>{ficha.dueno}</strong></span>
        {ficha.telefonoDueno && (
          <a className={styles.telefono} href={`tel:${ficha.telefonoDueno}`}>{ficha.telefonoDueno}</a>
        )}
      </div>
    </section>
  );
};
