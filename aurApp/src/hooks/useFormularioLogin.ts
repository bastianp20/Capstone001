import { useState } from 'react';

import { useAuth } from '@/Auth/AuthContext';
import {
  FORMULARIO_LOGIN_VACIO,
  LARGO_MINIMO_PASSWORD,
  TEXTOS_CONFIRMAR_PASSWORD,
  TEXTOS_LOGIN,
  TEXTOS_RECUPERAR_PASSWORD,
} from '@/constants/constants';
import type { FormularioLogin, ModoLogin } from '@/interfaces';
import { emailValido } from '@/lib/formularios';

/** Estado y acciones de la pantalla de login: ingresar, crear cuenta y recuperar contraseña. */
export function useFormularioLogin() {
  const { login, registrar, recuperarPassword, avisoSesion, limpiarAvisoSesion } = useAuth();

  const [modo, setModo] = useState<ModoLogin>('ingresar');
  const [formulario, setFormulario] = useState<FormularioLogin>(FORMULARIO_LOGIN_VACIO);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiarCampo = (campo: keyof FormularioLogin, valor: string) => {
    setFormulario((f) => ({ ...f, [campo]: valor }));
    if (error) setError('');
  };

  const cambiarMostrarPassword = () => setMostrarPassword((v) => !v);

  const cambiarModo = (nuevo: ModoLogin) => {
    setModo(nuevo);
    setFormulario((f) => ({ ...f, password: '', confirmacion: '' }));
    setError('');
    setAviso('');
    limpiarAvisoSesion();
  };

  const ingresar = async () => {
    const { email, password } = formulario;
    if (!email.trim() || !password) return setError(TEXTOS_LOGIN.validacion.faltanDatos);
    if (!emailValido(email)) return setError(TEXTOS_LOGIN.validacion.emailInvalido);

    setEnviando(true);
    setError('');
    setAviso('');
    const mensajeError = await login(email, password);
    setEnviando(false);
    if (mensajeError) setError(mensajeError);
    // Si salió bien no hay nada más que hacer: el layout cambia solo a las pestañas
    // en cuanto se carga el perfil.
  };

  const crearCuenta = async () => {
    const { nombre, email, password, confirmacion, telefono } = formulario;
    if (!nombre.trim() || !email.trim() || !password || !confirmacion) {
      return setError(TEXTOS_LOGIN.validacion.faltanDatos);
    }
    if (!emailValido(email)) return setError(TEXTOS_LOGIN.validacion.emailInvalido);
    if (password.length < LARGO_MINIMO_PASSWORD) return setError(TEXTOS_LOGIN.validacion.passwordCorta);
    if (password !== confirmacion) return setError(TEXTOS_CONFIRMAR_PASSWORD.noCoinciden);

    setEnviando(true);
    setError('');
    const resultado = await registrar({ nombre, email, password, telefono });
    setEnviando(false);
    if (resultado.error) return setError(resultado.error);

    if (resultado.requiereConfirmacion) {
      // Supabase envió un correo de confirmación: hasta confirmar no hay sesión.
      cambiarModo('ingresar');
      setAviso(TEXTOS_LOGIN.crear.revisaCorreo(email.trim()));
    }
    // Si no requiere confirmación, la sesión ya quedó iniciada y el layout cambia solo.
  };

  const enviarRecuperacion = async () => {
    const { email } = formulario;
    if (!emailValido(email)) return setError(TEXTOS_LOGIN.validacion.emailInvalido);

    setEnviando(true);
    setError('');
    setAviso('');
    const mensajeError = await recuperarPassword(email);
    setEnviando(false);
    if (mensajeError) setError(mensajeError);
    else setAviso(TEXTOS_RECUPERAR_PASSWORD.enviado(email.trim()));
  };

  return {
    modo,
    cambiarModo,
    formulario,
    cambiarCampo,
    mostrarPassword,
    cambiarMostrarPassword,
    // Si la sesión se cerró sola (por ejemplo, una cuenta de veterinario), se muestra como error.
    error: error || avisoSesion,
    aviso,
    enviando,
    ingresar,
    crearCuenta,
    enviarRecuperacion,
  };
}
