import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { getDestinosDerivacion, getEspecialidades } from '@/Api/getInfo';
import { crearDerivacion } from '@/Api/postInfo';
import { DERIVACION_VACIA, TEXTOS_DERIVAR_ATENCION as T } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { TipoDestinoDerivacion } from '@/interfaces';
import { especialidadesFiltrables } from '@/lib/especialidades';
import { esErrorDeRed } from '@/lib/red';

import { useAccion } from './useAccion';
import { useBorrador } from './useBorrador';
import { useConsulta } from './useConsulta';
import { useProgresoAtencion } from './useProgresoAtencion';

/** "Derivar": filtrar colegas o centros por especialidad, elegir uno, escribir el motivo y enviar. */
export function useDerivarPaciente(citaId: number) {
  const { datos } = useVeterinario();
  const cita = datos?.citas.find((c) => c.id === citaId) ?? null;
  const destinos = useConsulta(getDestinosDerivacion, []);
  const catalogo = useConsulta(getEspecialidades, []);
  const b = useBorrador(`derivacion-${citaId}`, DERIVACION_VACIA);
  const { marcar } = useProgresoAtencion(citaId);
  const { ejecutar, ocupado, error, setError } = useAccion();
  const [sinConexion, setSinConexion] = useState(false);
  const [modo, setModo] = useState<TipoDestinoDerivacion>('veterinario');
  const [seleccion, setSeleccion] = useState<number[]>([]);

  const especialidades = useMemo(() => especialidadesFiltrables(catalogo.datos ?? []), [catalogo.datos]);
  const nombres = especialidades.filter((e) => seleccion.includes(e.id)).map((e) => e.nombre);
  const visibles = useMemo(
    () => (destinos.datos ?? []).filter((d) => d.tipo === modo && seleccion.every((id) => d.especialidadIds.includes(id))),
    [destinos.datos, modo, seleccion],
  );
  const elegido = (destinos.datos ?? []).find((d) => d.clave === b.valor.destino) ?? null;

  const enviar = async () => {
    if (!cita) return;
    if (!elegido) return setError(T.faltaDestino);
    if (!b.valor.motivo.trim()) return setError(T.faltaMotivo);
    const ok = await ejecutar(() => crearDerivacion(cita.mascotaId, elegido, b.valor.motivo), T.error);
    if (!ok) return setSinConexion(true);
    setSinConexion(false);
    marcar({ derivada: true });
    await b.limpiar();
    router.back();
  };

  return {
    cita,
    filtro: {
      especialidades,
      seleccion,
      onAlternar: (id: number) => setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
      onQuitar: () => setSeleccion([]),
    },
    modo,
    setModo,
    visibles,
    resumen: T.resumen(visibles.length, modo, nombres),
    elegidoClave: elegido?.clave ?? null,
    elegir: (clave: string) => b.cambiar({ destino: clave }),
    motivo: b.valor.motivo,
    setMotivo: (motivo: string) => b.cambiar({ motivo }),
    guardadoEn: b.guardadoEn,
    cargando: destinos.cargando,
    errorCarga: !!destinos.error,
    recargar: destinos.recargar,
    enviar,
    enviando: ocupado,
    error,
    sinConexion: sinConexion && esErrorDeRed(error),
  };
}
