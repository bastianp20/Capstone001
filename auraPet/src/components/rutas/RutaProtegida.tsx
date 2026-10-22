import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

// Rutas que necesitan sesión (los paneles). Sin sesión, vuelve al inicio.
export const RutaProtegida = () => {
  const { usuarioActual } = useAuth();
  const ubicacion = useLocation();
  if (!usuarioActual) return <Navigate to="/" replace state={{ desde: ubicacion.pathname }} />;
  return <Outlet />;
};
