import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext';
import { LARGO_MINIMO_PASSWORD, RUTA_PANEL, TEXTOS_CONFIRMAR_PASSWORD, TEXTOS_RECUPERAR_PASSWORD as T } from '../../constants';
import { bloquearCopiarPegar, passwordsNoCoinciden } from '../../lib/formularios';
import LogoAuraPetSinFondo from '../../assets/logo/LogoAuraPetSinFondo.png';
import '../../css/LoginPage.css';
import styles from '../../css/NuevaPassword.module.css';

// Se llega desde el enlace "restablecer contraseña" del correo. Supabase abre
// una sesión temporal con ese enlace; acá se elige la nueva contraseña.
export const NuevaPasswordScreen = () => {
  const navigate = useNavigate();
  const { usuarioActual, cambiarPassword, terminarRecuperacion } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [lista, setLista] = useState(false);

  const noCoinciden = passwordsNoCoinciden(password, confirmacion);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmacion) {
      setError(TEXTOS_CONFIRMAR_PASSWORD.noCoinciden);
      return;
    }
    setEnviando(true);
    setError('');
    const mensajeError = await cambiarPassword(password);
    setEnviando(false);
    if (mensajeError) setError(mensajeError);
    else setLista(true);
  };

  const continuar = () => {
    terminarRecuperacion();
    navigate(usuarioActual ? RUTA_PANEL : '/', { replace: true });
  };

  return (
    <main className={styles.pagina}>
      <div className={styles.tarjeta}>
        <div className={styles.marca}>
          <img src={LogoAuraPetSinFondo} alt="" className={styles.logo} />
          <span>AuraPet</span>
        </div>

        {!usuarioActual ? (
          <>
            <h1 className="login-titulo">{T.titulo}</h1>
            <p className="login-error">{T.sinSesion}</p>
            <button type="button" className="login-btn" onClick={continuar}>{T.volverInicio}</button>
          </>
        ) : lista ? (
          <>
            <h1 className="login-titulo">{T.guardada}</h1>
            <button type="button" className="login-btn" onClick={continuar}>
              {T.continuar} <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <form onSubmit={guardar}>
            <h1 className="login-titulo">{T.tituloNueva}</h1>
            <p className="login-subtitulo">{T.subtituloNueva}</p>

            <label className="login-label" htmlFor="nueva-password">{T.etiquetaNueva}</label>
            <div className="login-input-wrapper">
              <input
                id="nueva-password"
                type={mostrar ? 'text' : 'password'}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={LARGO_MINIMO_PASSWORD}
                autoComplete="new-password"
                required
                autoFocus
                {...bloquearCopiarPegar}
              />
              <button type="button" className="login-ojo-btn" onClick={() => setMostrar((v) => !v)}
                aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="login-label" htmlFor="nueva-confirmacion">{TEXTOS_CONFIRMAR_PASSWORD.etiqueta}</label>
            <input
              id="nueva-confirmacion"
              type={mostrar ? 'text' : 'password'}
              className={`login-input ${noCoinciden ? 'login-input-error' : ''}`}
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              placeholder={TEXTOS_CONFIRMAR_PASSWORD.placeholder}
              autoComplete="new-password"
              aria-invalid={noCoinciden}
              required
              {...bloquearCopiarPegar}
            />
            <p className={noCoinciden ? 'login-campo-error' : 'login-campo-ayuda'}>
              {noCoinciden ? TEXTOS_CONFIRMAR_PASSWORD.noCoinciden : TEXTOS_CONFIRMAR_PASSWORD.ayuda}
            </p>

            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="login-btn" disabled={enviando || noCoinciden}>
              {enviando ? T.guardando : <>{T.guardar} <ArrowRight size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};
