import { CLAVE_TEMA, TEMA_POR_DEFECTO } from "../constants";
import type { Tema } from "../interfaces";

// Preferencia de tema (Configuración → Apariencia). Se guarda en localStorage
// y se aplica en <html data-tema="...">; los colores están en css/theme.css.
// El modo oscuro solo se usa dentro de los paneles (ver hooks/useTemaDelPanel):
// la página pública siempre se ve en claro.

export const leerTema = (): Tema => {
  try {
    return (localStorage.getItem(CLAVE_TEMA) as Tema) ?? TEMA_POR_DEFECTO;
  } catch {
    return TEMA_POR_DEFECTO;
  }
};

const ponerEnPagina = (tema: Tema) => {
  document.documentElement.dataset.tema = tema;
};

// Guarda la preferencia y la aplica (al elegirla en Configuración)
export const aplicarTema = (tema: Tema) => {
  try { localStorage.setItem(CLAVE_TEMA, tema); } catch { /* navegador sin almacenamiento */ }
  ponerEnPagina(tema);
};

// Al entrar a un panel: la preferencia guardada
export const aplicarTemaGuardado = () => ponerEnPagina(leerTema());

// Al salir del panel (landing, login): siempre claro, sin tocar la preferencia
export const aplicarTemaClaro = () => ponerEnPagina(TEMA_POR_DEFECTO);
