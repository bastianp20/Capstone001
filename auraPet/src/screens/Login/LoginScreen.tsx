import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, PawPrint, Stethoscope, X } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext';
import '../../css/LoginPage.css';
import fondologin from '../../assets/login/fondologin.png'; // TODO: cambiar por la imagen del login cuando la tengas
import type { LoginScreenProps, ModoLogin } from '../../interfaces';

export const LoginScreen = ({ onCerrar, onSolicitarCentro }: LoginScreenProps) => {
  const { login } = useAuth();
  const [modo, setModo] = useState<ModoLogin>('ingresar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError('Email o contraseña incorrectos.');
      return;
    }
    setError('');
    // no hace falta llamar onCerrar acá: en cuanto usuarioActual deja de
    // ser null, App.tsx deja de montar el LandingScreen (y este modal
    // con él) y pasa directo a LoginRol.
  };

  return (
    <div className="login-overlay" onClick={onCerrar}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>

        {/* Panel izquierdo: imagen + mensaje de marca */}
        <div className="login-panel-imagen" style={{ backgroundImage: `url(${fondologin})` }}>
          <div className="login-panel-overlay" />
          <div className="login-panel-texto">
            <h2>Tu mascota, en buenas manos</h2>
            <p>Citas, historial y veterinarias de confianza en un solo lugar.</p>
          </div>
        </div>

        {/* Panel derecho: formulario */}
        <div className="login-panel-form">
          <button className="login-close-btn" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>

          <div className="login-contenido">
            <h1 className="login-titulo">
              {modo === 'ingresar' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h1>
            <p className="login-subtitulo">
              {modo === 'ingresar' ? 'Ingresa para continuar' : '¿Cómo usarás AuraPet?'}
            </p>

            {/* Pestañas */}
            <div className="login-tabs">
              <button
                type="button"
                className={`login-tab ${modo === 'ingresar' ? 'login-tab-activo' : ''}`}
                onClick={() => setModo('ingresar')}
              >
                Ingresar
              </button>
              <button
                type="button"
                className={`login-tab ${modo === 'crear' ? 'login-tab-activo' : ''}`}
                onClick={() => setModo('crear')}
              >
                Crear cuenta
              </button>
            </div>

            {modo === 'ingresar' ? (
              <form onSubmit={handleSubmit}>
                <label className="login-label" htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />

                <label className="login-label" htmlFor="login-password">Contraseña</label>
                <div className="login-input-wrapper">
                  <input
                    id="login-password"
                    type={mostrarPassword ? 'text' : 'password'}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="login-ojo-btn"
                    onClick={() => setMostrarPassword((v) => !v)}
                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* TODO: flujo de recuperar contraseña */}
                <a href="#" className="login-link login-olvidaste" onClick={(e) => e.preventDefault()}>
                  ¿Olvidaste tu contraseña?
                </a>

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-btn">
                  Ingresar <ArrowRight size={18} />
                </button>

                {/* TODO: quitar este hint cuando exista un flujo real de registro */}
                <p className="login-hint">
                  Usa cualquier cuenta de credenciales-login-aurapet.txt para probar.
                </p>
              </form>
            ) : (
              // TODO: paso 2 con el formulario según el rol elegido
              <div className="login-roles">
                <button type="button" className="login-rol-card">
                  <PawPrint size={22} />
                  <span>Soy dueño de mascota</span>
                </button>
                <button type="button" className="login-rol-card">
                  <Stethoscope size={22} />
                  <span>Soy veterinario</span>
                </button>
              </div>
            )}
          </div>

          <div className="login-footer">
            ¿Tienes un centro veterinario?{' '}
            <button type="button" className="login-link" onClick={onSolicitarCentro}>
              Solicita unirte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};