import { useCallback, useMemo, useState } from "react";
import { getRefugiosAdmin } from "../Api/getInfo";
import { aprobarRefugioConInvitacion, verificarRefugio } from "../Api/postInfo";
import { CONFIRMACIONES, FILTROS_REFUGIOS_ADMIN_VACIOS, TEXTOS_POSTULACION_ADMIN as TP, TEXTOS_REFUGIOS_ADMIN as T } from "../constants";
import type { FiltrosRefugiosAdmin, RefugioAdmin } from "../interfaces";
import { valoresUnicos } from "../lib/publicacionesAdopcion";
import { filtrarRefugiosAdmin, kpisRefugios } from "../lib/refugios";
import { useAccion } from "./useAccion";
import { useConfirmar } from "./useConfirmar";
import { useConsulta } from "./useConsulta";
import { useToast } from "./useToast";

// "Refugios" del superadmin: la lista, los filtros, los números, el refugio
// abierto en el panel lateral, el modal de crear/editar y aprobar/rechazar.
// Una postulación hecha sin cuenta se aprueba con la invitación (edge function).
export const useRefugiosAdmin = () => {
  const [recarga, setRecarga] = useState(0);
  const recargar = useCallback(() => setRecarga((n) => n + 1), []);
  const consulta = useConsulta(getRefugiosAdmin, [recarga]);
  const lista = useMemo(() => consulta.datos ?? [], [consulta.datos]);

  const [filtros, setFiltros] = useState<FiltrosRefugiosAdmin>(FILTROS_REFUGIOS_ADMIN_VACIOS);
  const cambiarFiltros = useCallback((c: Partial<FiltrosRefugiosAdmin>) => setFiltros((f) => ({ ...f, ...c })), []);

  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  // undefined = modal cerrado; null = nuevo refugio; un refugio = editarlo
  const [enModal, setEnModal] = useState<RefugioAdmin | null | undefined>(undefined);

  const confirmar = useConfirmar();
  const accion = useAccion();
  const toast = useToast();

  const verificar = useCallback(
    async (r: RefugioAdmin, aprobar: boolean) => {
      if (!aprobar && !(await confirmar(CONFIRMACIONES.rechazarRefugio(r.nombre)))) return;
      const conInvitacion = aprobar && !!r.correoAcceso && !r.administradores.length;
      let aviso = "";
      const ok = await accion.ejecutar(async () => {
        if (!conInvitacion) return verificarRefugio(r.id, aprobar);
        const res = await aprobarRefugioConInvitacion(r.id);
        aviso = res.invitada ? TP.aprobadoInvitado(res.correo) : TP.aprobadoVinculado(res.correo);
      }, T.errorAccion);
      if (!ok) return;
      if (aviso) toast.mostrar(aviso);
      recargar();
    },
    [confirmar, accion, toast, recargar],
  );

  const porRevisar = useMemo(
    () => lista.filter((r) => r.estado === "pendiente" && (filtros.incluirPrueba || !r.esPrueba)),
    [lista, filtros.incluirPrueba],
  );

  return {
    lista,
    visibles: useMemo(() => filtrarRefugiosAdmin(lista, filtros), [lista, filtros]),
    kpis: useMemo(() => kpisRefugios(lista, filtros.incluirPrueba), [lista, filtros.incluirPrueba]),
    porRevisar,
    regiones: useMemo(() => valoresUnicos(lista.map((r) => r.region)), [lista]),
    filtros,
    cambiarFiltros,
    verPorRevisar: () => cambiarFiltros({ estado: "pendiente" }),
    seleccionado: lista.find((r) => r.id === seleccionadoId) ?? null,
    seleccionar: (r: RefugioAdmin | null) => setSeleccionadoId(r?.id ?? null),
    enModal,
    abrirNuevo: () => setEnModal(null),
    abrirEdicion: (r: RefugioAdmin) => setEnModal(r),
    cerrarModal: () => setEnModal(undefined),
    verificar,
    ocupado: accion.ocupado,
    errorAccion: accion.error,
    aviso: toast.mensaje,
    cargando: consulta.cargando,
    error: consulta.error,
    recargar,
  };
};
