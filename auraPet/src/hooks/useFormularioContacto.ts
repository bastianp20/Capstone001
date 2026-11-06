import { useState, type FormEvent } from "react";
import { enviarMensajeContacto } from "../Api/postInfo";
import { validarContacto } from "../lib/validacionContacto";
import type { DatosContacto } from "../interfaces";
import { useAccion } from "./useAccion";

// Estado y envío de un formulario de contacto. Lo usan la página /contacto
// y el "¿Te podemos ayudar?" del inicio: cada uno pasa sus valores iniciales
// (el del inicio trae el asunto fijo). Cada componente que lo llama tiene su
// propio estado. Los mensajes llegan al superadmin (sección "Mensajes").
export const useFormularioContacto = (vacio: DatosContacto) => {
  const [formulario, setFormulario] = useState<DatosContacto>(vacio);
  const [enviado, setEnviado] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const { ejecutar, ocupado, error } = useAccion();

  const cambiar = (cambios: Partial<DatosContacto>) => {
    setFormulario((f) => ({ ...f, ...cambios }));
    setEnviado(false);
    setErrorValidacion(null);
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const problema = validarContacto(formulario);
    setErrorValidacion(problema);
    if (problema || ocupado) return;
    const ok = await ejecutar(() => enviarMensajeContacto(formulario), "No pudimos enviar tu mensaje.");
    if (ok) {
      setFormulario(vacio);
      setEnviado(true);
    }
  };

  return { formulario, cambiar, enviar, enviado, ocupado, mensajeError: errorValidacion ?? error };
};
