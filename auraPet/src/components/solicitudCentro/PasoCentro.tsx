import { COMUNAS_SUGERIDAS, LARGO_TELEFONO_CL, PREFIJO_TELEFONO_CL } from "../../constants";
import { soloDigitos } from "../../lib/validacionSolicitud";
import type { PasoCentroProps } from "../../interfaces";
import { CampoFormulario } from "./CampoFormulario";
import { SelectorChips } from "./SelectorChips";

// Paso 1: datos del centro
export const PasoCentro = ({ wizard, especialidades }: PasoCentroProps) => {
  const { datos, errores, actualizar, marcarTocado } = wizard;
  return (
    <div className="solicitud-grilla">
      <div className="solicitud-col-completa">
        <CampoFormulario campo="nombreCentro" etiqueta="Nombre del centro" valor={datos.nombreCentro}
          placeholder="Ej: Clínica Veterinaria San Roque" maxLength={120} error={errores.nombreCentro}
          onCambiar={(v) => actualizar("nombreCentro", v)} onSalir={() => marcarTocado("nombreCentro")} />
      </div>
      <div className="solicitud-col-completa">
        <CampoFormulario campo="direccion" etiqueta="Dirección" valor={datos.direccion}
          placeholder="Calle, número y local u oficina" maxLength={200} error={errores.direccion}
          onCambiar={(v) => actualizar("direccion", v)} onSalir={() => marcarTocado("direccion")} />
      </div>
      <CampoFormulario campo="comuna" etiqueta="Comuna" valor={datos.comuna} sugerencias={COMUNAS_SUGERIDAS}
        placeholder="Escribe o elige" maxLength={80} error={errores.comuna}
        onCambiar={(v) => actualizar("comuna", v)} onSalir={() => marcarTocado("comuna")} />
      <CampoFormulario campo="telefonoCentro" etiqueta="Teléfono del centro" valor={datos.telefonoCentro}
        prefijo={PREFIJO_TELEFONO_CL} tipo="tel" inputMode="numeric" placeholder="9 1234 5678" error={errores.telefonoCentro}
        onCambiar={(v) => actualizar("telefonoCentro", soloDigitos(v).slice(0, LARGO_TELEFONO_CL))}
        onSalir={() => marcarTocado("telefonoCentro")} />
      <div className="solicitud-col-completa">
        <SelectorChips id="solicitud-especialidadIds" etiqueta="Especialidades" multiple opcional
          opciones={especialidades.map((e) => ({ valor: e.id, texto: e.nombre }))}
          seleccion={datos.especialidadIds} onCambiar={(s) => actualizar("especialidadIds", s)} />
      </div>
      <div className="solicitud-col-completa">
        <CampoFormulario campo="sitioWeb" etiqueta="Sitio web o redes sociales" opcional valor={datos.sitioWeb}
          tipo="url" inputMode="url" placeholder="www.tucentro.cl o instagram.com/tucentro" maxLength={200} error={errores.sitioWeb}
          onCambiar={(v) => actualizar("sitioWeb", v)} onSalir={() => marcarTocado("sitioWeb")} />
      </div>
    </div>
  );
};
