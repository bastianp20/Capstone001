import { useState } from 'react';

import { enviarMensajeContacto } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { ASUNTOS_CONTACTO, TEXTOS_CONTACTO as T } from '@/constants/constants';

import { useAccion } from './useAccion';

/** "Ayuda y contacto": el mensaje llega a Mensajes del superadmin, con el nombre y correo de la cuenta. */
export function useFormularioContacto() {
  const { usuarioActual } = useAuth();
  const [asunto, setAsunto] = useState<string>(ASUNTOS_CONTACTO[0]);
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const { ejecutar, ocupado, error, setError } = useAccion();

  const enviar = async () => {
    if (!usuarioActual) return;
    if (!mensaje.trim()) return setError(T.faltaMensaje);
    const ok = await ejecutar(
      () => enviarMensajeContacto({ nombre: usuarioActual.nombre, correo: usuarioActual.email, asunto, mensaje }),
      T.error,
    );
    if (ok) setEnviado(true);
  };

  return { asunto, setAsunto, mensaje, setMensaje, enviar, enviando: ocupado, error, enviado };
}
