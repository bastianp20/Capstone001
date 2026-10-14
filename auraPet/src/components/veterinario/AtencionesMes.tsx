import styles from "../../css/InicioVeterinario.module.css";
import { MARCAS_EJE_MES } from "../../constants";
import { nombreMes, rangosDeFecha } from "../../lib/fechas";
import type { AtencionesMesProps, BarraGrafico } from "../../interfaces";
import { TarjetaPanel } from "../ui/TarjetaPanel";
import { GraficoBarras } from "../ui/GraficoBarras";

// Gráfico de atenciones completadas por día en el mes actual.
// Los días que aún no llegan se muestran tenues, sin altura.
export const AtencionesMes = ({ atencionesPorDia }: AtencionesMesProps) => {
  const { diaHoy } = rangosDeFecha();
  const mes = nombreMes();
  const mesCorto = mes.slice(0, 3); // "oct"
  const total = atencionesPorDia.reduce((suma, n) => suma + n, 0);

  const barras: BarraGrafico[] = atencionesPorDia.map((valor, i) => ({
    etiqueta: `${i + 1} ${mesCorto}`,
    valor,
    futuro: i + 1 > diaHoy,
    destacado: i + 1 === diaHoy,
  }));

  return (
    <TarjetaPanel titulo={`Atenciones de ${mes}`}>
      <div className={styles.totalMes}>
        <span className={styles.totalNumero}>{total}</span>
        <span className={styles.totalTexto}>{total === 1 ? "atención" : "atenciones"}</span>
      </div>
      <GraficoBarras barras={barras} marcasEje={MARCAS_EJE_MES} unidad="atenciones" unidadSingular="atención" />
    </TarjetaPanel>
  );
};
