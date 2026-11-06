import type { AvisoFichaIncompletaProps } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import styles from "../../../css/ficha/FichaPaciente.module.css";

// Si a la ficha le falta el peso o todavía no tiene historial, lo dice
// y ofrece completarla ahí mismo.
export const AvisoFichaIncompleta = ({ faltanDatos, faltaHistorial, onCompletarDatos, onAgregarRegistro }: AvisoFichaIncompletaProps) => {
  if (!faltanDatos && !faltaHistorial) return null;

  const faltantes = [faltanDatos && "el peso", faltaHistorial && "el primer registro médico"].filter(Boolean).join(" y ");

  return (
    <div className={styles.aviso}>
      <span><strong>Ficha incompleta:</strong> falta {faltantes}.</span>
      <div className={styles.avisoAcciones}>
        {faltanDatos && <Boton variante="secundario" onClick={onCompletarDatos}>Completar datos</Boton>}
        {faltaHistorial && <Boton variante="secundario" onClick={onAgregarRegistro}>Agregar registro</Boton>}
      </div>
    </div>
  );
};
