
import type { Cita, CitaResumen, EstadoCita, Mascota, UrgenciaCita,
CitaProximaDueno, RegistroHistorialMedico, HistorialRecienteItem } from "../interfaces";
import { mascotasMock } from "../Data/Mascota";
import { historialMedicoMock } from "../Data/HistorialMedico";
import { citasMock } from "../Data/Cita";
import { usuariosMock } from "../Data/Usuarios";
import { veterinariosMock } from "../Data/Veterinarios";
import { centrosMock } from "../Data/Centros";
import { formatFechaCaja, formatFechaLarga } from "../constants";

//  Aquí traemos las mascotas por el id del dueño
export const getMascotasPorDueno = (duenoId: number): Mascota[] =>
    mascotasMock.filter((m) => m.duenoId === duenoId
);

// Aquí traemos el historial medico de las mascotas mediante el id de la mascota, para poder mostrar su historial medico.
export const getHistorialPorMascota = (
  mascotaId: number): RegistroHistorialMedico[] =>
    historialMedicoMock
        .filter((h) => h.mascotaId === mascotaId)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1)
);

// Aquí traemos la info de las citas mediante el id del dueño, para poder mostrar las citas que tiene asignadas.
export const getCitasPorDueno = (duenoId: number): Cita[] =>
  citasMock.filter((c) => c.duenoId === duenoId
);

// Aquí traermos la info mediante el id del veterinario, para poder mostrar las citas que tiene asignadas.
export const getCitasPorVeterinario = (veterinarioId: number): Cita[] =>
  citasMock.filter((c) => c.veterinarioId === veterinarioId
);

// fechaHora / fecha llegan como number en formato YYYYMMDDHHmm (ver
// interfaces.ts), así que primero los pasamos a string para poder
// extraer año, mes, día, hora y minutos por posición.
const formatFechaHora = (fechaHora: number): string => {
  const s = String(fechaHora).padStart(12, "0");
  const dia = s.slice(6, 8);
  const mes = s.slice(4, 6);
  const hora = s.slice(8, 10);
  const minutos = s.slice(10, 12);
  return `${dia}/${mes} · ${hora}:${minutos}`;
};

// Formatea solo la hora, en formato 12h (para la agenda del veterinario).
const formatHora12h = (fechaHora: number): string => {
  const s = String(fechaHora).padStart(12, "0");
  let horas = Number(s.slice(8, 10));
  const minutos = s.slice(10, 12);
  const sufijo = horas >= 12 ? "PM" : "AM";
  horas = horas % 12;
  if (horas === 0) horas = 12;
  return `${horas}:${minutos} ${sufijo}`;
};

const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Antes existía un segundo archivo (Data/Citas.ts) con un "citasMock"
// distinto, escrito a mano con los nombres ya aplanados. Eso duplicaba
// la fuente de verdad y se desincronizaba fácil. Esta función resuelve
// el detalle (mascota, dueño, veterinario, centro) a partir del único
// modelo relacional (Data/Cita.ts) — igual que haría una query real
// con JOIN una vez que esto se conecte a Supabase.
export const getCitasResumen = (): CitaResumen[] =>
  citasMock.map((c) => {
    const mascota = mascotasMock.find((m) => m.id === c.mascotaId);
    const dueno = usuariosMock.find((u) => u.id === c.duenoId);
    const veterinario = c.veterinarioId
      ? veterinariosMock.find((v) => v.id === c.veterinarioId)
      : undefined;
    const veterinarioUsuario = veterinario
      ? usuariosMock.find((u) => u.id === veterinario.usuarioId)
      : undefined;
    const centro = centrosMock.find((ce) => ce.id === c.centroId);

    return {
      id: c.id,
      mascota: mascota?.nombre ?? "Mascota desconocida",
      dueno: dueno?.nombre ?? "Dueño desconocido",
      veterinario: veterinarioUsuario?.nombre ?? "Sin asignar",
      centro: centro?.nombre ?? "Centro desconocido",
      fechaHora: formatFechaHora(c.fechaHora),
      estado: c.estado,
      urgencia: c.urgencia,
    };
  });

// ---------- Vista "Mi Agenda" del veterinario ----------

export interface CitaAgendaItem {
  id: number;
  hora: string;
  mascota: string;
  especie: string;
  raza: string;
  dueno: string;
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
}

export interface InfoVeterinario {
  nombre: string;
  centros: string[];
}

