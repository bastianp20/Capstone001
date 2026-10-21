import { useState } from "react";
import { Iconos, TEXTOS_NOTAS as T } from "../../constants";
import { useNotas } from "../../hooks/useNotas";
import type { DatosNota, Nota, PanelNotasProps } from "../../interfaces";
import { Boton } from "../ui/Boton";
import { FormNota } from "./FormNota";
import { TarjetaNota } from "./TarjetaNota";
import styles from "../../css/notas/Notas.module.css";

// Libreta de notas personales (superadmin y veterinarios): buscador,
// botón "Nueva nota" y la grilla. Una nota a la vez se edita en su lugar.
export const PanelNotas = ({ descripcion }: PanelNotasProps) => {
  const { notas, cargando, error, ocupado, crear, editar, alternarFijada, borrar } = useNotas();
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const texto = busqueda.trim().toLowerCase();
  const visibles = texto
    ? notas.filter((n) => `${n.titulo} ${n.contenido}`.toLowerCase().includes(texto))
    : notas;

  const guardarNueva = async (datos: DatosNota) => {
    if (await crear(datos)) setCreando(false);
  };

  const guardarEdicion = async (nota: Nota, datos: DatosNota) => {
    if (await editar(nota, datos)) setEditando(null);
  };

  const confirmarBorrado = (nota: Nota) => {
    if (window.confirm(T.confirmarBorrar(nota.titulo))) borrar(nota);
  };

  return (
    <div className={styles.panel}>
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}

      <div className={styles.barra}>
        <input type="search" className={styles.buscador} value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder={T.buscar} aria-label={T.buscar} />
        {!creando && (
          <Boton icono={<Iconos.agregar size={16} />} onClick={() => { setCreando(true); setEditando(null); }}>
            {T.nueva}
          </Boton>
        )}
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      {creando && <FormNota ocupado={ocupado} onGuardar={guardarNueva} onCancelar={() => setCreando(false)} />}

      {cargando && notas.length === 0 && <p className={styles.vacio}>Cargando…</p>}
      {!cargando && notas.length === 0 && !creando && <p className={styles.vacio}>{T.vacio}</p>}
      {notas.length > 0 && visibles.length === 0 && <p className={styles.vacio}>{T.sinResultados}</p>}

      <div className={styles.grilla}>
        {visibles.map((n) =>
          editando === n.id ? (
            <FormNota key={n.id} inicial={{ titulo: n.titulo, contenido: n.contenido, color: n.color }} ocupado={ocupado}
              onGuardar={(datos) => guardarEdicion(n, datos)} onCancelar={() => setEditando(null)} />
          ) : (
            <TarjetaNota key={n.id} nota={n} ocupado={ocupado}
              onEditar={() => { setEditando(n.id); setCreando(false); }}
              onFijar={() => alternarFijada(n)}
              onBorrar={() => confirmarBorrado(n)} />
          )
        )}
      </div>
    </div>
  );
};
