import { useState } from 'react';

import { getMiHorarioAtencion, getMiTelefonoEnUrgencias, getProgresoPerfilVeterinario } from '@/Api/getInfo';
import { cambiarTelefonoUrgencias, guardarMiHorarioAtencion, registrarMiColegiado } from '@/Api/postInfo';
import { TEXTOS_HORARIO_ATENCION as T } from '@/constants/constants';
import type { DiaHorarioForm, EstadoHorarioAtencion, LugarAtencion } from '@/interfaces';
import { claveLugar, diasDesdeCentro, formDesdeHorario, normalizarHora, tramosDesdeForm, validarTramos } from '@/lib/horarioAtencion';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';

const cargar = async () => {
  const [horario, telefono, progreso] = await Promise.all([getMiHorarioAtencion(), getMiTelefonoEnUrgencias(), getProgresoPerfilVeterinario()]);
  return { horario, telefono, faltaColegiado: progreso?.colegiado === false };
};

/**
 * Pantalla "Mi horario": parte de lo guardado y lo editado se superpone ("cambios"),
 * igual que en la web. Guarda horario, urgencias 24/7, zona y si muestra su teléfono.
 */
export function useHorarioAtencion() {
  const { datos, cargando, error: errorCarga, recargar } = useConsulta(cargar, []);
  const [cambios, setCambios] = useState<Partial<EstadoHorarioAtencion>>({});
  const [errorForm, setErrorForm] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [colegiado, setColegiado] = useState('');
  const accion = useAccion();
  const accionColegiado = useAccion();

  const h = datos?.horario;
  const actual: EstadoHorarioAtencion = {
    form: h ? formDesdeHorario(h) : {},
    duracion: h?.duracion ?? 30,
    urgencias247: h?.urgencias247 ?? false,
    aDomicilio: h?.aDomicilio ?? false,
    comunas: h?.comunas ?? [],
    mostrarTelefono: datos?.telefono.mostrar ?? false,
    ...cambios,
  };

  const cambiar = (cambio: Partial<EstadoHorarioAtencion>) => {
    setGuardado(false);
    setErrorForm('');
    setCambios((c) => ({ ...c, ...cambio }));
  };

  const cambiarDia = (lugar: LugarAtencion, indice: number, cambio: Partial<DiaHorarioForm>) => {
    const clave = claveLugar(lugar.centroId);
    cambiar({ form: { ...actual.form, [clave]: (actual.form[clave] ?? []).map((d, i) => (i === indice ? { ...d, ...cambio } : d)) } });
  };

  const guardar = async () => {
    if (!h) return;
    // "9:30" → "09:30" antes de revisar y enviar
    const tramos = tramosDesdeForm(h.lugares, actual.form).map((t) => ({
      ...t, desde: normalizarHora(t.desde) ?? t.desde, hasta: normalizarHora(t.hasta) ?? t.hasta,
    }));
    const problema = validarTramos(tramos);
    if (problema) return setErrorForm(problema);
    const ok = await accion.ejecutar(async () => {
      await guardarMiHorarioAtencion({ tramos, duracion: actual.duracion, urgencias247: actual.urgencias247, aDomicilio: actual.aDomicilio, comunas: actual.comunas });
      await cambiarTelefonoUrgencias(actual.urgencias247 && actual.mostrarTelefono);
    }, T.guardando);
    if (ok) {
      setGuardado(true);
      setCambios({});
      recargar();
    }
  };

  const guardarColegiado = async () => {
    if (await accionColegiado.ejecutar(() => registrarMiColegiado(colegiado), T.colegiado)) recargar();
  };

  return {
    horario: h,
    cargando,
    errorCarga,
    ...actual,
    cambiarDia,
    usarHorarioCentro: (lugar: LugarAtencion) => cambiar({ form: { ...actual.form, [claveLugar(lugar.centroId)]: diasDesdeCentro(lugar) } }),
    setDuracion: (duracion: number) => cambiar({ duracion }),
    setUrgencias247: (urgencias247: boolean) => cambiar({ urgencias247 }),
    setADomicilio: (aDomicilio: boolean) => cambiar({ aDomicilio }),
    setComunas: (comunas: string[]) => cambiar({ comunas }),
    setMostrarTelefono: (mostrarTelefono: boolean) => cambiar({ mostrarTelefono }),
    tieneTelefono: datos?.telefono.tieneTelefono ?? false,
    faltaColegiado: datos?.faltaColegiado ?? false,
    colegiado,
    setColegiado,
    guardarColegiado,
    guardandoColegiado: accionColegiado.ocupado,
    errorColegiado: accionColegiado.error,
    guardar,
    guardando: accion.ocupado,
    error: errorForm || accion.error,
    guardado,
  };
}
