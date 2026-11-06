import { CARGOS_RESPONSABLE, LARGO_TELEFONO_CL, MAX_CARACTERES_MENSAJE_SOLICITUD, PREFIJO_TELEFONO_CL } from "../../constants";
import { soloDigitos } from "../../lib/validacionSolicitud";
import type { CargoResponsable, PasoFormularioProps } from "../../interfaces";
import { CampoFormulario } from "./CampoFormulario";
import { SelectorChips } from "./SelectorChips";

// Paso 2: la persona responsable de la solicitud
export const PasoResponsable = ({ wizard }: PasoFormularioProps) => {
  const { datos, errores, actualizar, marcarTocado } = wizard;
  return (
    <div className="solicitud-grilla">
      <div className="solicitud-col-completa">
        <CampoFormulario campo="nombreResponsable" etiqueta="Nombre completo" valor={datos.nombreResponsable}
          placeholder="Ej: Camila Rojas" maxLength={120} error={errores.nombreResponsable}
          onCambiar={(v) => actualizar("nombreResponsable", v)} onSalir={() => marcarTocado("nombreResponsable")} />
      </div>
      <div className="solicitud-col-completa">
        <SelectorChips<CargoResponsable> id="solicitud-cargo" etiqueta="Cargo" opciones={CARGOS_RESPONSABLE}
          seleccion={datos.cargo ? [datos.cargo] : []} error={errores.cargo}
          onCambiar={([c]) => { actualizar("cargo", c ?? ""); marcarTocado("cargo"); }} />
      </div>
      <CampoFormulario campo="correo" etiqueta="Correo de contacto" valor={datos.correo} tipo="email" inputMode="email"
        placeholder="nombre@correo.cl" maxLength={160} error={errores.correo}
        onCambiar={(v) => actualizar("correo", v)} onSalir={() => marcarTocado("correo")} />
      <CampoFormulario campo="telefonoResponsable" etiqueta="Teléfono" valor={datos.telefonoResponsable}
        prefijo={PREFIJO_TELEFONO_CL} tipo="tel" inputMode="numeric" placeholder="9 1234 5678" error={errores.telefonoResponsable}
        onCambiar={(v) => actualizar("telefonoResponsable", soloDigitos(v).slice(0, LARGO_TELEFONO_CL))}
        onSalir={() => marcarTocado("telefonoResponsable")} />
      <div className="solicitud-col-completa">
        <CampoFormulario campo="mensaje" etiqueta="Mensaje" opcional multilinea valor={datos.mensaje}
          maxLength={MAX_CARACTERES_MENSAJE_SOLICITUD} placeholder="Cuéntanos sobre tu centro o lo que esperas de AuraPet…"
          onCambiar={(v) => actualizar("mensaje", v)} onSalir={() => marcarTocado("mensaje")} />
      </div>
    </div>
  );
};
