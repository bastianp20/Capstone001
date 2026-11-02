import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { CALIDAD_RECORTE, ZOOM_RECORTE } from "../constants";
import type { FormatoRecorte } from "../interfaces";

interface Tamano {
  ancho: number;
  alto: number;
}

const limitar = (valor: number, maximo: number) => Math.max(-maximo, Math.min(maximo, valor));

// Recortar una imagen: zoom, arrastrar para encuadrar y exportar el resultado.
// La imagen siempre cubre el marco completo (no quedan bordes vacíos).
export const useRecortador = (url: string, formato: FormatoRecorte) => {
  const marco = useRef<HTMLDivElement>(null);
  const imagen = useRef<HTMLImageElement | null>(null);
  const arrastre = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [natural, setNatural] = useState<Tamano | null>(null);
  const [tamanoMarco, setTamanoMarco] = useState<Tamano>({ ancho: 0, alto: 0 });
  const [zoom, setZoom] = useState<number>(ZOOM_RECORTE.minimo);
  const [desplazamiento, setDesplazamiento] = useState({ x: 0, y: 0 });

  // Carga la imagen para conocer su tamaño real
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imagen.current = img;
      setNatural({ ancho: img.naturalWidth, alto: img.naturalHeight });
    };
    img.src = url;
  }, [url]);

  // El marco se adapta al ancho disponible (celular o escritorio)
  useEffect(() => {
    const el = marco.current;
    if (!el) return;
    const observador = new ResizeObserver(([e]) => setTamanoMarco({ ancho: e.contentRect.width, alto: e.contentRect.height }));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // Escala para que la imagen cubra el marco, por el zoom elegido
  const escala = natural && tamanoMarco.ancho
    ? Math.max(tamanoMarco.ancho / natural.ancho, tamanoMarco.alto / natural.alto) * zoom
    : 0;
  const maxX = natural ? Math.max(0, (natural.ancho * escala - tamanoMarco.ancho) / 2) : 0;
  const maxY = natural ? Math.max(0, (natural.alto * escala - tamanoMarco.alto) / 2) : 0;
  const x = limitar(desplazamiento.x, maxX);
  const y = limitar(desplazamiento.y, maxY);
  const izquierda = natural ? tamanoMarco.ancho / 2 - (natural.ancho * escala) / 2 + x : 0;
  const arriba = natural ? tamanoMarco.alto / 2 - (natural.alto * escala) / 2 + y : 0;

  const alPresionar = useCallback((e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastre.current = { x: e.clientX, y: e.clientY, ox: x, oy: y };
  }, [x, y]);
  const alMover = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const a = arrastre.current;
    if (a) setDesplazamiento({ x: a.ox + e.clientX - a.x, y: a.oy + e.clientY - a.y });
  }, []);
  const alSoltar = useCallback(() => {
    arrastre.current = null;
  }, []);
  const alRueda = useCallback((e: WheelEvent<HTMLDivElement>) => {
    setZoom((z) => Math.max(ZOOM_RECORTE.minimo, Math.min(ZOOM_RECORTE.maximo, z - e.deltaY * ZOOM_RECORTE.rueda)));
  }, []);

  const restablecer = useCallback(() => {
    setZoom(ZOOM_RECORTE.minimo);
    setDesplazamiento({ x: 0, y: 0 });
  }, []);

  // Dibuja lo que se ve en el marco en un archivo del tamaño de salida
  const exportar = useCallback(
    () =>
      new Promise<File>((resolver, rechazar) => {
        const img = imagen.current;
        if (!img || !escala) return rechazar(new Error("La imagen aún no carga"));
        const lienzo = document.createElement("canvas");
        lienzo.width = formato.salida.ancho;
        lienzo.height = formato.salida.alto;
        const ctx = lienzo.getContext("2d");
        if (!ctx) return rechazar(new Error("No se pudo preparar la imagen"));
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, -izquierda / escala, -arriba / escala, tamanoMarco.ancho / escala, tamanoMarco.alto / escala, 0, 0, lienzo.width, lienzo.height);
        lienzo.toBlob(
          (blob) => (blob ? resolver(new File([blob], `recorte-${Date.now()}.jpg`, { type: "image/jpeg" })) : rechazar(new Error("No se pudo preparar la imagen"))),
          "image/jpeg",
          CALIDAD_RECORTE,
        );
      }),
    [escala, izquierda, arriba, tamanoMarco, formato.salida],
  );

  return {
    marco,
    cargada: !!natural,
    zoom,
    setZoom,
    estiloImagen: natural ? { width: natural.ancho * escala, height: natural.alto * escala, left: izquierda, top: arriba } : undefined,
    eventos: { onPointerDown: alPresionar, onPointerMove: alMover, onPointerUp: alSoltar, onPointerCancel: alSoltar, onWheel: alRueda },
    restablecer,
    exportar,
  };
};
