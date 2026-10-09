import { useEffect, useState } from "react";
import type { PreguntaFrecuente } from "../interfaces";
import { getPreguntasFrecuentes } from "../Api/getInfo";

// Carga las preguntas frecuentes desde Supabase. Se usa en el Home y en Contacto.
// Mientras carga devuelve una lista vacía; si falla, deja el error en consola
// y la sección simplemente no muestra preguntas.
export const usePreguntasFrecuentes = (limite = 6) => {
  const [preguntas, setPreguntas] = useState<PreguntaFrecuente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true; // evita actualizar el estado si el componente ya se desmontó
    getPreguntasFrecuentes(limite)
      .then((data) => { if (activo) setPreguntas(data); })
      .catch((error) => console.error("No se pudieron cargar las preguntas frecuentes:", error))
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [limite]);

  return { preguntas, cargando };
};
