import { ERRORES_SOLICITUD, LARGO_TELEFONO_CL } from "../constants";
import type { CampoSolicitud, DatosSolicitudCentro, ErroresSolicitud } from "../interfaces";

// Reglas del formulario "Solicitar unirse como centro". Funciones puras:
// no saben nada de React, así que se pueden reutilizar y probar solas.
// (El servidor vuelve a validar todo en solicitar_centro, migración 20.)

export const soloDigitos = (texto: string): string => texto.replace(/\D/g, "");

export const esCorreoValido = (correo: string): boolean => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo.trim());

export const esTelefonoChileno = (telefono: string): boolean => soloDigitos(telefono).length === LARGO_TELEFONO_CL;

export const esSitioWebValido = (sitio: string): boolean => /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(sitio.trim());

const vacio = (texto: string) => texto.trim().length === 0;

// Error de un campo, o null si está bien
export const validarCampoSolicitud = (campo: CampoSolicitud, datos: DatosSolicitudCentro): string | null => {
  switch (campo) {
    case "nombreCentro":
    case "direccion":
    case "comuna":
    case "nombreResponsable":
      return vacio(datos[campo]) ? ERRORES_SOLICITUD.requerido : null;
    case "telefonoCentro":
    case "telefonoResponsable":
      if (vacio(datos[campo])) return ERRORES_SOLICITUD.requerido;
      return esTelefonoChileno(datos[campo]) ? null : ERRORES_SOLICITUD.telefono;
    case "correo":
      if (vacio(datos.correo)) return ERRORES_SOLICITUD.requerido;
      return esCorreoValido(datos.correo) ? null : ERRORES_SOLICITUD.correo;
    case "cargo":
      return datos.cargo ? null : ERRORES_SOLICITUD.cargo;
    case "sitioWeb":   // opcional, pero si viene tiene que parecer una dirección web
      return vacio(datos.sitioWeb) || esSitioWebValido(datos.sitioWeb) ? null : ERRORES_SOLICITUD.sitioWeb;
    case "aceptaContacto":
      return datos.aceptaContacto ? null : ERRORES_SOLICITUD.aceptaContacto;
    default:          // especialidades y mensaje son opcionales
      return null;
  }
};

// Errores de varios campos a la vez (los que estén bien no aparecen)
export const validarCamposSolicitud = (campos: CampoSolicitud[], datos: DatosSolicitudCentro): ErroresSolicitud => {
  const errores: ErroresSolicitud = {};
  for (const campo of campos) {
    const error = validarCampoSolicitud(campo, datos);
    if (error) errores[campo] = error;
  }
  return errores;
};
