import { useState } from "react";
import styles from "../../css/InicioVeterinario.module.css";
import { URGENCIAS_ALTAS } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { getInicioVeterinario } from "../../Api/getInfo";
import { actualizarMiCita } from "../../Api/postInfo";
import { formatFechaTitulo, saludoSegunHora } from "../../lib/fechas";
import type { CambioCita, InicioVeterinarioDatos, InicioVeterinarioProps } from "../../interfaces";
import { Indicador } from "../ui/Indicador";
import { ProximaCita } from "./ProximaCita";
import { AgendaHoy } from "./AgendaHoy";
import { PendientesVeterinario } from "./PendientesVeterinario";
import { AtencionesMes } from "./AtencionesMes";

// Datos vacíos mientras carga o si el veterinario aún no tiene ficha
const SIN_DATOS: InicioVeterinarioDatos = {
  citasHoy: [],
  porConfirmar: 0,
  urgenciasPorConfirmar: [],
  controlesProximos: [],
  recetasRecientes: [],
  atencionesPorDia: [],
};

// Pantalla de inicio del veterinario: pide los datos y arma las piezas.
// Cada pieza (ProximaCita, AgendaHoy, ...) solo recibe props y dibuja.
export const InicioVeterinario = ({ veterinarioId, nombre, onRecetar }: InicioVeterinarioProps) => {
  const [recarga, setRecarga] = useState(0);
  const { datos = SIN_DATOS, error } = useConsulta(
    // -1 = todavía no se sabe el id de veterinario: no se consulta nada
    () => (veterinarioId > 0 ? getInicioVeterinario(veterinarioId) : Promise.resolve(SIN_DATOS)),
    [veterinarioId, recarga]
  );
  const [ocupado, setOcupado] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const { citasHoy } = datos;

  // Indicadores del día
  const atendidas = citasHoy.filter((c) => c.estado === "completada").length;
  const urgentes = citasHoy.filter((c) => {
    const urgencia = c.urgencia ?? c.urgenciaSugerida; // si no la confirmó, vale la sugerida
    return urgencia !== null && URGENCIAS_ALTAS.includes(urgencia);
  }).length;

  // Próxima cita: la que está en curso; si no hay, la primera que falta atender
  const proxima =
    citasHoy.find((c) => c.estado === "en_curso") ??
    citasHoy.find((c) => c.estado === "pendiente" || c.estado === "confirmada");

  // Confirmar / iniciar / finalizar, o fijar la urgencia; después se recarga todo
  const cambiarCita = async (citaId: number, cambio: CambioCita) => {
    setOcupado(true);
    setErrorAccion(null);
    try {
      await actualizarMiCita(citaId, cambio);
      setRecarga((n) => n + 1);
    } catch (e) {
      setErrorAccion(e instanceof Error ? e.message : "No se pudo actualizar la cita.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className={styles.inicio}>
      <header>
        <h1 className={styles.saludo}>{saludoSegunHora()}, {nombre.split(" ")[0]}</h1>
        <p className={styles.fecha}>{formatFechaTitulo()}</p>
      </header>

      {(error || errorAccion) && <div className={styles.error}>{errorAccion ?? error}</div>}

      <div className={styles.indicadores}>
        <Indicador etiqueta="Citas hoy" valor={citasHoy.length} />
        <Indicador
          etiqueta="Atendidas"
          valor={`${atendidas} de ${citasHoy.length}`}
          progreso={citasHoy.length ? atendidas / citasHoy.length : 0}
        />
        <Indicador etiqueta="Urgentes" valor={urgentes} tono={urgentes > 0 ? "alerta" : "normal"} />
        <Indicador etiqueta="Por confirmar" valor={datos.porConfirmar} />
      </div>

      <div className={styles.columnas}>
        {/* Izquierda: todo lo de HOY */}
        <div className={styles.columnaIzquierda}>
          <ProximaCita cita={proxima} ocupado={ocupado} onCambiar={cambiarCita} onRecetar={onRecetar} />
          <AgendaHoy citas={citasHoy} destacadaId={proxima?.id} />
        </div>

        {/* Derecha: lo que viene más adelante */}
        <PendientesVeterinario
          urgencias={datos.urgenciasPorConfirmar}
          controles={datos.controlesProximos}
          recetas={datos.recetasRecientes}
        />
      </div>

      {datos.atencionesPorDia.length > 0 && <AtencionesMes atencionesPorDia={datos.atencionesPorDia} />}
    </div>
  );
};
