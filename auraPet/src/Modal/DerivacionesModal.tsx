import { useId, useState } from "react";
import { Iconos, PESTANAS_DERIVACIONES, TEXTOS_DERIVACION as T } from "../constants";
import { getMisDerivaciones } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import type { DerivacionesModalProps, PestanaDerivaciones } from "../interfaces";
import { TarjetaDerivacion } from "../components/derivaciones/TarjetaDerivacion";
import { FichaPacienteModal } from "./FichaPacienteModal";
import styles from "../css/modal/FichaPacienteModal.module.css";
import estilosDerivacion from "../css/ficha/Derivaciones.module.css";

// Derivaciones del veterinario: las que le llegaron (para atender y
// responder) y las que hizo él (para seguirlas o cancelarlas).
export const DerivacionesModal = ({ onCerrar, onRecetar }: DerivacionesModalProps) => {
  const idTitulo = useId();
  const [pestana, setPestana] = useState<PestanaDerivaciones>("recibidas");
  const [recarga, setRecarga] = useState(0);
  const [fichaAbierta, setFichaAbierta] = useState<number | null>(null);
  const { datos: derivaciones = [], cargando, error } = useConsulta(() => getMisDerivaciones(), [recarga]);
  useTeclaEscape(onCerrar, fichaAbierta === null);

  const recibidas = derivaciones.filter((d) => d.direccion === "recibida");
  const enviadas = derivaciones.filter((d) => d.direccion === "enviada");
  const visibles = pestana === "recibidas" ? recibidas : enviadas;
  const pendientesRecibidas = recibidas.filter((d) => d.estado === "pendiente").length;

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.encabezadoTextos}>
            <h3 id={idTitulo} className={styles.titulo}>{T.tituloModal}</h3>
            <p className={styles.subtitulo}>{T.subtituloModal}</p>
          </div>
          <button type="button" className={styles.botonIcono} onClick={onCerrar} aria-label="Cerrar">
            <Iconos.cerrar size={20} />
          </button>
        </header>

        <div className={styles.cuerpo}>
          <div className={estilosDerivacion.pestanas} role="tablist">
            {PESTANAS_DERIVACIONES.map((p) => (
              <button key={p.valor} type="button" role="tab" aria-selected={pestana === p.valor}
                className={`${estilosDerivacion.pestana} ${pestana === p.valor ? estilosDerivacion.pestanaActiva : ""}`}
                onClick={() => setPestana(p.valor)}>
                {p.texto}
                {p.valor === "recibidas" && pendientesRecibidas > 0 && (
                  <span className={estilosDerivacion.contador}>{pendientesRecibidas}</span>
                )}
              </button>
            ))}
          </div>

          {cargando && derivaciones.length === 0 && <p className={styles.estado}>Cargando…</p>}
          {error && <p className={`${styles.estado} ${styles.estadoError}`}>{error}</p>}
          {!cargando && !error && visibles.length === 0 && (
            <p className={estilosDerivacion.vacio}>{pestana === "recibidas" ? T.vaciaRecibidas : T.vaciaEnviadas}</p>
          )}

          <ul className={estilosDerivacion.lista}>
            {visibles.map((d) => (
              <TarjetaDerivacion key={d.id} derivacion={d} mostrarMascota
                onCambio={() => setRecarga((n) => n + 1)}
                onVerFicha={setFichaAbierta} />
            ))}
          </ul>
        </div>
      </div>

      {fichaAbierta !== null && (
        <div onClick={(e) => e.stopPropagation()}>
          <FichaPacienteModal
            mascotaId={fichaAbierta}
            onCerrar={() => { setFichaAbierta(null); setRecarga((n) => n + 1); }}
            onRecetar={onRecetar}
          />
        </div>
      )}
    </div>
  );
};
