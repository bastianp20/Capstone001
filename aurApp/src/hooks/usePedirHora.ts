import { useMemo, useState } from 'react';

import { getCentrosParaCita } from '@/Api/getInfo';
import { solicitarCita } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { SIN_PREFERENCIA_VETERINARIO, TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { useDatosDueno } from '@/context/DatosDuenoContext';
import type { DestinoCita, ModoDestinoCita, OpcionDestinoCita, PasoPedirHora } from '@/interfaces';
import { diasDisponibles, horarioDelDia, horasDisponibles } from '@/lib/agenda';
import { opcionesCentros, opcionesIndependientes } from '@/lib/especialidades';
import { aFechaHoraIso } from '@/lib/fechas';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';
import { useFiltroEspecialidadesCita } from './useFiltroEspecialidadesCita';

/**
 * "Pedir hora" en 3 pasos (igual que la web, más el filtro de especialidades):
 *   0 · Mascota: para quién, motivo y síntomas.
 *   1 · Dónde: centros o independientes, filtrados por lo que necesita la mascota.
 *   2 · Día y hora: con quién (en un centro), el día y la hora.
 */
export function usePedirHora(mascotaIdInicial: number | null) {
  const { usuarioActual } = useAuth();
  const { mascotas, recargar } = useDatosDueno();
  const filtro = useFiltroEspecialidadesCita();

  // Cuenta de prueba → solo centros de prueba; cuenta real → solo reales (la base lo vuelve a revisar)
  const consultaCentros = useConsulta(() => getCentrosParaCita(), []);
  const centros = useMemo(
    () => (consultaCentros.datos ?? []).filter((c) => c.esPrueba === (usuarioActual?.esPrueba ?? false)),
    [consultaCentros.datos, usuarioActual?.esPrueba],
  );

  const [paso, setPaso] = useState<PasoPedirHora>(0);
  const [mascotaId, setMascotaId] = useState<number | null>(mascotaIdInicial ?? (mascotas.length === 1 ? mascotas[0].id : null));
  const [motivo, setMotivo] = useState('');
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [modo, setModo] = useState<ModoDestinoCita>('centros');
  const [destino, setDestino] = useState<DestinoCita>(null);
  const [veterinarioId, setVeterinarioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [enviada, setEnviada] = useState(false);
  const { ejecutar, ocupado, error, setError, limpiarError } = useAccion();

  // ---- Paso 2: las tarjetas ----
  const opciones = useMemo(
    () =>
      modo === 'centros'
        ? opcionesCentros(centros, filtro.queCumplen, filtro.nombresElegidos)
        : opcionesIndependientes(filtro.queCumplen, filtro.nombresElegidos),
    [modo, centros, filtro.queCumplen, filtro.nombresElegidos],
  );
  const claveElegida = destino === null ? null : destino === 'independiente' ? `v-${veterinarioId}` : `c-${destino}`;
  // Si el filtro o la pestaña la dejan fuera, cuenta como no elegida
  const opcionElegida = opciones.find((o) => o.clave === claveElegida) ?? null;

  const centro = typeof destino === 'number' ? (centros.find((c) => c.id === destino) ?? null) : null;
  const esIndependiente = destino === 'independiente';

  // ---- Paso 3: con quién, día y hora ----
  const conFiltro = filtro.seleccion.length > 0;
  const veterinariosCentro = centro ? filtro.queCumplen.filter((p) => p.centroId === centro.id) : [];
  const opcionesVeterinario = centro
    ? [
        ...(conFiltro ? [] : [{ valor: SIN_PREFERENCIA_VETERINARIO, texto: T.sinPreferencia }]),
        ...veterinariosCentro.map((v) => ({ valor: String(v.veterinarioId), texto: v.nombre })),
      ]
    : [];
  const veterinarioValido = esIndependiente || veterinariosCentro.some((v) => v.veterinarioId === veterinarioId) ? veterinarioId : null;

  const horarios = centro?.horarios ?? null; // independiente → horario general
  const dias = useMemo(() => (destino === null ? [] : diasDisponibles(horarios)), [destino, horarios]);
  const horas = useMemo(() => (fecha ? horasDisponibles(fecha, horarios) : []), [fecha, horarios]);

  const ayudaDia = (() => {
    if (!centro || !fecha) return undefined;
    if (centro.horarios.length === 0) return T.sinHorarioRegistrado;
    const h = horarioDelDia(fecha, centro.horarios);
    if (!h) return T.centroCerrado;
    return T.horarioDelDia(h.abre, h.cierra, h.inicioColacion ? `${h.inicioColacion} a ${h.finColacion}` : null);
  })();

  // ---- Acciones ----
  const elegirOpcion = (o: OpcionDestinoCita) => {
    setDestino(o.destino);
    setVeterinarioId(o.veterinarioId);
    setFecha(null);
    setHora(null);
    limpiarError();
  };

  const elegirFecha = (nueva: string) => {
    setFecha(nueva);
    setHora(null);
  };

  const irA = (nuevo: PasoPedirHora) => {
    limpiarError();
    setPaso(nuevo);
  };

  /** Valida el paso actual; si está bien, pasa al siguiente. */
  const continuar = () => {
    if (paso === 0) {
      if (!mascotaId || !motivo.trim()) return setError(T.faltaMascota);
      return irA(1);
    }
    if (!opcionElegida) return setError(T.faltaDestino);
    irA(2);
  };

  const enviar = async () => {
    if (!mascotaId || destino === null || !fecha || !hora) return setError(T.faltaDiaHora);
    if (esIndependiente && veterinarioValido === null) return setError(T.faltaVeterinario);
    if (centro && conFiltro && veterinarioValido === null) return setError(T.faltaVeterinarioFiltro);

    const ok = await ejecutar(
      () => solicitarCita({ mascotaId, centroId: centro?.id ?? null, veterinarioId: veterinarioValido, fechaHora: aFechaHoraIso(fecha, hora), motivo, sintomas }),
      T.error,
    );
    if (ok) {
      setEnviada(true);
      recargar();
    }
  };

  return {
    paso,
    continuar,
    volver: () => irA(Math.max(0, paso - 1) as PasoPedirHora),
    irAMascota: () => irA(0),
    // Paso 1
    mascotas,
    mascota: mascotas.find((m) => m.id === mascotaId) ?? null,
    mascotaId,
    setMascotaId,
    motivo,
    setMotivo,
    sintomas,
    alternarSintoma: (s: string) => setSintomas((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])),
    // Paso 2
    filtro: {
      especialidades: filtro.especialidades,
      seleccion: filtro.seleccion,
      onAlternar: filtro.alternar,
      onQuitar: filtro.quitar,
    },
    modo,
    setModo,
    opciones,
    claveElegida: opcionElegida?.clave ?? null,
    elegirOpcion,
    resumen: modo === 'centros' ? T.resumenLugares(opciones.length, filtro.nombresElegidos) : T.resumenProfesionales(opciones.length, filtro.nombresElegidos),
    cargandoDestinos: consultaCentros.cargando || filtro.cargando,
    errorDestinos: !!consultaCentros.error || filtro.error,
    recargarDestinos: () => {
      consultaCentros.recargar();
      filtro.recargar();
    },
    // Paso 3
    lugar: opcionElegida?.titulo ?? '',
    opcionesVeterinario,
    veterinarioSeleccionado: veterinarioValido === null ? SIN_PREFERENCIA_VETERINARIO : String(veterinarioValido),
    elegirVeterinario: (valor: string) => setVeterinarioId(valor === SIN_PREFERENCIA_VETERINARIO ? null : Number(valor)),
    ayudaVeterinario: centro && conFiltro ? T.conEspecialidad : undefined,
    dias,
    fecha,
    elegirFecha,
    ayudaDia,
    horas,
    hora,
    setHora,
    // Envío
    enviar,
    enviando: ocupado,
    error,
    enviada,
  };
}
