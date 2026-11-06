import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PREFIJO_BORRADOR } from '@/constants/constants';

// Un formulario que se guarda solo en el teléfono mientras se escribe (por ejemplo,
// una atención a domicilio sin señal). Al enviarlo bien, se borra con limpiar().
//   const b = useBorrador('registro-12', VACIO);
//   b.cambiar({ descripcion: 'Dermatitis…' });
export function useBorrador<T extends object>(clave: string, inicial: T) {
  const llave = PREFIJO_BORRADOR + clave;
  const [valor, setValor] = useState<T>(inicial);
  const [cargado, setCargado] = useState(false);
  const [guardadoEn, setGuardadoEn] = useState<string | null>(null);
  const tocado = useRef(false); // solo se guarda después de que la persona cambia algo

  // 1) Al abrir, recupera lo que había
  useEffect(() => {
    let activo = true;
    AsyncStorage.getItem(llave)
      .then((texto) => {
        if (activo && texto) setValor({ ...inicial, ...(JSON.parse(texto) as Partial<T>) });
      })
      .catch(() => undefined) // sin borrador (o ilegible): se parte de cero
      .finally(() => activo && setCargado(true));
    return () => {
      activo = false;
    };
    // El valor inicial solo importa la primera vez
  }, [llave]);

  // 2) Cada cambio se guarda
  useEffect(() => {
    if (!cargado || !tocado.current) return;
    AsyncStorage.setItem(llave, JSON.stringify(valor))
      .then(() => setGuardadoEn(new Date().toISOString()))
      .catch(() => undefined);
  }, [valor, cargado, llave]);

  const cambiar = useCallback((cambio: Partial<T> | ((actual: T) => T)) => {
    tocado.current = true;
    setValor((actual) => (typeof cambio === 'function' ? cambio(actual) : { ...actual, ...cambio }));
  }, []);

  const limpiar = useCallback(async () => {
    tocado.current = false;
    setGuardadoEn(null);
    await AsyncStorage.removeItem(llave).catch(() => undefined);
  }, [llave]);

  return { valor, cambiar, limpiar, cargado, guardadoEn };
}
