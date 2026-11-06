import { TEXTOS_POSTULACION as T } from "../../../constants";
import type { PasoPostulacionProps } from "../../../interfaces";
import { CampoSiNoAdopcion } from "../formulario/CampoSiNoAdopcion";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";

/** Paso 2 — Tu familia: niños, otras mascotas y si todos están de acuerdo. */
export const PasoFamiliaPostulacion = ({ datos, errores, onCambiar }: PasoPostulacionProps) => (
  <>
    <CampoSiNoAdopcion etiqueta={T.hayNinos} valor={datos.hayNinos} onCambiar={(v) => onCambiar("hayNinos", v)} error={errores.hayNinos} />
    {datos.hayNinos && (
      <CampoTextoAdopcion
        id="postula-edades"
        etiqueta={T.edadesNinos}
        valor={datos.edadesNinos}
        onCambiar={(v) => onCambiar("edadesNinos", v)}
        placeholder={T.edadesPlaceholder}
        maximo={60}
        error={errores.edadesNinos}
      />
    )}
    <CampoSiNoAdopcion etiqueta={T.otrasMascotas} valor={datos.otrasMascotas} onCambiar={(v) => onCambiar("otrasMascotas", v)} error={errores.otrasMascotas} />
    {datos.otrasMascotas && (
      <CampoTextoAdopcion
        id="postula-mascotas"
        etiqueta={T.cualesMascotas}
        valor={datos.cualesMascotas}
        onCambiar={(v) => onCambiar("cualesMascotas", v)}
        placeholder={T.cualesPlaceholder}
        maximo={120}
        error={errores.cualesMascotas}
      />
    )}
    <CampoSiNoAdopcion etiqueta={T.todosDeAcuerdo} valor={datos.todosDeAcuerdo} onCambiar={(v) => onCambiar("todosDeAcuerdo", v)} error={errores.todosDeAcuerdo} />
  </>
);
