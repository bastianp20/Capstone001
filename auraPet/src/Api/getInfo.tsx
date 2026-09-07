

import type { Cita, CitaResumen, Mascota, RegistroHistorialMedico } from "../interfaces";
import { mascotasMock } from "../Data/Mascota";
import { historialMedicoMock } from "../Data/HistorialMedico";
import { citasMock } from "../Data/Cita";
import { usuariosMock } from "../Data/Usuarios";
import { veterinariosMock } from "../Data/Veterinarios";
import { centrosMock } from "../Data/Centros";

//  Aquí traemos las mascotas por el id del dueño
export const getMascotasPorDueno = (duenoId: string): Mascota[] =>
    mascotasMock.filter((m) => m.duenoId === duenoId
);

// Aquí traemos el historial medico de las mascotas mediante el id de la mascota, para poder mostrar su historial medico.
export const getHistorialPorMascota = (
  mascotaId: string): RegistroHistorialMedico[] =>
    historialMedicoMock
        .filter((h) => h.mascotaId === mascotaId)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1)
);

// Aquí traemos la info de las citas mediante el id del dueño, para poder mostrar las citas que tiene asignadas.
export const getCitasPorDueno = (duenoId: string): Cita[] =>
  citasMock.filter((c) => c.duenoId === duenoId
);

// Aquí traermos la info mediante el id del veterinario, para poder mostrar las citas que tiene asignadas.
export const getCitasPorVeterinario = (veterinarioId: string): Cita[] =>
  citasMock.filter((c) => c.veterinarioId === veterinarioId
);

// Formatea una fecha ISO a "dd/mm · HH:mm" para mostrarla en tablas.
const formatFechaHora = (iso: string): string => {
  const d = new Date(iso);
  const dia = String(d.getUTCDate()).padStart(2, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const hora = String(d.getUTCHours()).padStart(2, "0");
  const minutos = String(d.getUTCMinutes()).padStart(2, "0");
  return `${dia}/${mes} · ${hora}:${minutos}`;
};

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
