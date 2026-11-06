import { Minus, Plus } from "lucide-react";
import { useId } from "react";
import type { ContadorNumeroProps } from "../../../../interfaces";

/** Número grande con botones − y + (cupos totales, cupos ocupados…). */
export const ContadorNumero = ({ etiqueta, valor, minimo = 0, maximo = 9999, onCambiar, grande = false }: ContadorNumeroProps) => {
  const id = useId();
  const fijar = (n: number) => onCambiar(Math.max(minimo, Math.min(maximo, Number.isFinite(n) ? Math.round(n) : minimo)));
  return (
    <div className={`ap-contador ${grande ? "ap-contador-grande" : ""}`}>
      <label htmlFor={id}>{etiqueta}</label>
      <div className="ap-contador-fila">
        <button type="button" className="ap-contador-btn" onClick={() => fijar(valor - 1)} disabled={valor <= minimo} aria-label={`${etiqueta}: uno menos`}>
          <Minus size={18} />
        </button>
        <input id={id} type="number" inputMode="numeric" min={minimo} max={maximo} value={valor} onChange={(e) => fijar(Number(e.target.value))} />
        <button type="button" className="ap-contador-btn" onClick={() => fijar(valor + 1)} disabled={valor >= maximo} aria-label={`${etiqueta}: uno más`}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
