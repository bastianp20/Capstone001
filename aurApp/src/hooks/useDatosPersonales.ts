import { useState } from 'react';

import { editarMiPerfil } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { LARGO_TELEFONO_CL, TEXTOS_DATOS_PERSONALES as T } from '@/constants/constants';
import { telefonoParaEditar } from '@/lib/formatos';
import { soloDigitos } from '@/lib/formularios';

import { useAccion } from './useAccion';

/** Editar nombre y teléfono del dueño (tabla perfiles). */
export function useDatosPersonales() {
  const { usuarioActual, recargarPerfil } = useAuth();
  const [nombre, setNombre] = useState(usuarioActual?.nombre ?? '');
  const [telefono, setTelefono] = useState(telefonoParaEditar(usuarioActual?.telefono ?? null));
  const [aviso, setAviso] = useState('');
  const { ejecutar, ocupado, error, setError } = useAccion();

  const cambiarNombre = (v: string) => {
    setNombre(v);
    setAviso('');
  };
  const cambiarTelefono = (v: string) => {
    setTelefono(v);
    setAviso('');
  };

  const guardar = async () => {
    if (!usuarioActual) return;
    if (!nombre.trim()) return setError(T.faltaNombre);
    const digitos = soloDigitos(telefono).replace(/^56/, '');
    if (digitos && digitos.length !== LARGO_TELEFONO_CL) return setError(T.telefonoInvalido);

    const ok = await ejecutar(() => editarMiPerfil(usuarioActual.id, { nombre, telefono: digitos }), T.error);
    if (ok) {
      recargarPerfil();
      setAviso(T.guardado);
    }
  };

  return { nombre, cambiarNombre, telefono, cambiarTelefono, correo: usuarioActual?.email ?? '', guardar, guardando: ocupado, error, aviso };
}
