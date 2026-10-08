import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import { LoginRol } from './screens/Login/LoginRol';
import { Layout } from './Auth/Layout/AuthLayout';
import { HomeScreen } from './screens/Home/HomeScreen';
import { ComoFunciona } from './screens/Home/ComoFuncionaScreen';
import { ParaVeterinarias } from './screens/Home/ParaVeterinariasScreen';
import { ParaDuenos } from './screens/Home/ParaDuenosScreen';
import { Nosotros } from './screens/Home/NosotrosScreen';
import { ContactoScreen } from './screens/Home/ContactoScreen';

export const App = () => {
  const { usuarioActual, cargando } = useAuth();

  // Mientras se recupera la sesión guardada no se muestra nada, para que no
  // aparezca la landing un instante antes de entrar al panel.
  if (cargando) return null;

  // TODO: rutas protegidas. Por ahora, con sesión iniciada se sigue mostrando LoginRol como antes.
  if (usuarioActual) return <LoginRol />;

  return (
    <Routes>
      {/* Páginas públicas: todas comparten NavBar y Footer a través de LandingLayout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/veterinarias" element={<ParaVeterinarias />} />
        <Route path="/duenos" element={<ParaDuenos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<ContactoScreen />} />
      </Route>

      {/* Cualquier ruta que no exista vuelve al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};