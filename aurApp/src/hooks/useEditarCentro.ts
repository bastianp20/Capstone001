import { router } from 'expo-router';
import { useState } from 'react';

import { actualizarCentro } from '@/Api/postInfo';
import { DATOS_CENTRO_VACIOS, TEXTOS_EDITAR_CENTRO as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import type { DatosEdicionCentro } from '@/interfaces';

import { useAccion } from './useAccion';

/** Editar nombre, dirección, comuna y teléfono del centro elegido. */
export function useEditarCentro() {
  const { datos, centroId, recargar } = useCentro();
  const d = datos?.detalle;
  const [form, setForm] = useState<DatosEdicionCentro>(
    d ? { nombre: d.nombre, direccion: d.direccion, comuna: d.comuna, telefono: d.telefono ? String(d.telefono) : '' } : DATOS_CENTRO_VACIOS,
  );
  const { ejecutar, ocupado, error, setError } = useAccion();

  const cambiar = (campo: keyof DatosEdicionCentro, valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = async () => {
    if (!centroId) return;
    if (!form.nombre.trim() || !form.direccion.trim() || !form.comuna.trim()) return setError(T.faltanDatos);
    const ok = await ejecutar(() => actualizarCentro(centroId, form), T.error);
    if (ok) {
      await recargar();
      router.back();
    }
  };

  return { form, cambiar, guardar, guardando: ocupado, error };
}
