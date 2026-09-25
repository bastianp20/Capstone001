import { useState, type FormEvent } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { Colors, Iconos } from '../../constants';
import '../../css/LoginPage.css';

const colors = Colors;
const iconos = Iconos;

interface LoginScreenProps {
  onCerrar: () => void;
}

export const LoginScreen = ({ onCerrar }: LoginScreenProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <button className="login-close-btn" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        <div className="login-brand">
          <iconos.huella size={26} color={colors.accent} />
          <span>AuraPet</span>
        </div>
        <p className="login-subtitulo">Ingresa a tu cuenta</p>

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
          <input
            id="login-password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn">Ingresar</button>
        </form>

        {/* TODO: quitar este hint cuando exista un flujo real de registro */}
        <p className="login-hint">
          Usa cualquier cuenta de credenciales-login-aurapet.txt para probar.
        </p>
      </div>
    </div>
  );
};
