import { useCallback, useMemo, useState } from "react";
import { CAMPOS_WIZARD_SOLICITUD, DATOS_SOLICITUD_VACIOS, PASOS_WIZARD_SOLICITUD } from "../constants";
import { validarCamposSolicitud } from "../lib/validacionSolicitud";
import type { CampoSolicitud, DatosSolicitudCentro, ErroresSolicitud, PasoSolicitud, WizardSolicitud } from "../interfaces";

// Estado del formulario por pasos: los datos, en qué paso va y qué errores
// mostrar. Un error solo se ve si el campo ya se "tocó" (salió de él) o si
// se intentó avanzar desde su paso: así el formulario no parte todo en rojo.
export const useWizardSolicitud = (): WizardSolicitud => {
  const [datos, setDatos] = useState<DatosSolicitudCentro>(DATOS_SOLICITUD_VACIOS);
  const [paso, setPaso] = useState<PasoSolicitud>(0);
  const [tocados, setTocados] = useState<Set<CampoSolicitud>>(new Set());

  // Errores de todo el formulario, y de ellos solo los de campos tocados
  const errores = useMemo<ErroresSolicitud>(() => {
    const todos = validarCamposSolicitud(CAMPOS_WIZARD_SOLICITUD, datos);
    return Object.fromEntries(Object.entries(todos).filter(([campo]) => tocados.has(campo as CampoSolicitud)));
  }, [datos, tocados]);

  const actualizar = useCallback(<C extends CampoSolicitud>(campo: C, valor: DatosSolicitudCentro[C]) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }, []);

  const marcarTocado = useCallback((campo: CampoSolicitud) => {
    setTocados((t) => (t.has(campo) ? t : new Set(t).add(campo)));
  }, []);

  // Valida solo el paso actual. Si hay errores los muestra y devuelve el primero
  // (para darle foco); si está todo bien, pasa al siguiente.
  const avanzar = useCallback((): CampoSolicitud | null => {
    const { campos } = PASOS_WIZARD_SOLICITUD[paso];
    setTocados((t) => new Set([...t, ...campos]));
    const erroresPaso = validarCamposSolicitud(campos, datos);
    const primero = campos.find((c) => erroresPaso[c]) ?? null;
    if (!primero && paso < PASOS_WIZARD_SOLICITUD.length - 1) setPaso((paso + 1) as PasoSolicitud);
    return primero;
  }, [paso, datos]);

  const retroceder = useCallback(() => setPaso((p) => (p > 0 ? ((p - 1) as PasoSolicitud) : p)), []);

  // Solo se puede saltar hacia atrás (a pasos ya completados)
  const irAPaso = useCallback((destino: PasoSolicitud) => setPaso((p) => (destino < p ? destino : p)), []);

  return { datos, paso, errores, actualizar, marcarTocado, avanzar, retroceder, irAPaso };
};
