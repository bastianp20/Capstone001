import { useMemo, useState } from 'react';

import { getCentrosParaCita, getVeterinariosDeCentro, getVeterinariosIndependientes } from '@/Api/getInfo';
import { solicitarCita } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { ESPECIALIDAD_POR_DEFECTO, SIN_PREFERENCIA_VETERINARIO, TEXTOS_PEDIR_HORA } from '@/constants/constants';
import { useDatosDueno } from '@/context/DatosDuenoContext';
import type { DestinoCita } from '@/interfaces';
import { diasDisponibles, horarioDelDia, horasDisponibles } from '@/lib/agenda';
import { aFechaHoraIso } from '@/lib/fechas';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';

/** Formulario "Pedir hora": mascota, dónde, veterinario, día, hora, motivo y síntomas (igual que la web). */
export function usePedirHora(mascotaIdInicial: number | null) {
  const { usuarioActual } = useAuth();
  const { mascotas, recargar } = useDatosDueno();

  // Cuenta de prueba → solo centros de prueba; cuenta real → solo reales (la base lo vuelve a revisar)
  const consultaCentros = useConsulta(() => getCentrosParaCita(), []);
  const centros = (consultaCentros.datos ?? []).filter((c) => c.esPrueba === (usuarioActual?.esPrueba ?? false));

  const [mascotaId, setMascotaId] = useState<number | null>(mascotaIdInicial ?? (mascotas.length === 1 ? mascotas[0].id : null));
  const [destino, setDestino] = useState<DestinoCita>(null);
  const [veterinarioId, setVeterinarioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [enviada, setEnviada] = useState(false);
  const { ejecutar, ocupado, error, setError } = useAccion();

  const esIndependiente = destino === 'independiente';
  const centro = typeof destino === 'number' ? (centros.find((c) => c.id === destino) ?? null) : null;

  const consultaVeterinarios = useConsulta(
    () =>
      esIndependiente
        ? getVeterinariosIndependientes()
        : centro
          ? getVeterinariosDeCentro(centro.id)
          : Promise.resolve([]),
    [destino],
  );
  const veterinarios = consultaVeterinarios.datos ?? [];
  const veterinario = veterinarios.find((v) => v.id === veterinarioId) ?? null;

  const horarios = centro?.horarios ?? null; // independiente o sin elegir → horario general
  const dias = useMemo(() => (destino === null ? [] : diasDisponibles(horarios)), [destino, horarios]);
  const horas = useMemo(() => (fecha ? horasDisponibles(fecha, horarios) : []), [fecha, horarios]);

  const textoHorario = (() => {
    if (!centro || !fecha) return null;
    if (centro.horarios.length === 0) return TEXTOS_PEDIR_HORA.sinHorarioRegistrado;
    const h = horarioDelDia(fecha, centro.horarios);
    if (!h) return TEXTOS_PEDIR_HORA.centroCerrado;
    const colacion = h.inicioColacion ? `${h.inicioColacion} a ${h.finColacion}` : null;
    return TEXTOS_PEDIR_HORA.horarioDelDia(h.abre, h.cierra, colacion);
  })();

  const opcionesVeterinario = [
    ...(esIndependiente ? [] : [{ valor: SIN_PREFERENCIA_VETERINARIO, texto: TEXTOS_PEDIR_HORA.sinPreferencia }]),
    ...veterinarios.map((v) => ({ valor: String(v.id), texto: v.nombre })),
  ];

  const elegirDestino = (nuevo: DestinoCita) => {
    setDestino(nuevo);
    setVeterinarioId(null); // el veterinario elegido podría no atender en el nuevo lugar
    setFecha(null);
    setHora(null);
    setError('');
  };

  const elegirFecha = (nueva: string) => {
    setFecha(nueva);
    setHora(null);
  };

  const elegirVeterinario = (valor: string) =>
    setVeterinarioId(valor === SIN_PREFERENCIA_VETERINARIO ? null : Number(valor));

  const alternarSintoma = (s: string) => setSintomas((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const enviar = async () => {
    if (!mascotaId || destino === null || !fecha || !hora || !motivo.trim()) return setError(TEXTOS_PEDIR_HORA.faltanDatos);
    if (esIndependiente && veterinarioId === null) return setError(TEXTOS_PEDIR_HORA.faltaVeterinario);

    const ok = await ejecutar(
      () =>
        solicitarCita({
          mascotaId,
          centroId: centro?.id ?? null,
          veterinarioId,
          fechaHora: aFechaHoraIso(fecha, hora),
          motivo,
          sintomas,
        }),
      TEXTOS_PEDIR_HORA.error,
    );
    if (ok) {
      setEnviada(true);
      recargar();
    }
  };

  return {
    mascotas,
    mascotaId,
    setMascotaId,
    centros,
    cargandoCentros: consultaCentros.cargando,
    errorCentros: consultaCentros.error,
    recargarCentros: consultaCentros.recargar,
    destino,
    elegirDestino,
    esIndependiente,
    veterinarios,
    cargandoVeterinarios: consultaVeterinarios.cargando,
    opcionesVeterinario,
    veterinarioSeleccionado: veterinarioId === null ? SIN_PREFERENCIA_VETERINARIO : String(veterinarioId),
    elegirVeterinario,
    especialidad: veterinario ? (veterinario.especialidad ?? ESPECIALIDAD_POR_DEFECTO) : null,
    dias,
    fecha,
    elegirFecha,
    horas,
    hora,
    setHora,
    textoHorario,
    motivo,
    setMotivo,
    sintomas,
    alternarSintoma,
    enviar,
    enviando: ocupado,
    error,
    enviada,
    lugarElegido: esIndependiente ? (veterinario?.nombre ?? TEXTOS_PEDIR_HORA.independiente) : (centro?.nombre ?? ''),
  };
}
