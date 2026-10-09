import { useEffect, useState, type DependencyList } from "react";

// Hook genérico para pedir datos a Supabase desde una pantalla.
//
// Uso:
//   const { datos: mascotas = [], cargando, error } =
//     useConsulta(() => getMascotasPorDueno(usuario.id), [usuario.id]);
//
// · consulta: una función async de Api/getInfo.tsx.
// · deps: cuándo volver a consultar (igual que en useEffect).
export const useConsulta = <T,>(consulta: () => Promise<T>, deps: DependencyList) => {
  // Guardamos el resultado de la última consulta: datos o error.
  const [resultado, setResultado] = useState<{ datos?: T; error?: string; listo: boolean }>({ listo: false });

  useEffect(() => {
    let activo = true; // si la pantalla se cierra antes de que responda, no actualizamos nada
    consulta()
      .then((datos) => { if (activo) setResultado({ datos, listo: true }); })
      .catch((e: unknown) => {
        console.error("Error al consultar Supabase:", e);
        if (activo) setResultado({ error: "No pudimos cargar la información.", listo: true });
      });
    return () => { activo = false; };
    // La consulta cambia en cada render; lo que decide cuándo repetirla son las deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { datos: resultado.datos, error: resultado.error, cargando: !resultado.listo };
};