// Nombre y centros del veterinario — hasta que exista login real,
// VeterinarioScreen decide a mano qué veterinarioId está "logueado" y usa
// esto para mostrar su nombre y centro(s) en la barra superior.
export const getInfoVeterinario = (veterinarioId: number): InfoVeterinario => {
  const veterinario = veterinariosMock.find((v) => v.id === veterinarioId);
  const usuario = veterinario ? usuariosMock.find((u) => u.id === veterinario.usuarioId) : undefined;
  const centros = veterinario
    ? veterinario.centroIds
        .map((centroId) => centrosMock.find((c) => c.id === centroId)?.nombre)
        .filter((nombre): nombre is string => Boolean(nombre))
    : [];

  return {
    nombre: usuario?.nombre ?? "Veterinario",
    centros,
  };
};

// Agenda de citas de un veterinario, resuelta desde Data/Cita.ts (el
// único modelo real) uniendo mascota y dueño. Ordenada por hora.
// Nota: por ahora trae TODAS sus citas, sin filtrar por "hoy" — el
// mock no tiene suficientes citas con fecha de hoy para verse bien;
// cuando esto se conecte a Supabase, el filtro por fecha lo hace la
// query (WHERE fecha_hora::date = CURRENT_DATE).
export const getAgendaVeterinario = (veterinarioId: number): CitaAgendaItem[] =>
  citasMock
    .filter((c) => c.veterinarioId === veterinarioId)
    .sort((a, b) => a.fechaHora - b.fechaHora)
    .map((c) => {
      const mascota = mascotasMock.find((m) => m.id === c.mascotaId);
      const dueno = usuariosMock.find((u) => u.id === c.duenoId);

      return {
        id: c.id,
        hora: formatHora12h(c.fechaHora),
        mascota: mascota?.nombre ?? "Mascota desconocida",
        especie: mascota ? capitalize(mascota.especie) : "—",
        raza: mascota?.raza ?? "—",
        dueno: dueno?.nombre ?? "Dueño desconocido",
        motivo: c.motivo,
        estado: c.estado,
        urgencia: c.urgencia,
      };
    });

  export const getPacienteByVeterinarioId = (veterinarioId: number) => {
    const citasVet = citasMock.filter((c) => c.veterinarioId === veterinarioId);
    const citasPorMascota = new Map<number, Cita[]>();
    citasVet.forEach((c) => {
    const citas = citasPorMascota.get(c.mascotaId) ?? [];
    citas.push(c);
    citasPorMascota.set(c.mascotaId, citas);
    }); 
      return Array.from(citasPorMascota.entries())
    .map(([mascotaId, citas]) => {
      const mascota = mascotasMock.find((m) => m.id === mascotaId);
      const dueno = mascota ? usuariosMock.find((u) => u.id === mascota.duenoId) : undefined;
      const ultimaCita = [...citas].sort((a, b) => b.fechaHora - a.fechaHora)[0];
    return {
        id: mascotaId,
        nombre: mascota?.nombre ?? "Mascota desconocida",
        especie: mascota ? capitalize(mascota.especie) : "—",
        raza: mascota?.raza ?? "—",
        dueno: dueno?.nombre ?? "Dueño desconocido",
        ultimaVisita: formatFechaHora(ultimaCita.fechaHora),
        totalVisitas: citas.length,
      };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};

// ---------- Vista "Inicio" del dueño ----------

export const getProximasCitasDueno = (duenoId: number): CitaProximaDueno[] =>
  citasMock
    .filter((c) => c.duenoId === duenoId)
    .sort((a, b) => a.fechaHora - b.fechaHora)
    .map((c) => {
      const mascota = mascotasMock.find((m) => m.id === c.mascotaId);
      const centro = centrosMock.find((ce) => ce.id === c.centroId);
      const { dia, mes } = formatFechaCaja(c.fechaHora);

      return {
        id: c.id,
        mascotaId: c.mascotaId,
        mascota: mascota?.nombre ?? "Mascota desconocida",
        centro: centro?.nombre ?? "Centro desconocido",
        dia,
        mes,
        motivo: c.motivo,
        estado: c.estado,
        urgencia: c.urgencia,
      };
    });

// Junta el historial de TODAS las mascotas de este dueño (no de una sola),
// ordenado del más reciente al más antiguo — para el panel "Historial
// reciente" de Inicio. `limite` corta cuántos mostrar ahí.
export const getHistorialRecienteDueno = (duenoId: number, limite = 5): HistorialRecienteItem[] => {
  const mascotaIds = getMascotasPorDueno(duenoId).map((m) => m.id);

  return historialMedicoMock
    .filter((h) => mascotaIds.includes(h.mascotaId))
    .sort((a, b) => b.fecha - a.fecha)
    .slice(0, limite)
    .map((h) => {
      const mascota = mascotasMock.find((m) => m.id === h.mascotaId);
      return {
        id: h.id,
        mascota: mascota?.nombre ?? "Mascota desconocida",
        descripcion: h.descripcion,
        fecha: formatFechaLarga(h.fecha),
      };
    });
};
