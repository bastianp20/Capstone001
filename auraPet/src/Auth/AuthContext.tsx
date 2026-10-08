import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthContextValue, DatosRegistro, UsuarioActual } from '../interfaces';
import { supabase } from '../lib/supabase';

// Sesión real con Supabase Auth.
// · Supabase guarda la sesión (token) por su cuenta: al recargar la página
//   se recupera sola con getSession().
// · Los datos de la app (nombre, rol, teléfono) vienen de la tabla
//   "perfiles", que se crea sola al registrarse (trigger en la base).
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mensajes de Supabase (en inglés) -> mensajes para el usuario.
const traducirError = (mensaje: string): string => {
  if (mensaje.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (mensaje.includes('Email not confirmed')) return 'Debes confirmar tu correo antes de ingresar. Revisa tu bandeja de entrada.';
  if (mensaje.includes('User already registered')) return 'Ya existe una cuenta con ese email.';
  if (mensaje.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (mensaje.toLowerCase().includes('rate limit')) return 'Hubo demasiados intentos. Espera unos minutos y vuelve a intentarlo.';
  if (mensaje.includes('Unable to validate email') || mensaje.includes('invalid format')) return 'El email no es válido.';
  console.error('Error de autenticación no traducido:', mensaje);
  return 'No pudimos completar la operación. Inténtalo de nuevo.';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // undefined = todavía no sabemos si hay sesión; null = no hay sesión.
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  // Perfil cargado y a qué usuario corresponde (para no mostrar el perfil de
  // una sesión anterior mientras llega el de la nueva).
  const [perfil, setPerfil] = useState<{ userId: string; usuario: UsuarioActual | null } | null>(null);

  // 1) Escuchar la sesión: al abrir la app, al ingresar, al salir y al refrescar el token.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? '');
    });

    // Ojo: dentro de este callback no se hacen otras llamadas a Supabase
    // (puede trabarse); solo se guarda el id y el efecto 2 carga el perfil.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? '');
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2) Cada vez que cambia la persona conectada, cargar su perfil.
  useEffect(() => {
    if (!userId) return;
    let activo = true;
    supabase
      .from('perfiles')
      .select('id, nombre, rol, telefono, avatar_url, desactivado_en')
      .eq('id', userId)
      .single()
      .then(async ({ data, error }) => {
        if (!activo) return;
        if (error || !data || data.desactivado_en) {
          // Sin perfil o cuenta desactivada: se cierra la sesión.
          console.error('No se pudo cargar el perfil o la cuenta está desactivada:', error);
          setPerfil({ userId, usuario: null });
          await supabase.auth.signOut();
          return;
        }
        setPerfil({
          userId,
          usuario: {
            id: data.id,
            email,
            nombre: data.nombre,
            rol: data.rol,
            telefono: data.telefono,
            avatarUrl: data.avatar_url,
          },
        });
      });
    return () => { activo = false; };
  }, [userId, email]);

  // Valores derivados (no se guardan en estado):
  const perfilVigente = perfil && perfil.userId === userId ? perfil : null;
  const usuarioActual = userId ? perfilVigente?.usuario ?? null : null;
  // Cargando = aún no sabemos si hay sesión, o la hay pero su perfil no ha llegado.
  const cargando = userId === undefined || (typeof userId === 'string' && !perfilVigente);

  // Devuelve null si todo salió bien, o el mensaje de error para mostrar.
  const login = async (correo: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password });
    return error ? traducirError(error.message) : null;
  };

  // El rol y los datos viajan en options.data: el trigger de la base los
  // usa para crear el perfil (y nunca permite registrarse como superadmin).
  const registrar = async (datos: DatosRegistro) => {
    const { data, error } = await supabase.auth.signUp({
      email: datos.email.trim(),
      password: datos.password,
      options: {
        data: {
          nombre: datos.nombre.trim(),
          rol: datos.rol,
          telefono: datos.telefono?.replace(/\D/g, '') || undefined,
        },
      },
    });
    if (error) return { error: traducirError(error.message) };
    // Si Supabase pide confirmar el correo, no hay sesión todavía.
    return { requiereConfirmacion: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de conveniencia — evita repetir useContext(AuthContext) y el chequeo
// de undefined en cada pantalla que lo use.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
