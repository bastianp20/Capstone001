import { useState } from "react";
import { getMiHorarioAtencion, getMiTelefonoEnUrgencias } from "../Api/getInfo";
import { cambiarTelefonoUrgencias, guardarMiHorarioAtencion } from "../Api/postInfo";
import { useConsulta } from "./useConsulta";
import { useAccion } from "./useAccion";
import { claveLugar, diasDesdeCentro, formDesdeHorario, tramosDesdeForm, validarTramos } from "../lib/horarioAtencion";
import type { DiaHorarioForm, EstadoHorarioAtencion, LugarAtencion } from "../interfaces";

// Estado de la pantalla "Mi horario de atención": parte de lo guardado, deja
// editar (días por lugar, duración, urgencias 24/7, dónde atiende) y lo guarda.
// Lo editado se guarda aparte ("cambios") y se superpone a lo que vino de la base.
export const useHorarioAtencion = (onGuardado?: () => void) => {
  const { datos, cargando, error: errorCarga } = useConsulta(getMiHorarioAtencion, []);
  const { datos: telefono } = useConsulta(getMiTelefonoEnUrgencias, []);
  const [cambios, setCambios] = useState<Partial<EstadoHorarioAtencion>>({});
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error: errorGuardar } = useAccion();

  const actual: EstadoHorarioAtencion = {
    mostrarTelefono: telefono?.mostrar ?? false,
    form: datos ? formDesdeHorario(datos) : {},
    duracion: datos?.duracion ?? 30,
    urgencias247: datos?.urgencias247 ?? false,
    aDomicilio: datos?.aDomicilio ?? false,
    comunas: datos?.comunas ?? [],
    ...cambios,
  };

  const cambiar = (cambio: Partial<EstadoHorarioAtencion>) => {
    setGuardado(false);
    setErrorForm(null);
    setCambios((c) => ({ ...c, ...cambio }));
  };

  const cambiarDia = (lugar: LugarAtencion, indice: number, cambio: Partial<DiaHorarioForm>) => {
    const clave = claveLugar(lugar.centroId);
    const dias = (actual.form[clave] ?? []).map((d, i) => (i === indice ? { ...d, ...cambio } : d));
    cambiar({ form: { ...actual.form, [clave]: dias } });
  };

  const usarHorarioCentro = (lugar: LugarAtencion) =>
    cambiar({ form: { ...actual.form, [claveLugar(lugar.centroId)]: diasDesdeCentro(lugar) } });

  const guardar = async () => {
    if (!datos) return;
    const tramos = tramosDesdeForm(datos.lugares, actual.form);
    const problema = validarTramos(tramos);
    if (problema) {
      setErrorForm(problema);
      return;
    }
    const { duracion, urgencias247, aDomicilio, comunas, mostrarTelefono } = actual;
    const ok = await ejecutar(async () => {
      await guardarMiHorarioAtencion({ tramos, duracion, urgencias247, aDomicilio, comunas });
      // Sin urgencias 24/7 no tiene sentido aparecer en /urgencias
      await cambiarTelefonoUrgencias(urgencias247 && mostrarTelefono);
    }, "No se pudo guardar el horario.");
    if (ok) {
      setGuardado(true);
      onGuardado?.();
    }
  };

  return {
    horario: datos,
    cargando,
    ...actual,
    setDuracion: (duracion: number) => cambiar({ duracion }),
    setUrgencias247: (urgencias247: boolean) => cambiar({ urgencias247 }),
    setADomicilio: (aDomicilio: boolean) => cambiar({ aDomicilio }),
    setComunas: (comunas: string[]) => cambiar({ comunas }),
    setMostrarTelefono: (mostrarTelefono: boolean) => cambiar({ mostrarTelefono }),
    tieneTelefono: telefono?.tieneTelefono ?? false,
    cambiarDia,
    usarHorarioCentro,
    guardar,
    ocupado,
    error: errorForm ?? errorGuardar ?? errorCarga ?? null,
    guardado,
  };
};
