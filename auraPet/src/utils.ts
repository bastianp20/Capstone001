// Utilidades genéricas de texto, reutilizables en cualquier pantalla
// (no dependen de ningún tipo de Data/ ni de interfaces.ts).

// Saca las iniciales de un nombre completo: primera letra de la primera
// palabra + primera letra de la última palabra (así también funciona con
// nombres compuestos, ej. "María José Pérez" -> "MP", no solo "MJ").
export const getIniciales = (nombreCompleto: string): string => {
  const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";

  const primera = partes[0].charAt(0);
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";

  return (primera + ultima).toUpperCase();
};
