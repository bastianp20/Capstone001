export type Tema = "claro" | "oscuro" | "auto";

const CLAVE_TEMA = "aurapet-tema";

export const leerTema = (): Tema => {
  try {
    return (localStorage.getItem(CLAVE_TEMA) as Tema) ?? "claro";
  } catch {
    return "claro";
  }
};

// Guarda la preferencia y la deja en <html data-tema="..."> para el CSS
export const aplicarTema = (tema: Tema) => {
  try { localStorage.setItem(CLAVE_TEMA, tema); } catch { /* navegador sin almacenamiento */ }
  document.documentElement.dataset.tema = tema;
};
