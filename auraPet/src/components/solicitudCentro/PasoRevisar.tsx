import { CARGOS_RESPONSABLE, PREFIJO_TELEFONO_CL, TEXTOS_SOLICITUD } from "../../constants";
import type { PasoRevisarProps } from "../../interfaces";
import { TarjetaResumen } from "./TarjetaResumen";

const conPrefijo = (telefono: string) => (telefono ? `${PREFIJO_TELEFONO_CL} ${telefono}` : "");

// Paso 3: resumen de todo, aceptación de contacto y error del servidor
export const PasoRevisar = ({ wizard, especialidades, error }: PasoRevisarProps) => {
  const { datos, errores, actualizar, marcarTocado, irAPaso } = wizard;
  const nombresEspecialidades = especialidades
    .filter((e) => datos.especialidadIds.includes(e.id))
    .map((e) => e.nombre)
    .join(", ");
  const cargo = CARGOS_RESPONSABLE.find((c) => c.valor === datos.cargo)?.texto ?? "";

  return (
    <div className="solicitud-revisar">
      <TarjetaResumen titulo="Tu centro" onEditar={() => irAPaso(0)} filas={[
        { etiqueta: "Nombre", valor: datos.nombreCentro },
        { etiqueta: "Dirección", valor: `${datos.direccion}${datos.comuna ? `, ${datos.comuna}` : ""}` },
        { etiqueta: "Teléfono", valor: conPrefijo(datos.telefonoCentro) },
        { etiqueta: "Especialidades", valor: nombresEspecialidades },
        { etiqueta: "Sitio web", valor: datos.sitioWeb },
      ]} />
      <TarjetaResumen titulo="Responsable" onEditar={() => irAPaso(1)} filas={[
        { etiqueta: "Nombre", valor: datos.nombreResponsable },
        { etiqueta: "Cargo", valor: cargo },
        { etiqueta: "Correo", valor: datos.correo },
        { etiqueta: "Teléfono", valor: conPrefijo(datos.telefonoResponsable) },
        ...(datos.mensaje ? [{ etiqueta: "Mensaje", valor: datos.mensaje }] : []),
      ]} />

      <div className={`solicitud-campo ${errores.aceptaContacto ? "solicitud-campo--error" : ""}`}>
        <label className="solicitud-check">
          <input id="solicitud-aceptaContacto" type="checkbox" checked={datos.aceptaContacto}
            aria-invalid={Boolean(errores.aceptaContacto)}
            aria-describedby={errores.aceptaContacto ? "solicitud-aceptaContacto-error" : undefined}
            onChange={(e) => { actualizar("aceptaContacto", e.target.checked); marcarTocado("aceptaContacto"); }} />
          <span>{TEXTOS_SOLICITUD.aceptaContacto}<span className="solicitud-requerido" aria-hidden="true">*</span></span>
        </label>
        {errores.aceptaContacto && <p id="solicitud-aceptaContacto-error" className="solicitud-error">{errores.aceptaContacto}</p>}
      </div>

      {error && <div className="solicitud-alerta" role="alert">{error}</div>}
    </div>
  );
};
