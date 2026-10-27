import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import { LoginRol } from './screens/Login/LoginRol';
import { NuevaPasswordScreen } from './screens/Login/NuevaPasswordScreen';
import { Layout } from './Auth/Layout/AuthLayout';
import { HomeScreen } from './screens/Home/HomeScreen';
import { ComoFunciona } from './screens/Home/ComoFuncionaScreen';
import { ParaVeterinarias } from './screens/Home/ParaVeterinariasScreen';
import { ParaDuenos } from './screens/Home/ParaDuenosScreen';
import { Nosotros } from './screens/Home/NosotrosScreen';
import { ContactoScreen } from './screens/Home/ContactoScreen';
import { PantallaCarga } from './components/PantallaCarga';
import { SolicitarCentro } from './screens/Centros/SolicitarCentro';
import { AdopcionScreen } from './screens/Adopciones/AdopcionScreen';
import { FichaAdopcionScreen } from './screens/Adopciones/FichaAdopcionScreen';
import { PublicarAdopcionScreen } from './screens/Adopciones/PublicarAdopcionScreen';
import { RutaProtegida } from './components/rutas/RutaProtegida';
import { SoloSinSesion } from './components/rutas/SoloSinSesion';
import { RUTA_ADOPTA, RUTA_PUBLICAR_ADOPCION, RUTA_NUEVA_PASSWORD, RUTA_PANEL, RUTA_SOLICITAR_CENTRO } from './constants';

export const App = () => {
  const { usuarioActual, cargando, enRecuperacion } = useAuth();

  // Mientras se recupera la sesión guardada se muestra la pantalla de carga,
  // para que no aparezca la landing un instante antes de entrar al panel.
  if (cargando) return <PantallaCarga />;

  // Se entró desde el enlace "restablecer contraseña": primero la nueva contraseña
  if (enRecuperacion) return <NuevaPasswordScreen />;

  return (
    <Routes>
      {/* Públicas: con sesión iniciada redirigen al panel */}
      <Route element={<SoloSinSesion />}>
        {/* Todas comparten NavBar y Footer a través de LandingLayout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/veterinarias" element={<ParaVeterinarias />} />
          <Route path="/duenos" element={<ParaDuenos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<ContactoScreen />} />
        </Route>

        {/* Solicitud de centros: pantalla completa, con su propio panel de marca (sin NavBar/Footer) */}
        <Route path={RUTA_SOLICITAR_CENTRO} element={<SolicitarCentro />} />
      </Route>

      {/* Adopción: pública para todos, con o sin sesión (misma NavBar y Footer) */}
      <Route element={<Layout />}>
        <Route path={RUTA_ADOPTA} element={<AdopcionScreen />} />
        <Route path={RUTA_PUBLICAR_ADOPCION} element={<PublicarAdopcionScreen />} />
        <Route path={`${RUTA_ADOPTA}/:id`} element={<FichaAdopcionScreen />} />
      </Route>

      {/* Protegidas: el panel de cada rol (LoginRol decide cuál) */}
      <Route element={<RutaProtegida />}>
        <Route path={RUTA_PANEL} element={<LoginRol />} />
      </Route>

      {/* Destino del enlace del correo (si la sesión del enlace no llegó, avisa que venció) */}
      <Route path={RUTA_NUEVA_PASSWORD} element={<NuevaPasswordScreen />} />

      {/* Cualquier ruta que no exista: al panel si hay sesión, si no al inicio */}
      <Route path="*" element={<Navigate to={usuarioActual ? RUTA_PANEL : '/'} replace />} />
    </Routes>
  );
};
