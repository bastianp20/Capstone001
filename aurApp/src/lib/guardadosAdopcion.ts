import AsyncStorage from '@react-native-async-storage/async-storage';

import { CLAVE_GUARDADOS_ADOPCION } from '@/constants/constants';

// Animales guardados (el corazón): viven en este teléfono, como en la web viven en el navegador.
// Es un pequeño almacén compartido: la lista y la ficha ven el mismo estado al instante.

let guardados: ReadonlySet<number> = new Set();
let cargado = false;
const oyentes = new Set<() => void>();

const avisar = () => oyentes.forEach((o) => o());

const cargar = async () => {
  if (cargado) return;
  cargado = true;
  try {
    const texto = await AsyncStorage.getItem(CLAVE_GUARDADOS_ADOPCION);
    const ids: unknown = texto ? JSON.parse(texto) : [];
    if (Array.isArray(ids)) guardados = new Set(ids.filter((x): x is number => typeof x === 'number'));
  } catch {
    guardados = new Set();
  }
  avisar();
};

export const suscribirGuardados = (oyente: () => void) => {
  oyentes.add(oyente);
  cargar();
  return () => {
    oyentes.delete(oyente);
  };
};

export const leerGuardados = () => guardados;

export const alternarGuardado = (id: number) => {
  const nuevos = new Set(guardados);
  if (nuevos.has(id)) nuevos.delete(id);
  else nuevos.add(id);
  guardados = nuevos;
  avisar();
  AsyncStorage.setItem(CLAVE_GUARDADOS_ADOPCION, JSON.stringify([...nuevos])).catch(() => undefined);
};
