import { useMemo, useState } from "react";
import styles from "../../css/modal/RecetaModal.module.css";
import { Iconos } from "../../constants";
import type { SelectorPacienteProps } from "../../interfaces";
import { TarjetaPaciente } from "./TarjetaPaciente";

const iconos = Iconos;

// Elegir paciente: mientras no hay uno elegido muestra un buscador con la
// lista de pacientes del veterinario; al elegir, muestra su tarjeta.
export const SelectorPaciente = ({ pacientes, pacienteId, onSeleccionar, cargando }: SelectorPacienteProps) => {
  const [busqueda, setBusqueda] = useState("");

  // Filtra por nombre de la mascota o del dueño (sin importar mayúsculas)
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return pacientes;
    return pacientes.filter(
      (p) => p.nombre.toLowerCase().includes(texto) || p.dueno.toLowerCase().includes(texto)
    );
  }, [pacientes, busqueda]);

  const elegido = pacientes.find((p) => p.id === pacienteId);

  // Ya hay paciente: solo la tarjeta, con la opción de cambiarlo
  if (elegido) {
    return <TarjetaPaciente paciente={elegido} onCambiar={() => onSeleccionar(null)} />;
  }

  return (
    <>
      <div className={styles.buscador}>
        <iconos.buscar size={15} className={styles.buscadorIcono} />
        <input
          className={styles.input}
          placeholder="Buscar por mascota o dueño…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          autoFocus
        />
      </div>

      <div className={styles.listaPacientes}>
        {cargando && <p className={styles.vacio}>Cargando pacientes…</p>}
        {!cargando && filtrados.length === 0 && (
          <p className={styles.vacio}>
            {pacientes.length === 0 ? "Todavía no tienes pacientes con citas." : "Ningún paciente coincide."}
          </p>
        )}
        {filtrados.map((p) => (
          <button key={p.id} type="button" className={styles.opcionPaciente} onClick={() => onSeleccionar(p.id)}>
            <span>
              <strong>{p.nombre}</strong> <span className={styles.textoSuave}>· {p.especie}</span>
            </span>
            <span className={styles.textoSuave}>{p.dueno}</span>
          </button>
        ))}
      </div>
    </>
  );
};
