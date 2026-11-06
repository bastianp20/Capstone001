import { useId } from "react";
import { ESTADO_SUSCRIPCION, ESTADO_VERIFICACION, ETIQUETA_PRUEBA, Iconos, TEXTOS_DETALLE_CENTRO } from "../constants";
import { getDetalleCentro } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { formatearCLP } from "../lib/suscripcion";
import type { DetalleCentroModalProps } from "../interfaces";
import { Boton } from "../components/ui/Boton";
import { Etiqueta } from "../components/ui/Etiqueta";
import { DatoFicha } from "../components/veterinario/ficha/DatoFicha";
import { SeccionDetalle } from "../components/superadmin/detalleUsuario/SeccionDetalle";
import { ResumenActividad } from "../components/superadmin/detalleUsuario/ResumenActividad";
import { ListaCitasUsuario } from "../components/superadmin/detalleUsuario/ListaCitasUsuario";
import { HorarioCentroLista } from "../components/superadmin/detalleCentro/HorarioCentroLista";
import { ListaPersonasCentro } from "../components/superadmin/detalleCentro/ListaPersonasCentro";
import styles from "../css/superadmin/DetalleModal.module.css";

const T = TEXTOS_DETALLE_CENTRO;

// Todo lo de un centro en un solo lugar (Superadmin → Centros → Ver detalles):
// datos, horario, especialidades, suscripción, equipo, actividad y origen.
export const DetalleCentroModal = ({ centroId, onCerrar, onEditar }: DetalleCentroModalProps) => {
  const { datos: d, cargando, error } = useConsulta(() => getDetalleCentro(centroId), [centroId]);
  const idTitulo = useId();
  useTeclaEscape(onCerrar);
  const c = d?.centro;

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <span className={styles.avatar} aria-hidden="true"><Iconos.centro size={22} /></span>
          <div className={styles.encabezado}>
            <h3 id={idTitulo} className={styles.titulo}>{c?.nombre ?? "Centro"}</h3>
            {c && (
              <div className={styles.etiquetas}>
                <Etiqueta {...ESTADO_VERIFICACION[c.estado]} />
                {d?.suscripcion && <Etiqueta {...ESTADO_SUSCRIPCION[d.suscripcion.estado]} texto={`Plan ${d.suscripcion.plan} · ${ESTADO_SUSCRIPCION[d.suscripcion.estado].texto}`} />}
                {c.esPrueba && <Etiqueta {...ETIQUETA_PRUEBA} />}
              </div>
            )}
          </div>
          <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
            <Iconos.cerrar size={20} />
          </button>
        </header>

        <div className={styles.cuerpo}>
          {cargando && <p className={styles.estado}>{T.cargando}</p>}
          {error && <p className={`${styles.estado} ${styles.error}`}>{error}</p>}

          {d && c && (
            <div className={styles.grilla}>
              <SeccionDetalle titulo={T.datos} icono={<Iconos.ubicacion size={15} aria-hidden="true" />}>
                <div className={styles.datos}>
                  <DatoFicha etiqueta="Dirección" valor={`${c.direccion}, ${c.comuna}`} />
                  <DatoFicha etiqueta="Teléfono" valor={c.telefono ? <a className={styles.enlace} href={`tel:+${c.telefono}`}>+{c.telefono}</a> : null} />
                  <DatoFicha etiqueta="Creado" valor={c.creado} />
                  <DatoFicha etiqueta="Tipo" valor={c.esPrueba ? "De prueba" : "Real"} />
                  <DatoFicha etiqueta="Revisado por" valor={c.revisadoPor && `${c.revisadoPor}${c.revisadoEn ? ` · ${c.revisadoEn}` : ""}`} />
                  {c.motivoRechazo && <DatoFicha etiqueta="Motivo del rechazo" valor={c.motivoRechazo} />}
                </div>
              </SeccionDetalle>

              <SeccionDetalle titulo={T.actividad} icono={<Iconos.calendario size={15} aria-hidden="true" />}>
                <ResumenActividad numeros={[
                  { texto: "Citas", valor: d.citas.total },
                  { texto: "Hoy", valor: d.citas.hoy },
                  { texto: "Próximas", valor: d.citas.proximas },
                  { texto: "Completadas", valor: d.citas.completadas },
                  { texto: "Canceladas", valor: d.citas.canceladas },
                  { texto: "Pacientes", valor: d.citas.pacientes },
                ]} />
              </SeccionDetalle>

              <SeccionDetalle titulo={T.suscripcion} icono={<Iconos.suscripcion size={15} aria-hidden="true" />}>
                {d.suscripcion ? (
                  <div className={styles.datos}>
                    <DatoFicha etiqueta="Plan" valor={`${d.suscripcion.plan} · ${d.suscripcion.precio === 0 ? "Gratis" : `${formatearCLP(d.suscripcion.precio)}/mes`}`} />
                    <DatoFicha etiqueta="Estado" valor={<Etiqueta {...ESTADO_SUSCRIPCION[d.suscripcion.estado]} />} />
                    {d.suscripcion.finPrueba && <DatoFicha etiqueta="Fin de la prueba" valor={d.suscripcion.finPrueba} />}
                    {d.suscripcion.renovacion && <DatoFicha etiqueta="Renovación" valor={d.suscripcion.renovacion} />}
                    {d.suscripcion.planSolicitado && <DatoFicha etiqueta="Pidió cambiar a" valor={d.suscripcion.planSolicitado} />}
                  </div>
                ) : (
                  <p className={styles.vacio}>{T.sinSuscripcion}</p>
                )}
              </SeccionDetalle>

              <SeccionDetalle titulo={T.horario} icono={<Iconos.horario size={15} aria-hidden="true" />}>
                <HorarioCentroLista horarios={d.horarios} />
              </SeccionDetalle>

              <SeccionDetalle titulo={`${T.administradores} (${d.administradores.length})`} icono={<Iconos.permisos size={15} aria-hidden="true" />}>
                <ListaPersonasCentro personas={d.administradores} vacio={T.sinAdministradores} />
              </SeccionDetalle>

              <SeccionDetalle titulo={`${T.veterinarios} (${d.veterinarios.length})`} icono={<Iconos.diagnostico size={15} aria-hidden="true" />}>
                <ListaPersonasCentro personas={d.veterinarios} vacio={T.sinVeterinarios} />
              </SeccionDetalle>

              <SeccionDetalle titulo={T.especialidades} icono={<Iconos.fichaMedica size={15} aria-hidden="true" />} ancha>
                {d.especialidades.length === 0 ? (
                  <p className={styles.vacio}>{T.sinEspecialidades}</p>
                ) : (
                  <div className={styles.chips}>
                    {d.especialidades.map((e) => <span key={e} className={styles.chip}>{e}</span>)}
                  </div>
                )}
              </SeccionDetalle>

              <SeccionDetalle titulo={T.ultimasCitas} icono={<Iconos.historial size={15} aria-hidden="true" />} ancha>
                <ListaCitasUsuario citas={d.ultimasCitas} />
              </SeccionDetalle>

              {d.solicitudOrigen && (
                <SeccionDetalle titulo={`${T.origen} · ${d.solicitudOrigen.fecha}`} icono={<Iconos.solicitarCita size={15} aria-hidden="true" />} ancha>
                  <div className={styles.datos}>
                    <DatoFicha etiqueta="Responsable" valor={`${d.solicitudOrigen.responsable} · ${d.solicitudOrigen.cargo}`} />
                    <DatoFicha etiqueta="Correo" valor={<a className={styles.enlace} href={`mailto:${d.solicitudOrigen.correo}`}>{d.solicitudOrigen.correo}</a>} />
                    <DatoFicha etiqueta="Teléfono" valor={<a className={styles.enlace} href={`tel:+56${d.solicitudOrigen.telefono}`}>+56 {d.solicitudOrigen.telefono}</a>} />
                    <DatoFicha etiqueta="Sitio web o redes" valor={d.solicitudOrigen.sitioWeb} />
                  </div>
                  {d.solicitudOrigen.mensaje && <p className={styles.mensaje}>{d.solicitudOrigen.mensaje}</p>}
                </SeccionDetalle>
              )}
            </div>
          )}
        </div>

        <footer className={styles.pie}>
          <Boton variante="secundario" onClick={onCerrar}>Cerrar</Boton>
          {d && <Boton icono={<Iconos.editar size={16} />} onClick={onEditar}>{T.editarCentro}</Boton>}
        </footer>
      </div>
    </div>
  );
};
