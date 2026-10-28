import { Lock, Mail, Phone } from "lucide-react";
import { TEXTOS_MI_REFUGIO as T, TEXTOS_REFUGIOS_ADMIN } from "../../../../constants";
import type { TarjetaDatosRefugioProps } from "../../../../interfaces";
import { IconosEspecies } from "../gestion/IconosEspecies";
import { telefonoParaMostrar } from "../../../../lib/refugios";

/** Descripción, contacto y especies, con "Editar". */
export const TarjetaDatosRefugio = ({ refugio: r, onEditar }: TarjetaDatosRefugioProps) => (
  <section className="ap-tarjeta mr-datos">
    <div className="mr-datos-cabecera">
      <h2>{T.datos}</h2>
      <button type="button" className="ap-btn-texto" onClick={onEditar}>
        {T.editar}
      </button>
    </div>
    <p>{r.descripcion || <span className="ap-suave">{TEXTOS_REFUGIOS_ADMIN.sinDescripcion}</span>}</p>
    <ul className="mr-datos-contacto">
      {r.telefono && (
        <li>
          <Phone size={15} aria-hidden /> {telefonoParaMostrar(r.telefono)}
        </li>
      )}
      {r.correo && (
        <li>
          <Mail size={15} aria-hidden /> {r.correo}
        </li>
      )}
    </ul>
    <IconosEspecies especies={r.especies} conTexto />
    <p className="mr-candado">
      <Lock size={14} aria-hidden /> {T.gestionaAuraPet}
    </p>
  </section>
);
