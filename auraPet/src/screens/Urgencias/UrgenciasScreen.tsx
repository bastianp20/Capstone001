import { Iconos, TEXTOS_URGENCIAS as T } from "../../constants";
import { useUrgencias } from "../../hooks/useUrgencias";
import { FiltrosUrgencias } from "../../components/urgencias/FiltrosUrgencias";
import { TarjetaCentroUrgencia } from "../../components/urgencias/TarjetaCentroUrgencia";
import { TarjetaVetUrgencia } from "../../components/urgencias/TarjetaVetUrgencia";
import "../../css/UrgenciasPage.css";

/** /urgencias — pública, sin cuenta: a quién llamar ahora (migración 55). */
export const UrgenciasScreen = () => {
  const u = useUrgencias();

  return (
    <main className="urg">
      <div className="urg-contenido">
        <header className="urg-cabecera">
          <h1>{T.titulo}</h1>
          <p>{T.subtitulo}</p>
        </header>

        <p className="urg-consejo">
          <Iconos.telefono size={18} aria-hidden="true" /> {T.consejo}
        </p>

        <FiltrosUrgencias comunas={u.comunas} filtros={u.filtros} onCambiar={u.cambiarFiltros} />

        <div>
          <h2 className="urg-seccion-titulo">{T.centros}</h2>
          <span className="urg-en-vivo">{T.enVivo}</span>
        </div>

        {u.cargando && <p className="urg-vacio">{T.cargando}</p>}
        {u.error && <p className="urg-vacio" role="alert">{T.error}</p>}
        {!u.cargando && !u.error && u.centros.length === 0 && <p className="urg-vacio">{T.sinResultados}</p>}

        <ul className="urg-grilla">
          {u.centros.map((c) => (
            <li key={c.id}><TarjetaCentroUrgencia centro={c} ahora={u.ahora} /></li>
          ))}
        </ul>

        {u.veterinarios.length > 0 && (
          <>
            <div>
              <h2 className="urg-seccion-titulo">{T.veterinarios}</h2>
              <p className="urg-seccion-ayuda">{T.veterinariosAyuda}</p>
            </div>
            <ul className="urg-grilla">
              {u.veterinarios.map((v) => (
                <li key={v.id}><TarjetaVetUrgencia veterinario={v} /></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
};
