import { useState } from "react";
import { getAgendaVeterinario, getMiHorarioAtencion } from "../Api/getInfo";
import { DIAS_HORAS_LIBRES } from "../constants";
import { useConsulta } from "./useConsulta";
import { useMiHorario } from "./useMiHorario";
import { armarSemana, horasLibres, lunesDe, sumarDias } from "../lib/agendaSemana";
import { fechaEnChile } from "../lib/fechas";
import type { DatosSemanaAgenda } from "../interfaces";

// Datos de "Mi Agenda": sus citas, su horario de atención y sus bloqueos,
// convertidos en la semana que se está mirando (se avanza o retrocede de a 7 días).
// · recargaExterna: sube cuando otra pantalla cambió citas (el modal de la agenda).
export const useMiAgendaSemana = (veterinarioId: number, recargaExterna: number) => {
  const [recarga, setRecarga] = useState(0);
  const [semanasDesdeHoy, setSemanasDesdeHoy] = useState(0);
  // "ahora" se toma una vez por carga, no en cada render
  const [ahora, setAhora] = useState(() => new Date());

  const { datos: citas = [], cargando: cargandoCitas, error: errorCitas } = useConsulta(
    () => (veterinarioId > 0 ? getAgendaVeterinario(veterinarioId) : Promise.resolve([])),
    [veterinarioId, recarga, recargaExterna],
  );
  const { datos: horario, cargando: cargandoHorario } = useConsulta(getMiHorarioAtencion, [recarga]);
  const bloqueos = useMiHorario(recarga + recargaExterna);

  const datos: DatosSemanaAgenda = {
    tramos: horario?.tramos ?? [],
    duracion: horario?.duracion ?? 30,
    citas,
    bloqueos: bloqueos.bloqueos,
    ahora,
  };

  const lunes = sumarDias(lunesDe(fechaEnChile(ahora.toISOString())), semanasDesdeHoy * 7);

  const recargar = () => {
    setAhora(new Date());
    setRecarga((n) => n + 1);
  };

  return {
    semana: armarSemana(lunes, datos),
    citas,
    duracion: datos.duracion,
    sinHorario: !cargandoHorario && datos.tramos.length === 0,
    horasLibres: () => horasLibres(datos, DIAS_HORAS_LIBRES),
    porConfirmar: citas.filter((c) => c.estado === "pendiente").length,
    cargando: cargandoCitas || cargandoHorario || bloqueos.cargando,
    error: errorCitas ?? bloqueos.error,
    semanaAnterior: () => setSemanasDesdeHoy((n) => n - 1),
    semanaSiguiente: () => setSemanasDesdeHoy((n) => n + 1),
    irAHoy: () => setSemanasDesdeHoy(0),
    esSemanaActual: semanasDesdeHoy === 0,
    quitarBloqueo: bloqueos.quitar,
    ocupado: bloqueos.ocupado,
    recargar,
  };
};
