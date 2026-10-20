import { useId } from "react";
import { ESTADO_VERIFICACION, ESTILO_ROL, ETIQUETA_CUENTA, ETIQUETA_PRUEBA, Iconos, TEXTOS_DETALLE_USUARIO } from "../constants";
import { getDetalleUsuario } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { getIniciales } from "../utils";
import type { DetalleUsuarioModalProps } from "../interfaces";
import { Boton } from "../components/ui/Boton";
import { Etiqueta } from "../components/ui/Etiqueta";
import { DatoFicha } from "../components/veterinario/ficha/DatoFicha";
import { SeccionDetalle } from "../components/superadmin/detalleUsuario/SeccionDetalle";
import { ListaCentrosUsuario } from "../components/superadmin/detalleUsuario/ListaCentrosUsuario";
import { ResumenActividad } from "../components/superadmin/detalleUsuario/ResumenActividad";
import { ListaMascotasUsuario } from "../components/superadmin/detalleUsuario/ListaMascotasUsuario";
import { ListaCitasUsuario } from "../components/superadmin/detalleUsuario/ListaCitasUsuario";
import styles from "../css/superadmin/DetalleModal.module.css";

const T = TEXTOS_DETALLE_USUARIO;

// Todo lo de una cuenta en un solo lugar (Superadmin → Usuarios → Ver detalles).
// Las secciones aparecen según el rol: ficha profesional y centros para
// veterinarios y administrativos, mascotas para dueños.
export const DetalleUsuarioModal = ({ perfilId, onCerrar, onEditar }: DetalleUsuarioModalProps) => {
  const { datos: d, cargando, error } = useConsulta(() => getDetalleUsuario(perfilId), [perfilId]);
  const idTitulo = useId();
  useTeclaEscape(onCerrar);

  const c = d?.cuenta;
  const esVeterinario = c?.rol === "veterinario";
  const tieneCentros = d && (esVeterinario || c?.rol === "administrativo" || d.centrosAdministra.length > 0);

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          {c && <span className={styles.avatar} aria-hidden="true">{getIniciales(c.nombre)}</span>}
          <div className={styles.encabezado}>
            <h3 id={idTitulo} className={styles.titulo}>{c?.nombre ?? "Usuario"}</h3>
            {c && (
              <div className={styles.etiquetas}>
                <Etiqueta {...ESTILO_ROL[c.rol]} />
                <Etiqueta {...ETIQUETA_CUENTA[c.activa ? "activa" : "desactivada"]} />
                {c.esPrueba && <Etiqueta {...ETIQUETA_PRUEBA} />}
              </div>
            )}
          </div>
          <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label={T.cerrar}>
            <Iconos.cerrar size={20} />
          </button>
        </header>

        <div className={styles.cuerpo}>
          {cargando && <p className={styles.estado}>{T.cargando}</p>}
          {error && <p className={`${styles.estado} ${styles.error}`}>{error}</p>}

          {d && c && (
            <div className={styles.grilla}>
              <SeccionDetalle titulo={T.cuenta} icono={<Iconos.usuario size={15} aria-hidden="true" />}>
                <div className={styles.datos}>
                  <DatoFicha etiqueta="Correo" valor={<a className={styles.enlace} href={`mailto:${c.email}`}>{c.email}</a>} />
                  <DatoFicha etiqueta="Teléfono" valor={c.telefono ? <a className={styles.enlace} href={`tel:+${c.telefono}`}>+{c.telefono}</a> : null} />
                  <DatoFicha etiqueta="Registro" valor={c.registro} />
                  <DatoFicha etiqueta="Último acceso" valor={c.ultimoAcceso ?? T.nuncaIngreso} />
                  <DatoFicha etiqueta="Correo confirmado" valor={c.correoConfirmado ? "Sí" : "No"} />
                  <DatoFicha etiqueta="Tipo de cuenta" valor={c.esPrueba ? "De prueba" : "Real"} />
                </div>
              </SeccionDetalle>

              <SeccionDetalle titulo={T.actividad} icono={<Iconos.calendario size={15} aria-hidden="true" />}>
                <ResumenActividad numeros={[
                  { texto: "Citas", valor: d.citas.total },
                  { texto: "Próximas", valor: d.citas.proximas },
                  { texto: "Completadas", valor: d.citas.completadas },
                  { texto: "Canceladas", valor: d.citas.canceladas },
                  ...(esVeterinario ? [{ texto: "Recetas emitidas", valor: d.recetasEmitidas }] : []),
                ]} />
              </SeccionDetalle>

              {d.veterinario && (
                <SeccionDetalle titulo={T.profesional} icono={<Iconos.diagnostico size={15} aria-hidden="true" />}>
                  <div className={styles.datos}>
                    <DatoFicha etiqueta="Verificación" valor={<Etiqueta {...ESTADO_VERIFICACION[d.veterinario.estado]} />} />
                    <DatoFicha etiqueta="Especialidad" valor={d.veterinario.especialidad ?? "Medicina general"} />
                    <DatoFicha etiqueta="N° de colegiatura" valor={d.veterinario.numeroColegiado} />
                    <DatoFicha
                      etiqueta="Revisado por"
                      valor={d.veterinario.revisadoPor && `${d.veterinario.revisadoPor}${d.veterinario.revisadoEn ? ` · ${d.veterinario.revisadoEn}` : ""}`}
                    />
                    {d.veterinario.centroSolicitado && <DatoFicha etiqueta="Pidió unirse a" valor={d.veterinario.centroSolicitado} />}
                    {d.veterinario.centroMencionado && <DatoFicha etiqueta="Centro mencionado (no está en AuraPet)" valor={d.veterinario.centroMencionado} />}
                    {d.veterinario.motivoRechazo && <DatoFicha etiqueta="Motivo del rechazo" valor={d.veterinario.motivoRechazo} />}
                  </div>
                </SeccionDetalle>
              )}

              {tieneCentros && (
                <SeccionDetalle titulo="Centros" icono={<Iconos.centro size={15} aria-hidden="true" />}>
                  {esVeterinario && (
                    <>
                      <span className={styles.subtitulo}>{T.centrosAtiende}</span>
                      <ListaCentrosUsuario centros={d.centrosAtiende} vacio={T.sinCentrosAtiende} />
                    </>
                  )}
                  <span className={styles.subtitulo}>{T.centrosAdministra}</span>
                  <ListaCentrosUsuario centros={d.centrosAdministra} vacio={T.sinCentrosAdministra} />
                </SeccionDetalle>
              )}

              {c.rol === "dueno" && (
                <SeccionDetalle titulo={`${T.mascotas} (${d.mascotas.length})`} icono={<Iconos.huella size={15} aria-hidden="true" />}>
                  <ListaMascotasUsuario mascotas={d.mascotas} />
                </SeccionDetalle>
              )}

              <SeccionDetalle titulo={T.ultimasCitas} icono={<Iconos.historial size={15} aria-hidden="true" />} ancha>
                <ListaCitasUsuario citas={d.ultimasCitas} />
              </SeccionDetalle>
            </div>
          )}
        </div>

        <footer className={styles.pie}>
          <Boton variante="secundario" onClick={onCerrar}>{T.cerrar}</Boton>
          {d && <Boton icono={<Iconos.editar size={16} />} onClick={onEditar}>{T.editarCuenta}</Boton>}
        </footer>
      </div>
    </div>
  );
};
