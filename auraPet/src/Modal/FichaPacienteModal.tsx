import { useCallback, useId, useMemo, useState } from "react";
import { Iconos, TEXTOS_DERIVACION } from "../constants";
import { getFichaPaciente } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { faltanDatosClinicos, resumirVacunas } from "../lib/fichaPaciente";
import type { FichaPacienteModalProps, VistaFicha } from "../interfaces";
import { Boton } from "../components/ui/Boton";
import { AlertasClinicas } from "../components/veterinario/ficha/AlertasClinicas";
import { AvisoFichaIncompleta } from "../components/veterinario/ficha/AvisoFichaIncompleta";
import { ResumenPaciente } from "../components/veterinario/ficha/ResumenPaciente";
import { EstadoVacunas } from "../components/veterinario/ficha/EstadoVacunas";
import { HistorialPaciente } from "../components/veterinario/ficha/HistorialPaciente";
import { FormRegistroMedico } from "../components/veterinario/ficha/FormRegistroMedico";
import { FormDatosClinicos } from "../components/veterinario/ficha/FormDatosClinicos";
import { FormDerivacion } from "../components/veterinario/ficha/FormDerivacion";
import { DerivacionesPaciente } from "../components/veterinario/ficha/DerivacionesPaciente";
import { DescargaFichaPdf } from "../components/pdf/DescargaFichaPdf";
import styles from "../css/modal/FichaPacienteModal.module.css";

const TITULO_VISTA: Record<Exclude<VistaFicha, "resumen">, string> = {
  registro: "Agregar registro médico",
  datos: "Actualizar datos clínicos",
  derivar: TEXTOS_DERIVACION.tituloForm,
};

// Ficha del paciente: pide los datos y arma las piezas. Tiene tres vistas:
// la ficha ("resumen") y los formularios para agregar un registro o
// actualizar los datos clínicos. Al guardar, recarga y vuelve a la ficha.
export const FichaPacienteModal = ({ mascotaId, onCerrar, onRecetar }: FichaPacienteModalProps) => {
  const [vista, setVista] = useState<VistaFicha>("resumen");
  const [recarga, setRecarga] = useState(0);
  const { datos: ficha, cargando, error } = useConsulta(() => getFichaPaciente(mascotaId), [mascotaId, recarga]);
  const idTitulo = useId();

  const vacunas = useMemo(() => (ficha ? resumirVacunas(ficha.historial) : []), [ficha]);

  // Escape: desde un formulario vuelve a la ficha; desde la ficha, cierra
  const alEscape = useCallback(() => (vista === "resumen" ? onCerrar() : setVista("resumen")), [vista, onCerrar]);
  useTeclaEscape(alEscape);

  const alGuardar = () => {
    setRecarga((n) => n + 1);
    setVista("resumen");
  };

  const contenido = () => {
    if (cargando && !ficha) return <p className={styles.estado}>Cargando ficha…</p>;
    if (error || !ficha) return <p className={`${styles.estado} ${styles.estadoError}`}>{error ?? "No se encontró la ficha."}</p>;

    if (vista === "registro") {
      return <FormRegistroMedico mascotaId={mascotaId} onGuardado={alGuardar} onCancelar={() => setVista("resumen")} />;
    }
    if (vista === "derivar") {
      return <FormDerivacion mascotaId={mascotaId} onGuardado={alGuardar} onCancelar={() => setVista("resumen")} />;
    }
    if (vista === "datos") {
      return (
        <FormDatosClinicos mascotaId={mascotaId} datos={ficha.datosClinicos}
          onGuardado={alGuardar} onCancelar={() => setVista("resumen")} />
      );
    }
    return (
      <>
        <AlertasClinicas alergias={ficha.datosClinicos.alergias} condicionesCronicas={ficha.datosClinicos.condicionesCronicas} />
        <AvisoFichaIncompleta
          faltanDatos={faltanDatosClinicos(ficha.datosClinicos)}
          faltaHistorial={ficha.historial.length === 0}
          onCompletarDatos={() => setVista("datos")}
          onAgregarRegistro={() => setVista("registro")}
        />
        <DescargaFichaPdf mascotas={[{ id: ficha.id, nombre: ficha.nombre }]} />
        <ResumenPaciente ficha={ficha} />
        <EstadoVacunas vacunas={vacunas} />
        <DerivacionesPaciente mascotaId={mascotaId} recarga={recarga} />
        <HistorialPaciente registros={ficha.historial} />
      </>
    );
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          {vista !== "resumen" && (
            <button type="button" className={styles.botonIcono} onClick={() => setVista("resumen")} aria-label="Volver a la ficha">
              <Iconos.volver size={18} /> Ficha
            </button>
          )}
          <div className={styles.encabezadoTextos}>
            <h3 id={idTitulo} className={styles.titulo}>
              {vista === "resumen" ? ficha?.nombre ?? "Ficha del paciente" : TITULO_VISTA[vista]}
            </h3>
            {ficha && (
              <p className={styles.subtitulo}>
                {vista === "resumen" ? `${ficha.especie} · ${ficha.raza}` : ficha.nombre}
              </p>
            )}
          </div>
          <button type="button" className={styles.botonIcono} onClick={onCerrar} aria-label="Cerrar">
            <Iconos.cerrar size={20} />
          </button>
        </header>

        <div className={styles.cuerpo}>{contenido()}</div>

        {vista === "resumen" && ficha && (
          <footer className={styles.pie}>
            <Boton variante="secundario" icono={<Iconos.editar size={16} />} onClick={() => setVista("datos")}>
              Actualizar datos clínicos
            </Boton>
            {onRecetar && (
              <Boton variante="secundario" icono={<Iconos.receta size={16} />} onClick={() => onRecetar(ficha.id)}>
                Recetar
              </Boton>
            )}
            <Boton variante="secundario" icono={<Iconos.derivacion size={16} />} onClick={() => setVista("derivar")}>
              {TEXTOS_DERIVACION.derivar}
            </Boton>
            <Boton icono={<Iconos.agregar size={16} />} onClick={() => setVista("registro")}>
              Agregar registro
            </Boton>
          </footer>
        )}
      </div>
    </div>
  );
};
