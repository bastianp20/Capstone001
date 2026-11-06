import { ArrowUpRight, Ban, EyeOff, ShieldCheck, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { MOTIVO_REPORTE, rutaFichaAdopcion, TEXTOS_MODERACION as T, TONOS_ADOPCION } from "../../../constants";
import type { DetalleCasoModeracionProps } from "../../../interfaces";
import { haceCuanto } from "../../../lib/publicacionesAdopcion";
import { AvatarAnimal } from "../AvatarAnimal";

/** El caso abierto: el animal, quién publicó, lo que reportaron y la decisión. */
export const DetalleCasoModeracion = ({ caso: c, ocupado, onDecidir }: DetalleCasoModeracionProps) => (
  <article className="mod-detalle">
    <div className="mod-detalle-scroll">
      <header className="mod-detalle-cabecera">
        <AvatarAnimal especie={c.especie} fotoUrl={c.fotoUrl} nombre={c.nombre} tono={TONOS_ADOPCION[1]} tamanoIcono={40} className="mod-detalle-foto" />
        <div className="mod-detalle-titulo">
          <h2>{c.nombre}</h2>
          <p>
            {[c.raza, c.edad, c.comuna].filter(Boolean).join(" · ")}
            <br />
            {T.publicado(c.publicador, haceCuanto(c.publicadaEn))}
          </p>
          <Link to={rutaFichaAdopcion(c.adopcionId)} target="_blank" rel="noreferrer" className="mod-enlace">
            {T.verPublicacion} <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
        {c.decision ? (
          <span className={`mod-decision mod-decision-${c.decision}`}>
            <ShieldCheck size={15} aria-hidden /> {T.decision[c.decision]}
          </span>
        ) : (
          <span className={c.urgente ? "mod-insignia mod-insignia-urgente" : "mod-insignia"}>
            {c.urgente && <TriangleAlert size={15} aria-hidden />} {c.urgente ? `${T.urgente} · ` : ""}
            {T.reportes(c.reportes)}
          </span>
        )}
      </header>

      <dl className="mod-metricas">
        <div>
          <dt>{T.publicaciones}</dt>
          <dd>{c.publicaciones}</dd>
        </div>
        <div>
          <dt>{T.reportesPrevios}</dt>
          <dd className={c.reportesPrevios ? "mod-alerta" : ""}>{c.reportesPrevios}</dd>
        </div>
        <div>
          <dt>{T.cuenta}</dt>
          <dd className="mod-metrica-texto">{haceCuanto(c.cuentaCreadaEn)}</dd>
        </div>
      </dl>

      <section>
        <h3>{T.loQueReportaron}</h3>
        <ol className="mod-linea">
          {c.detalle.map((r, i) => {
            const m = MOTIVO_REPORTE[r.motivo];
            return (
              <li key={i} style={{ ["--mod-color" as string]: m.color }}>
                <span className="mod-linea-punto" aria-hidden />
                <div>
                  <p className="mod-linea-arriba">
                    <strong>{m.label}</strong>
                    <small>{haceCuanto(r.creadaEn)}</small>
                  </p>
                  <p className={r.comentario ? "mod-cita" : "mod-sin-comentario"}>{r.comentario ? `“${r.comentario}”` : T.sinComentario}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>

    {c.decision === null && (
      <footer className="mod-acciones">
        <button type="button" className="ap-btn ap-btn-borde mod-btn-descartar" onClick={() => onDecidir("descartar")} disabled={ocupado}>
          <Ban size={15} aria-hidden /> {T.descartar}
        </button>
        <button type="button" className="ap-btn ap-btn-borde mod-btn-advertir" onClick={() => onDecidir("advertir")} disabled={ocupado}>
          <TriangleAlert size={15} aria-hidden /> {T.advertir}
        </button>
        <button type="button" className="ap-btn mod-btn-ocultar" onClick={() => onDecidir("ocultar")} disabled={ocupado}>
          <EyeOff size={15} aria-hidden /> {T.ocultar}
        </button>
      </footer>
    )}
  </article>
);
