import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Usuario, AuthContextValue } from '../interfaces';
import { usuariosMock } from '../Data/Usuarios';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// TODO: este archivo entero es mock. Cuando conectemos Supabase Auth se
// reemplaza por supabase.auth.signInWithPassword() y el manejo de sesión
// que da Supabase (incluyendo el guardado seguro del token) — acá solo
// simulamos el flujo mientras no hay backend.
const STORAGE_KEY = 'aurapet_usuario_id';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // Al montar, si había una sesión guardada (mock, en localStorage),
  // la restauramos buscando el usuario por id.
  useEffect(() => {
    const idGuardado = localStorage.getItem(STORAGE_KEY);
    if (!idGuardado) return;
    const usuario = usuariosMock.find((u) => u.id === Number(idGuardado));
    if (usuario) setUsuarioActual(usuario);
  }, []);

  const login = (email: string, password: string): boolean => {
    const usuario = usuariosMock.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!usuario) return false;

    setUsuarioActual(usuario);
    localStorage.setItem(STORAGE_KEY, String(usuario.id));
    return true;
  };

  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de conveniencia — evita repetir useContext(AuthContext) y el chequeo
// de undefined en cada pantalla que lo use.
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
