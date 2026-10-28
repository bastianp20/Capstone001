import { Ban, BadgeCheck, Mail, MapPin, PawPrint, Pencil, Phone } from "lucide-react";
import { COLOR_RECEPCION_REFUGIO, MAX_FOTOS_DETALLE_REFUGIO, RECEPCION_REFUGIO_OPCIONES, TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import { useChecklist } from "../../../../hooks/useChecklist";
import type { PanelDetalleRefugioProps } from "../../../../interfaces";
import { ocupacionRefugio } from "../../../../lib/publicacionesAdopcion";
import { AnilloProgreso } from "../../comun/AnilloProgreso";
import { PanelLateralAdopcion } from "../../comun/PanelLateralAdopcion";
import { ChipEstadoRefugio } from "../gestion/ChipEstadoRefugio";
import { IconosEspecies } from "../gestion/IconosEspecies";
import { ListaAdministradores } from "../gestion/ListaAdministradores";
import { LogoRefugio } from "../gestion/LogoRefugio";
import { telefonoParaMostrar } from "../../../../lib/refugios";

/** Panel lateral con todo el refugio; si está por revisar, el checklist y Aprobar/Rechazar. */
export const PanelDetalleRefugio = ({ refugio: r, ocupado, onCerrar, onEditar, onVerificar }: PanelDetalleRefugioProps) => {
  const checklist = useChecklist(T.itemsChecklist.length);
  const porRevisar = r.estado === "pendiente";
  const recepcion = RECEPCION_REFUGIO_OPCIONES.find((o) => o.valor === r.recibe);

  const pie = porRevisar ? (
    <>
      <button type="button" className="ap-btn ra-btn-rechazar" disabled={ocupado} onClick={() => onVerificar(false)}>
        <Ban size={16} aria-hidden /> {T.rechazar}
      </button>
      <button type="button" className="ap-btn ap-btn-primario" disabled={ocupado || !checklist.completa} onClick={() => onVerificar(true)}>
        <BadgeCheck size={16} aria-hidden /> {T.aprobar}
      </button>
    </>
  ) : (
    <button type="button" className="ap-btn ap-btn-borde" onClick={onEditar}>
      <Pencil size={16} aria-hidden /> {T.editar}
    </button>
  );

  return (
    <PanelLateralAdopcion titulo={r.nombre} onCerrar={onCerrar} pie={pie}>
      <div className="ra-detalle-portada">
        {r.portadaUrl ? <img src={r.portadaUrl} alt="" /> : <span className="ra-detalle-portada-vacia" aria-hidden><PawPrint size={40} /></span>}
        <LogoRefugio nombre={r.nombre} logoUrl={r.logoUrl} tamano="grande" />
      </div>

      <div className="ra-detalle-cabecera">
        <ChipEstadoRefugio estado={r.estado} />
        {r.esPrueba && <span className="ap-chip ap-chip-prueba">{T.prueba}</span>}
        <p className="ap-suave">
          <MapPin size={14} aria-hidden /> {r.comuna} · {r.region}
        </p>
        <p className="ra-detalle-contacto">
          {r.telefono && (
            <span>
              <Phone size={14} aria-hidden /> {telefonoParaMostrar(r.telefono)}
            </span>
          )}
          {r.correo && (
            <span>
              <Mail size={14} aria-hidden /> {r.correo}
            </span>
          )}
        </p>
        <p>{r.descripcion || <span className="ap-suave">{T.sinDescripcion}</span>}</p>
      </div>

      <section className="ra-detalle-bloque ra-detalle-capacidad">
        <h3>{T.capacidad}</h3>
        <AnilloProgreso porcentaje={ocupacionRefugio(r)} tamano={72} grosor={7} etiqueta={`${r.cuposOcupados}/${r.cuposTotales}`} color={COLOR_RECEPCION_REFUGIO[r.recibe]} />
        <div className="ra-detalle-capacidad-texto">
          <strong>{T.cuposLibres(Math.max(0, r.cuposTotales - r.cuposOcupados))}</strong>
          <span className={`ap-chip ap-chip-recibe-${r.recibe}`}>{recepcion?.titulo}</span>
          <IconosEspecies especies={r.especies} conTexto />
        </div>
      </section>

      <section className="ra-detalle-bloque">
        <h3>{T.administradores}</h3>
        {r.administradores.length ? <ListaAdministradores administradores={r.administradores} /> : <p className="ap-suave">{T.sinAdmins}</p>}
      </section>

      <section className="ra-detalle-bloque">
        <h3>
          {T.animalesPublicados} <span className="ap-pestana-contador">{r.enAdopcion}</span>
        </h3>
        {r.fotos.length ? (
          <div className="ra-detalle-fotos">
            {r.fotos.slice(0, MAX_FOTOS_DETALLE_REFUGIO).map((f) => (
              <img key={f} src={f} alt="" loading="lazy" />
            ))}
          </div>
        ) : (
          <p className="ap-suave">{T.sinAnimales}</p>
        )}
      </section>

      {porRevisar && (
        <section className="ra-detalle-bloque">
          <h3>{T.checklist}</h3>
          <ul className="ra-checklist">
            {T.itemsChecklist.map((item, i) => (
              <li key={item}>
                <label>
                  <input type="checkbox" checked={checklist.marcadas[i]} onChange={() => checklist.alternar(i)} />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          {!checklist.completa && <small className="ap-suave">{T.checklistAyuda}</small>}
        </section>
      )}
    </PanelLateralAdopcion>
  );
};
