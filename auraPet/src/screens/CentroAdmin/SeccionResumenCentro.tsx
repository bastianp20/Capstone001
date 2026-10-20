import { Iconos, ESTADO_LABEL, TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import { getCitasCentro, getPlanes, getSuscripcionCentro } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { resumirCitasCentro } from "../../lib/centroAdmin";
import type { SeccionResumenCentroProps } from "../../interfaces";
import { KpiCard } from "../../components/ui/KpiCard";
import { EtiquetaCita } from "../../components/ui/EtiquetaCita";
import { TarjetaCentro } from "../../components/centroAdmin/TarjetaCentro";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Resumen del centro: números del día/mes, uso del plan y próximas citas.
export const SeccionResumenCentro = ({ centroId, onIrA }: SeccionResumenCentroProps) => {
  const { datos: citas = [], cargando, error } = useConsulta(() => getCitasCentro(centroId), [centroId]);
  const { datos: suscripcion } = useConsulta(async () => getSuscripcionCentro(centroId, await getPlanes()), [centroId]);
  const resumen = resumirCitasCentro(citas);
  const limite = suscripcion?.plan.limiteVeterinarios ?? null;

  return (
    <>
      <h1 className={styles.titulo}>{T.tituloResumen}</h1>
      <p className={styles.subtitulo}>{T.subtituloResumen}</p>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.kpis}>
        <KpiCard icon={<Iconos.calendario size={17} />} label={T.citasHoy} value={resumen.hoy} cargando={cargando}
          onClick={() => onIrA("agenda")} />
        <KpiCard icon={<Iconos.advertencia size={17} />} label={T.porConfirmar} value={resumen.porConfirmar} cargando={cargando}
          onClick={() => onIrA("agenda")} />
        <KpiCard icon={<Iconos.fichaMedica size={17} />} label={T.citasMes} value={resumen.mes} cargando={cargando} />
        <KpiCard icon={<Iconos.usuarios size={17} />} label={T.equipo}
          value={suscripcion ? suscripcion.veterinarios : "–"}
          hint={suscripcion ? (limite === null ? T.ilimitado : T.limite(limite)) : undefined}
          cargando={!suscripcion} onClick={() => onIrA("equipo")} />
      </div>

      <TarjetaCentro titulo={T.proximas}
        accion={<button type="button" className={styles.link} onClick={() => onIrA("agenda")}>{T.verAgenda}</button>}>
        {!cargando && resumen.proximas.length === 0 && <p className={styles.vacio}>{T.sinProximas}</p>}
        <ul className={styles.listaCitas}>
          {resumen.proximas.map((c) => (
            <li key={c.id} className={styles.citaFila}>
              <div className={styles.celdaDoble}>
                <span className={styles.fuerte}>{c.mascota} · {c.fechaHora}</span>
                <span className={styles.suave}>{c.veterinario} — {c.motivo}</span>
              </div>
              <EtiquetaCita valor={c.estado} texto={ESTADO_LABEL[c.estado]} />
            </li>
          ))}
        </ul>
      </TarjetaCentro>
    </>
  );
};
