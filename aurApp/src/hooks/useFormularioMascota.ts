import { router } from 'expo-router';
import { useState } from 'react';

import { crearMascota, editarMascota } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { DATOS_MASCOTA_VACIOS, TEXTOS_MASCOTA } from '@/constants/constants';
import { useDatosDueno } from '@/context/DatosDuenoContext';
import type { DatosMascota, Mascota } from '@/interfaces';
import { formatFechaChilena, parsearFechaChilena } from '@/lib/fechas';
import { pesoParaEditar } from '@/lib/formatos';

import { useAccion } from './useAccion';

/** Mascota de la base → valores del formulario. */
const desdeMascota = (m: Mascota): DatosMascota => ({
  nombre: m.nombre,
  especie: m.especie,
  sexo: m.sexo,
  raza: m.raza ?? '',
  fechaNacimiento: formatFechaChilena(m.fechaNacimiento),
  pesoKg: pesoParaEditar(m.pesoKg),
  esterilizado: m.esterilizado,
  alergias: m.alergias ?? '',
  condicionesCronicas: m.condicionesCronicas ?? '',
  microchip: m.microchip ?? '',
});

const validar = (d: DatosMascota): Partial<Record<keyof DatosMascota, string>> => {
  const errores: Partial<Record<keyof DatosMascota, string>> = {};
  if (!d.nombre.trim()) errores.nombre = TEXTOS_MASCOTA.faltaNombre;
  if (d.fechaNacimiento.trim() && !parsearFechaChilena(d.fechaNacimiento)) errores.fechaNacimiento = TEXTOS_MASCOTA.fechaInvalida;
  const peso = Number(d.pesoKg.replace(',', '.'));
  if (d.pesoKg.trim() && !(peso > 0)) errores.pesoKg = TEXTOS_MASCOTA.pesoInvalido;
  return errores;
};

/** Crear (mascotaId null) o editar una mascota. Al guardar recarga los datos y vuelve atrás. */
export function useFormularioMascota(mascotaId: number | null) {
  const { usuarioActual } = useAuth();
  const { mascotas, recargar } = useDatosDueno();
  const mascota = mascotaId === null ? null : (mascotas.find((m) => m.id === mascotaId) ?? null);

  const [datos, setDatos] = useState<DatosMascota>(mascota ? desdeMascota(mascota) : DATOS_MASCOTA_VACIOS);
  const [errores, setErrores] = useState<Partial<Record<keyof DatosMascota, string>>>({});
  const { ejecutar, ocupado, error } = useAccion();

  const cambiar = <K extends keyof DatosMascota>(campo: K, valor: DatosMascota[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const guardar = async () => {
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0 || !usuarioActual) return;

    const ok = await ejecutar(
      () => (mascota ? editarMascota(mascota.id, datos) : crearMascota(usuarioActual.id, datos)),
      mascota ? TEXTOS_MASCOTA.errorEditar : TEXTOS_MASCOTA.errorCrear,
    );
    if (ok) {
      await recargar();
      router.back();
    }
  };

  return {
    esEdicion: mascotaId !== null,
    noEncontrada: mascotaId !== null && !mascota,
    datos,
    cambiar,
    errores,
    guardar,
    guardando: ocupado,
    error,
  };
}
