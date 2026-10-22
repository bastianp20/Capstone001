import { Iconos, TEXTOS_PDF as T } from "../../constants";
import { useDescargaPdf } from "../../hooks/useDescargaPdf";
import type { BotonRecetaPdfProps } from "../../interfaces";
import { Boton } from "../ui/Boton";
import styles from "../../css/pdf/DescargaPdf.module.css";

// Botón para bajar una receta en PDF (con firma y N° de colegiado).
export const BotonRecetaPdf = ({ mascotaId, recetaId, texto = T.receta }: BotonRecetaPdfProps) => {
  const { descargarReceta, ocupado, error } = useDescargaPdf();
  return (
    <span className={styles.botonReceta}>
      <Boton variante="secundario" icono={<Iconos.descargar size={15} />} cargando={ocupado}
        onClick={() => descargarReceta(mascotaId, recetaId)}>
        {ocupado ? T.generando : texto}
      </Boton>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </span>
  );
};
