import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { getFichaPdf } from '@/Api/getInfo';
import { TEXTOS_FICHA_PDF, TEXTOS_HISTORIAL } from '@/constants/constants';
import { armarHtmlFicha } from '@/lib/fichaPdf';

import { useAccion } from './useAccion';

/** Genera la ficha clínica en PDF y abre el menú para guardarla o compartirla. */
export function useDescargaFicha() {
  const { ejecutar, ocupado, error, limpiarError } = useAccion();

  const descargar = (mascotaId: number) =>
    ejecutar(async () => {
      const ficha = await getFichaPdf(mascotaId);
      const html = armarHtmlFicha(ficha);

      // En la versión web se abre el diálogo de imprimir / guardar como PDF del navegador.
      if (Platform.OS === 'web') return Print.printAsync({ html });

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: TEXTOS_FICHA_PDF.nombreArchivo(ficha.mascota.nombre),
      });
    }, TEXTOS_HISTORIAL.errorPdf);

  return { descargar, generando: ocupado, error, limpiarError };
}
