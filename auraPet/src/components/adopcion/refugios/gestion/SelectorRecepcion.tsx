import { Check } from "lucide-react";
import { RECEPCION_REFUGIO_OPCIONES } from "../../../../constants";
import type { SelectorRecepcionProps } from "../../../../interfaces";

/** ¿Recibe animales? Abierto · Cupos limitados · Sin cupos (tarjetas o barra compacta). */
export const SelectorRecepcion = ({ valor, onCambiar, compacto = false, deshabilitado = false }: SelectorRecepcionProps) => (
  <div className={compacto ? "ap-recepcion-compacta" : "ap-recepcion"} role="radiogroup">
    {RECEPCION_REFUGIO_OPCIONES.map(({ valor: v, titulo, corto, detalle, icono: Icono }) => {
      const activo = v === valor;
      return (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={activo}
          disabled={deshabilitado}
          className={`ap-recepcion-opcion ap-recepcion-${v} ${activo ? "ap-recepcion-activa" : ""}`}
          onClick={() => onCambiar(v)}
        >
          <span className="ap-recepcion-icono" aria-hidden>
            {activo && compacto ? <Check size={16} /> : <Icono size={18} />}
          </span>
          {compacto ? (
            <strong>{corto}</strong>
          ) : (
            <span className="ap-recepcion-texto">
              <strong>{titulo}</strong>
              <small>{detalle}</small>
            </span>
          )}
          {activo && !compacto && <Check size={18} className="ap-recepcion-check" aria-hidden />}
        </button>
      );
    })}
  </div>
);
