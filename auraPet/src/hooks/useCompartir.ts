import { useCallback, useEffect, useState } from "react";

// Compartir un enlace: usa el menú del sistema si existe (celular) y si no,
// lo copia al portapapeles. "copiado" queda en true un par de segundos.
export const useCompartir = (msCopiado = 2500) => {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), msCopiado);
    return () => clearTimeout(t);
  }, [copiado, msCopiado]);

  const compartir = useCallback(async (datos: { titulo: string; texto: string; url: string }) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: datos.titulo, text: datos.texto, url: datos.url });
        return;
      }
      await navigator.clipboard.writeText(datos.url);
      setCopiado(true);
    } catch {
      // La persona cerró el menú de compartir o el navegador no dejó copiar: no hacemos nada.
    }
  }, []);

  return { compartir, copiado };
};
