import * as WebBrowser from 'expo-web-browser';

import { RUTA_WEB_SOLICITAR_CENTRO, URL_WEB_AURAPET } from '@/constants/constants';

/** Abre una página de la web de AuraPet dentro de la app (navegador integrado). */
export function abrirPaginaWeb(ruta: string) {
  return WebBrowser.openBrowserAsync(`${URL_WEB_AURAPET}${ruta}`);
}

export const abrirSolicitudCentro = () => abrirPaginaWeb(RUTA_WEB_SOLICITAR_CENTRO);
