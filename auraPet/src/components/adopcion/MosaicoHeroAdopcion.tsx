import type { MosaicoHeroAdopcionProps } from "../../interfaces";

/** Tres fotos superpuestas sobre una mancha menta, con una etiqueta flotante. */
export const MosaicoHeroAdopcion = ({ fotos, etiqueta }: MosaicoHeroAdopcionProps) => (
  <div className="adopta-mosaico" aria-hidden>
    <div className="adopta-mosaico-mancha" />
    {fotos.slice(0, 3).map((f, i) => (
      <img key={f.src} src={f.src} alt={f.alt} className={`adopta-mosaico-foto adopta-mosaico-foto-${i + 1}`} />
    ))}
    {etiqueta && <span className="adopta-mosaico-etiqueta">{etiqueta}</span>}
  </div>
);
