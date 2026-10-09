import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, PawPrint, Stethoscope, X } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext';
import '../../css/LoginPage.css';
import fondologin from '../../assets/login/fondologin.png'; // TODO: cambiar por la imagen del login cuando la tengas
import type { LoginScreenProps, ModoLogin } from '../../interfaces';

type RolRegistro = 'dueno' | 'veterinario';

export const LoginScreen = ({ onCerrar, onSolicitarCentro }: LoginScreenProps) => {
  const { login, registrar } = useAuth();
  const [modo, setModo] = useState<ModoLogin>('ingresar');

  // Campos compartidos por ingresar y crear cuenta
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Solo para crear cuenta
  const [rolRegistro, setRolRegistro] = useState<RolRegistro | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState('');
  const [aviso, setAviso] = useState(''); // mensajes de éxito (ej: "revisa tu correo")
  const [enviando, setEnviando] = useState(false);

  const cambiarModo = (nuevo: ModoLogin) => {
    setModo(nuevo);
    setRolRegistro(null);
    setError('');
    setAviso('');
  };

  const handleIngresar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    const mensajeError = await login(email, password);
    setEnviando(false);
    if (mensajeError) setError(mensajeError);
    // Si salió bien no hay que hacer nada más: en cuanto hay usuarioActual,
    // App.tsx deja de mostrar la landing (y este modal) y pasa a LoginRol.
  };

  const handleRegistrar = async (e: FormEvent) => {
    e.preventDefault();
    if (!rolRegistro) return;
    setEnviando(true);
    setError('');
    const resultado = await registrar({ nombre, email, password, telefono, rol: rolRegistro });
    setEnviando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    if (resultado.requiereConfirmacion) {
      // Supabase envió un correo de confirmación: hasta confirmar no hay sesión.
      setModo('ingresar');
      setRolRegistro(null);
      setPassword('');
      setAviso(`Te enviamos un correo a ${email.trim()}. Confírmalo y luego ingresa con tu contraseña.`);
    }
    // Si no requiere confirmación, la sesión ya quedó iniciada y App.tsx cambia solo.
  };

  const campoPassword = (
    <>
      <label className="login-label" htmlFor="login-password">Contraseña</label>
      <div className="login-input-wrapper">
        <input
          id="login-password"
          type={mostrarPassword ? 'text' : 'password'}
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={modo === 'crear' ? 6 : undefined}
          autoComplete={modo === 'crear' ? 'new-password' : 'current-password'}
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
    </>
  );

  const campoEmail = (
    <>
      <label className="login-label" htmlFor="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        autoComplete="email"
        required
      />
    </>
  );

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
              {modo === 'ingresar'
                ? 'Ingresa para continuar'
                : rolRegistro === 'dueno'
                  ? 'Cuenta de dueño de mascota'
                  : rolRegistro === 'veterinario'
                    ? 'Cuenta de veterinario'
                    : '¿Cómo usarás AuraPet?'}
            </p>

            {/* Pestañas */}
            <div className="login-tabs">
              <button
                type="button"
                className={`login-tab ${modo === 'ingresar' ? 'login-tab-activo' : ''}`}
                onClick={() => cambiarModo('ingresar')}
              >
                Ingresar
              </button>
              <button
                type="button"
                className={`login-tab ${modo === 'crear' ? 'login-tab-activo' : ''}`}
                onClick={() => cambiarModo('crear')}
              >
                Crear cuenta
              </button>
            </div>

            {modo === 'ingresar' && (
              <form onSubmit={handleIngresar}>
                {campoEmail}
                {campoPassword}

                {/* TODO: flujo de recuperar contraseña (supabase.auth.resetPasswordForEmail) */}
                <a href="#" className="login-link login-olvidaste" onClick={(e) => e.preventDefault()}>
                  ¿Olvidaste tu contraseña?
                </a>

                {aviso && <p className="login-hint">{aviso}</p>}
                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-btn" disabled={enviando}>
                  {enviando ? 'Ingresando…' : <>Ingresar <ArrowRight size={18} /></>}
                </button>
              </form>
            )}

            {/* Crear cuenta, paso 1: elegir tipo de cuenta */}
            {modo === 'crear' && !rolRegistro && (
              <div className="login-roles">
                <button type="button" className="login-rol-card" onClick={() => setRolRegistro('dueno')}>
                  <PawPrint size={22} />
                  <span>Soy dueño de mascota</span>
                </button>
                <button type="button" className="login-rol-card" onClick={() => setRolRegistro('veterinario')}>
                  <Stethoscope size={22} />
                  <span>Soy veterinario</span>
                </button>
              </div>
            )}

            {/* Crear cuenta, paso 2: datos */}
            {modo === 'crear' && rolRegistro && (
              <form onSubmit={handleRegistrar}>
                <label className="login-label" htmlFor="login-nombre">Nombre completo</label>
                <input
                  id="login-nombre"
                  type="text"
                  className="login-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Camila Rojas"
                  autoComplete="name"
                  required
                />

                {campoEmail}
                {campoPassword}

                <label className="login-label" htmlFor="login-telefono">Teléfono (opcional)</label>
                <input
                  id="login-telefono"
                  type="tel"
                  className="login-input"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-btn" disabled={enviando}>
                  {enviando ? 'Creando cuenta…' : <>Crear cuenta <ArrowRight size={18} /></>}
                </button>

                <p className="login-hint">
                  <button type="button" className="login-link" onClick={() => { setRolRegistro(null); setError(''); }}>
                    ← Cambiar tipo de cuenta
                  </button>
                </p>
              </form>
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
