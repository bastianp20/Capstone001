import { useState } from "react";
import { Iconos, TEXTOS_PDF as T } from "../../constants";
import { useDescargaPdf } from "../../hooks/useDescargaPdf";
import type { DescargaFichaPdfProps, TipoPdfFicha } from "../../interfaces";
import { Boton } from "../ui/Boton";
import styles from "../../css/pdf/DescargaPdf.module.css";

// Recuadro "Ficha médica en PDF": elegir mascota (si hay varias) y bajar la
// ficha completa o el resumen. Lo usan la ficha del veterinario y el dueño.
export const DescargaFichaPdf = ({ mascotas, mascotaInicialId }: DescargaFichaPdfProps) => {
  const [mascotaId, setMascotaId] = useState<number | null>(mascotaInicialId ?? mascotas[0]?.id ?? null);
  const [tipoEnCurso, setTipoEnCurso] = useState<TipoPdfFicha | null>(null);
  const { descargarFicha, ocupado, error } = useDescargaPdf();

  const descargar = async (tipo: TipoPdfFicha) => {
    if (mascotaId === null) return;
    setTipoEnCurso(tipo);
    await descargarFicha(mascotaId, tipo);
    setTipoEnCurso(null);
  };

  if (mascotas.length === 0) return null;

  return (
    <section className={styles.recuadro}>
      <div className={styles.textos}>
        <h4 className={styles.titulo}><Iconos.fichaMedica size={16} aria-hidden="true" /> {T.tituloDescargas}</h4>
        <p className={styles.ayuda}>{T.ayudaDescargas}</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
      <div className={styles.acciones}>
        {mascotas.length > 1 && (
          <select className={styles.selector} value={mascotaId ?? ""} aria-label={T.mascota}
            onChange={(e) => setMascotaId(Number(e.target.value))} disabled={ocupado}>
            {mascotas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        )}
        <Boton variante="secundario" icono={<Iconos.descargar size={15} />} disabled={ocupado && tipoEnCurso !== "resumen"}
          cargando={tipoEnCurso === "resumen"} onClick={() => descargar("resumen")}>
          {tipoEnCurso === "resumen" ? T.generando : T.resumen}
        </Boton>
        <Boton icono={<Iconos.descargar size={15} />} disabled={ocupado && tipoEnCurso !== "completa"}
          cargando={tipoEnCurso === "completa"} onClick={() => descargar("completa")}>
          {tipoEnCurso === "completa" ? T.generando : T.fichaCompleta}
        </Boton>
      </div>
    </section>
  );
};
