import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Platform } from 'react-native';

import { getFichaPdf } from '@/Api/getInfo';
import { crearRecetaAtencion } from '@/Api/postInfo';
import { RECETA_VACIA, TEXTOS_FICHA_PDF, TEXTOS_RECETA_ATENCION as T } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { CanalReceta, MedicamentoReceta } from '@/interfaces';
import { armarHtmlReceta } from '@/lib/fichaPdf';
import { parsearFechaChilena } from '@/lib/fechas';
import { esErrorDeRed } from '@/lib/red';

import { useAccion } from './useAccion';
import { useBorrador } from './useBorrador';
import { useProgresoAtencion } from './useProgresoAtencion';

/**
 * "Nueva receta": medicamentos (agregar, editar, quitar), indicaciones y próximo control,
 * guardados como borrador; al guardar queda en la ficha y se comparte el PDF.
 */
export function useRecetaAtencion(citaId: number) {
  const { datos } = useVeterinario();
  const cita = datos?.citas.find((c) => c.id === citaId) ?? null;
  const b = useBorrador(`receta-${citaId}`, RECETA_VACIA);
  const { marcar } = useProgresoAtencion(citaId);
  const accion = useAccion();
  const pdf = useAccion();
  const [sinConexion, setSinConexion] = useState(false);
  const [recetaId, setRecetaId] = useState<number | null>(null);
  // Hoja del medicamento: null = cerrada; -1 = nuevo; n = editar el n-ésimo
  const [editando, setEditando] = useState<number | null>(null);

  const meds = b.valor.medicamentos;

  const guardarMedicamento = (m: MedicamentoReceta) => {
    b.cambiar((d) => ({
      ...d,
      medicamentos: editando === -1 || editando === null ? [...d.medicamentos, m] : d.medicamentos.map((x, i) => (i === editando ? m : x)),
    }));
    setEditando(null);
  };

  const quitarMedicamento = (indice: number) => b.cambiar((d) => ({ ...d, medicamentos: d.medicamentos.filter((_, i) => i !== indice) }));

  const guardar = async () => {
    if (!cita) return;
    const proximo = b.valor.proximoControl.trim() ? parsearFechaChilena(b.valor.proximoControl, true) : null;
    if (!meds.length) return accion.setError(T.sinMedicamentos);
    if (b.valor.proximoControl.trim() && !proximo) return accion.setError(T.fechaInvalida);

    let id = 0;
    const ok = await accion.ejecutar(async () => {
      id = await crearRecetaAtencion({ citaId, mascotaId: cita.mascotaId, medicamentos: meds, indicaciones: b.valor.indicaciones, proximoControl: proximo });
    }, T.error);
    if (!ok) return setSinConexion(true);
    setSinConexion(false);
    marcar({ medicamentos: meds.length });
    setRecetaId(id);
    await b.limpiar();
  };

  /** Arma el PDF de la receta y abre el menú del teléfono para enviarla (WhatsApp, correo) o guardarla. */
  const compartir = (canal: CanalReceta) =>
    pdf.ejecutar(async () => {
      if (!cita || !recetaId) return;
      const ficha = await getFichaPdf(cita.mascotaId);
      const html = armarHtmlReceta(ficha, recetaId);
      if (!html) throw new Error(T.errorPdf);
      if (Platform.OS === 'web') return Print.printAsync({ html });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: canal === 'guardar' ? T.listaTitulo : TEXTOS_FICHA_PDF.nombreReceta(ficha.mascota.nombre),
      });
    }, T.errorPdf);

  return {
    cita,
    datos: b.valor,
    cambiar: b.cambiar,
    guardadoEn: b.guardadoEn,
    medicamentos: meds,
    editando,
    medicamentoEditado: editando !== null && editando >= 0 ? meds[editando] : null,
    agregar: () => setEditando(-1),
    editar: (i: number) => setEditando(i),
    cerrarHoja: () => setEditando(null),
    guardarMedicamento,
    quitarMedicamento,
    guardar,
    guardando: accion.ocupado,
    error: accion.error,
    sinConexion: sinConexion && esErrorDeRed(accion.error),
    lista: recetaId !== null,
    compartir,
    compartiendo: pdf.ocupado,
    errorPdf: pdf.error,
  };
}
