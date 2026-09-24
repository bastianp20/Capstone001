import { useState, type FormEvent } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { Colors, Iconos } from '../../constants';
import '../../css/LoginPage.css';

const colors = Colors;
const iconos = Iconos;

export const LoginScreen = () => {
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
  };

  return (
    <div className="login-page">
      <div className="login-card">
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
          Así es como se debería de ver una pestaña de inicio,
          la idea es que más adelante podamos agregar algun fondo difuminado o lo que sea 
          ya q por ahora esto es un modal.  
          XUPALO ALAN DEAAAA 
          </p>

      </div>
    </div>
  );
};
