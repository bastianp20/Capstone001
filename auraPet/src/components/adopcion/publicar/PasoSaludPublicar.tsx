import { TEXTOS_PUBLICAR as T } from "../../../constants";
import type { PasoPublicarProps } from "../../../interfaces";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";
import { InterruptorAdopcion } from "../formulario/InterruptorAdopcion";

/** Paso 3 — raza, peso, vacunas, esterilización, microchip, alergias y su historia. */
export const PasoSaludPublicar = ({ datos, errores, onCambiar }: PasoPublicarProps) => (
  <>
    <div className="publica-fila-doble">
      <CampoTextoAdopcion id="publica-raza" etiqueta={T.raza} valor={datos.raza} onCambiar={(v) => onCambiar("raza", v)} placeholder={T.razaPlaceholder} maximo={60} />
      <CampoTextoAdopcion
        id="publica-peso"
        etiqueta={T.peso}
        tipo="number"
        valor={datos.pesoKg}
        onCambiar={(v) => onCambiar("pesoKg", v)}
        placeholder="Ej: 12"
        error={errores.pesoKg}
      />
    </div>
    <div className="publica-interruptores">
      <InterruptorAdopcion etiqueta={T.vacunas} activo={datos.vacunasAlDia} onCambiar={(v) => onCambiar("vacunasAlDia", v)} />
      <InterruptorAdopcion etiqueta={T.esterilizado} activo={datos.esterilizado} onCambiar={(v) => onCambiar("esterilizado", v)} />
      <InterruptorAdopcion etiqueta={T.microchip} activo={datos.conMicrochip} onCambiar={(v) => onCambiar("conMicrochip", v)} />
    </div>
    <CampoTextoAdopcion id="publica-alergias" etiqueta={T.alergias} valor={datos.alergias} onCambiar={(v) => onCambiar("alergias", v)} maximo={200} />
    <CampoTextoAdopcion
      id="publica-historia"
      etiqueta={T.historia}
      valor={datos.historia}
      onCambiar={(v) => onCambiar("historia", v)}
      placeholder={T.historiaPlaceholder}
      multilinea
      maximo={1500}
      error={errores.historia}
    />
  </>
);
