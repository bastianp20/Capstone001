import { useState } from "react";
import { TEXTOS_DERIVACION as T } from "../../../constants";
import { getDerivaciones } from "../../../Api/getInfo";
import { useConsulta } from "../../../hooks/useConsulta";
import type { DerivacionesPacienteProps } from "../../../interfaces";
import { TarjetaDerivacion } from "../../derivaciones/TarjetaDerivacion";
import fichaStyles from "../../../css/ficha/FichaPaciente.module.css";
import styles from "../../../css/ficha/Derivaciones.module.css";

// Sección "Derivaciones" de la ficha. Se oculta si el paciente no tiene.
export const DerivacionesPaciente = ({ mascotaId, recarga }: DerivacionesPacienteProps) => {
  const [cambios, setCambios] = useState(0);
  const { datos: derivaciones = [], error } = useConsulta(() => getDerivaciones(mascotaId), [mascotaId, recarga, cambios]);

  if (!error && derivaciones.length === 0) return null;

  return (
    <section className={fichaStyles.seccion}>
      <h4 className={fichaStyles.seccionTitulo}>{T.tituloFicha}</h4>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.lista}>
        {derivaciones.map((d) => (
          <TarjetaDerivacion key={d.id} derivacion={d} onCambio={() => setCambios((n) => n + 1)} />
        ))}
      </ul>
    </section>
  );
};
