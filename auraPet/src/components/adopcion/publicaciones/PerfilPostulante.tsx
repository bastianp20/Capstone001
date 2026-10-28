import { Home, Sparkles, Users } from "lucide-react";
import { TEXTOS_ELEGIR_FAMILIA as T } from "../../../constants";
import type { PerfilPostulanteProps } from "../../../interfaces";

/** Lo que contó quien postula: su hogar, su familia, su experiencia y por qué quiere adoptar. */
export const PerfilPostulante = ({ postulacion: p }: PerfilPostulanteProps) => {
  const hogar = [
    T.vivienda[p.vivienda],
    p.tienePatio ? T.conPatio : T.sinPatio,
    T.tenencia[p.tenencia],
    p.tenencia === "arrendada" ? (p.permitenMascotas ? T.permiten : T.noPermiten) : null,
  ].filter(Boolean).join(", ");
  const familia = [
    p.hayNinos ? T.ninos(p.edadesNinos) : T.sinNinos,
    p.otrasMascotas ? T.mascotas(p.cualesMascotas) : T.sinMascotas,
    p.todosDeAcuerdo ? T.deAcuerdo : T.noDeAcuerdo,
  ].join(" · ");

  return (
    <section className="ap-tarjeta ap-perfil">
      <h2>{p.nombre}</h2>
      <div className="ap-perfil-bloques">
        <div className="ap-perfil-bloque">
          <Home size={18} aria-hidden />
          <div>
            <h3>{T.hogar}</h3>
            <p>{hogar}</p>
          </div>
        </div>
        <div className="ap-perfil-bloque">
          <Users size={18} aria-hidden />
          <div>
            <h3>{T.familia}</h3>
            <p>{familia}</p>
          </div>
        </div>
        <div className="ap-perfil-bloque">
          <Sparkles size={18} aria-hidden />
          <div>
            <h3>{T.experiencia}</h3>
            <p>{p.experiencia?.trim() || T.sinExperiencia}</p>
          </div>
        </div>
      </div>
      <blockquote className="ap-cita">
        <span>{T.porQue}</span>
        “{p.motivo}”
      </blockquote>
    </section>
  );
};
