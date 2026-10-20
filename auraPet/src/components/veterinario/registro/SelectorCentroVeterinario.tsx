import { MAX_CARACTERES_CENTRO_MENCIONADO, MAX_CARACTERES_COMUNA, OPCIONES_MODO_CENTRO, TEXTOS_REGISTRO_VETERINARIO } from "../../../constants";
import type { SelectorCentroVeterinarioProps } from "../../../interfaces";
import styles from "../../../css/veterinario/RegistroVeterinario.module.css";

// "¿Dónde trabajas?": independiente, en un centro de AuraPet (lista) o en un
// centro que todavía no está en AuraPet (nombre y comuna, para invitarlo después).
// Lo usan el registro público y el modal "Cuenta profesional" del superadmin.
export const SelectorCentroVeterinario = ({ datos, centros, onCambiar, ayudaCentroAuraPet }: SelectorCentroVeterinarioProps) => (
  <fieldset className={styles.grupo}>
    <legend className={styles.etiqueta}>{TEXTOS_REGISTRO_VETERINARIO.dondeTrabajas}</legend>

    <div className={styles.opciones} role="radiogroup">
      {OPCIONES_MODO_CENTRO.map((o) => {
        const activa = datos.modoCentro === o.valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={activa}
            className={`${styles.opcion} ${activa ? styles.opcionActiva : ""}`}
            onClick={() => onCambiar({ modoCentro: o.valor })}
          >
            <span className={styles.opcionTitulo}>{o.titulo}</span>
            <span className={styles.opcionDetalle}>{o.detalle}</span>
          </button>
        );
      })}
    </div>

    {datos.modoCentro === "centro_aurapet" && (
      <div className={styles.subcampo}>
        <label htmlFor="registro-vet-centro" className={styles.subetiqueta}>{TEXTOS_REGISTRO_VETERINARIO.elegirCentro}</label>
        <select
          id="registro-vet-centro"
          className={styles.control}
          value={datos.centroId ?? ""}
          onChange={(e) => onCambiar({ centroId: e.target.value ? Number(e.target.value) : null })}
          disabled={centros.length === 0}
        >
          <option value="">{centros.length === 0 ? TEXTOS_REGISTRO_VETERINARIO.sinCentros : "Selecciona un centro"}</option>
          {centros.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}{c.comuna ? ` · ${c.comuna}` : ""}</option>
          ))}
        </select>
        {ayudaCentroAuraPet && <small className={styles.ayuda}>{ayudaCentroAuraPet}</small>}
      </div>
    )}

    {datos.modoCentro === "centro_externo" && (
      <div className={styles.dosColumnas}>
        <div className={styles.subcampo}>
          <label htmlFor="registro-vet-centro-nombre" className={styles.subetiqueta}>{TEXTOS_REGISTRO_VETERINARIO.nombreCentro}</label>
          <input
            id="registro-vet-centro-nombre"
            className={styles.control}
            value={datos.centroNombre}
            maxLength={MAX_CARACTERES_CENTRO_MENCIONADO}
            onChange={(e) => onCambiar({ centroNombre: e.target.value })}
            placeholder="Ej: Clínica Veterinaria San Roque"
          />
        </div>
        <div className={styles.subcampo}>
          <label htmlFor="registro-vet-centro-comuna" className={styles.subetiqueta}>{TEXTOS_REGISTRO_VETERINARIO.comunaCentro}</label>
          <input
            id="registro-vet-centro-comuna"
            className={styles.control}
            value={datos.centroComuna}
            maxLength={MAX_CARACTERES_COMUNA}
            onChange={(e) => onCambiar({ centroComuna: e.target.value })}
            placeholder="Ej: Providencia"
          />
        </div>
        <small className={`${styles.ayuda} ${styles.completo}`}>{TEXTOS_REGISTRO_VETERINARIO.ayudaExterno}</small>
      </div>
    )}
  </fieldset>
);
