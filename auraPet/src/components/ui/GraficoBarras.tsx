import { useState } from "react";
import styles from "../../css/ui/Panel.module.css";
import type { GraficoBarrasProps } from "../../interfaces";

// Gráfico de barras verticales por ahora super simple, no tiene librerias
// Cada barra mide en proporción al valor más alto. Al pasar el mouse
// muestra un tooltip ("13 oct · 6 atenciones"). Las barras "futuras"
// (días que aún no llegan) se dibujan como una marquita a ras del eje.
export const GraficoBarras = ({ barras, marcasEje, unidad, unidadSingular, altura = 140 }: GraficoBarrasProps) => {
  const [encima, setEncima] = useState<number | null>(null); // índice de la barra con el mouse encima

  // El máximo define el 100% de altura (mínimo 1 para no dividir por 0)
  const maximo = Math.max(1, ...barras.map((b) => b.valor));

  // Resumen para lectores de pantalla
  const total = barras.reduce((suma, b) => suma + b.valor, 0);

  return (
    <div>
      <div className={styles.grafico} style={{ height: altura }} role="img" aria-label={`${total} ${unidad} en total`}>
        {barras.map((b, i) => {
          const clase = [
            styles.barra,
            b.destacado ? styles.barraDestacada : "",
            b.futuro ? styles.barraFutura : "",
          ].join(" ");
          // El destacado (hoy) muestra su tooltip siempre, salvo que el mouse esté en otra barra
          const mostrarTooltip = !b.futuro && (encima === i || (encima === null && b.destacado));
          return (
            <div
              key={i}
              className={styles.columna}
              onMouseEnter={() => setEncima(i)}
              onMouseLeave={() => setEncima(null)}
            >
              <div className={clase} style={{ height: `${(b.valor / maximo) * 100}%` }} />
              {mostrarTooltip && (
                <span className={styles.tooltip}>
                  {b.etiqueta} · {b.valor} {b.valor === 1 ? unidadSingular : unidad}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Números bajo el eje: solo en las posiciones de marcasEje */}
      <div className={styles.eje}>
        {barras.map((_, i) => (
          <span key={i} className={styles.ejeMarca}>
            {marcasEje.includes(i + 1) ? i + 1 : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
