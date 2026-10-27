import { createContext, useContext, useEffect, useState } from 'react';

import { AVISOS_SESION } from '@/constants/constants';
import type { AuthContextValue, AuthProviderProps, DatosRegistro, UsuarioActual } from '@/interfaces';
import { traducirErrorAuth } from '@/lib/erroresAuth';
import { soloDigitos } from '@/lib/formularios';
import { supabase } from '@/lib/supabase';

// Sesión real con Supabase Auth, igual que en la web (auraPet/src/Auth/AuthContext.tsx).
// · Supabase guarda la sesión en el teléfono (AsyncStorage): al abrir la app
//   se recupera sola con getSession().
// · Los datos de la app (nombre, rol, teléfono) vienen de la tabla "perfiles".
// · Cada rol entra a su propia vista (NavegadorRaiz decide cuál, como LoginRol en la web).
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // undefined = todavía no sabemos si hay sesión; null = no hay sesión.
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState<{ userId: string; usuario: UsuarioActual | null } | null>(null);
  const [avisoSesion, setAvisoSesion] = useState('');
  // Sube en 1 cada vez que el dueño edita su perfil → el efecto 2 lo vuelve a leer.
  const [versionPerfil, setVersionPerfil] = useState(0);

  // 1) Escuchar la sesión: al abrir la app, al ingresar, al salir y al refrescar el token.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? '');
    });

    // Dentro de este callback no se hacen otras llamadas a Supabase (puede trabarse).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? '');
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2) Cada vez que cambia la persona conectada (o edita su perfil), cargar su perfil.
  useEffect(() => {
    if (!userId) return;
    let activo = true;
    supabase
      .from('perfiles')
      .select('id, nombre, rol, telefono, avatar_url, desactivado_en, es_prueba')
      .eq('id', userId)
      .single()
      .then(async ({ data, error }) => {
        if (!activo) return;
        if (error || !data || data.desactivado_en) {
          // Sin perfil o cuenta desactivada: se cierra la sesión con un aviso.
          if (error) console.error('No se pudo cargar el perfil:', error);
          setAvisoSesion(AVISOS_SESION.sinPerfil);
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
            esPrueba: data.es_prueba,
          },
        });
      });
    return () => {
      activo = false;
    };
  }, [userId, email, versionPerfil]);

  // Valores derivados (no se guardan en estado)
  const perfilVigente = perfil && perfil.userId === userId ? perfil : null;
  const usuarioActual = userId ? (perfilVigente?.usuario ?? null) : null;
  const cargando = userId === undefined || (typeof userId === 'string' && !perfilVigente);

  const login = async (correo: string, password: string): Promise<string | null> => {
    setAvisoSesion('');
    const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password });
    return error ? traducirErrorAuth(error.message) : null;
  };

  // El rol y los datos viajan en options.data: el trigger de la base crea el perfil.
  const registrar = async (datos: DatosRegistro) => {
    setAvisoSesion('');
    const { data, error } = await supabase.auth.signUp({
      email: datos.email.trim(),
      password: datos.password,
      options: {
        data: {
          nombre: datos.nombre.trim(),
          rol: 'dueno',
          telefono: datos.telefono ? soloDigitos(datos.telefono) || undefined : undefined,
        },
      },
    });
    if (error) return { error: traducirErrorAuth(error.message) };
    // Si Supabase pide confirmar el correo, todavía no hay sesión.
    return { requiereConfirmacion: !data.session };
  };

  // Sin redirectTo: el enlace del correo abre la "Site URL" de Supabase, o sea la página web,
  // que ya sabe pedir la nueva contraseña.
  const recuperarPassword = async (correo: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(correo.trim());
    return error ? traducirErrorAuth(error.message) : null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const limpiarAvisoSesion = () => setAvisoSesion('');

  // Vuelve a leer el perfil (por ejemplo, después de cambiar el nombre en Datos personales).
  const recargarPerfil = () => setVersionPerfil((v) => v + 1);

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        cargando,
        login,
        registrar,
        recuperarPassword,
        logout,
        avisoSesion,
        limpiarAvisoSesion,
        recargarPerfil,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
