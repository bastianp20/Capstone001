import { useState } from "react";
import styles from "../../css/DuenoSecciones.module.css";
import { TIPO_REGISTRO_LABEL } from "../../constants";
import type { HistorialMedicoProps } from "../../interfaces";
import { TarjetaPanel } from "../ui/TarjetaPanel";
import { EstadoVacio } from "../ui/EstadoVacio";
import { TarjetaReceta } from "./TarjetaReceta";

// Sección "Historial médico": registros (diagnósticos, vacunas, cirugías...)
// y recetas, con un filtro por mascota arriba.
export const HistorialMedico = ({ mascotas, historial, cargando }: HistorialMedicoProps) => {
  const [mascotaId, setMascotaId] = useState<number | null>(null); // null = todas

  const registros = historial.registros.filter((r) => mascotaId === null || r.mascotaId === mascotaId);
  const recetas = historial.recetas.filter((r) => mascotaId === null || r.mascotaId === mascotaId);

  return (
    <>
      {/* Filtro por mascota (solo si tiene más de una) */}
      {mascotas.length > 1 && (
        <div className={styles.filtros}>
          <button type="button" className={mascotaId === null ? styles.filtroActivo : styles.filtro}
            onClick={() => setMascotaId(null)}>
            Todas
          </button>
          {mascotas.map((m) => (
            <button key={m.id} type="button" className={mascotaId === m.id ? styles.filtroActivo : styles.filtro}
              onClick={() => setMascotaId(m.id)}>
              {m.nombre}
            </button>
          ))}
        </div>
      )}

      <div className={styles.dosColumnas}>
        <TarjetaPanel titulo="Atenciones y vacunas">
          {cargando ? (
            <EstadoVacio texto="Cargando…" />
          ) : registros.length === 0 ? (
            <EstadoVacio texto="Todavía no hay registros médicos." />
          ) : (
            registros.map((r) => (
              <div key={r.id} className={styles.registro}>
                <div className={styles.registroCabecera}>
                  <span><strong>{r.mascota}</strong> · <span className={styles.tipo}>{TIPO_REGISTRO_LABEL[r.tipo]}</span></span>
                  <span className={styles.textoSuave}>{r.fecha}</span>
                </div>
                <span>{r.descripcion}</span>
                {r.tratamiento && <span className={styles.textoSuave}>Tratamiento: {r.tratamiento}</span>}
                {r.proximaDosis && <span className={styles.textoSuave}>Próxima dosis: {r.proximaDosis}</span>}
              </div>
            ))
          )}
        </TarjetaPanel>

        <TarjetaPanel titulo="Recetas">
          {cargando ? (
            <EstadoVacio texto="Cargando…" />
          ) : recetas.length === 0 ? (
            <EstadoVacio texto="Todavía no hay recetas." />
          ) : (
            recetas.map((r) => <TarjetaReceta key={r.id} receta={r} />)
          )}
        </TarjetaPanel>
      </div>
    </>
  );
};
