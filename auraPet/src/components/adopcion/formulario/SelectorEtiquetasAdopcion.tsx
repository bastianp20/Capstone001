import type { SelectorEtiquetasAdopcionProps } from "../../../interfaces";

/** Etiquetas de elección múltiple con tope: "Juguetón", "Leal"… */
export const SelectorEtiquetasAdopcion = ({ opciones, elegidas, maximo, onCambiar, error }: SelectorEtiquetasAdopcionProps) => {
  const lleno = elegidas.length >= maximo;
  const alternar = (o: string) =>
    onCambiar(elegidas.includes(o) ? elegidas.filter((e) => e !== o) : lleno ? elegidas : [...elegidas, o]);

  return (
    <div>
      <div className="adopta-grupo-opciones">
        {opciones.map((o) => {
          const activa = elegidas.includes(o);
          return (
            <button
              key={o}
              type="button"
              className={`adopta-pildora ${activa ? "adopta-pildora-activa" : ""}`}
              aria-pressed={activa}
              disabled={!activa && lleno}
              onClick={() => alternar(o)}
            >
              {o}
            </button>
          );
        })}
      </div>
      {error && <p className="adopta-campo-error">{error}</p>}
    </div>
  );
};
