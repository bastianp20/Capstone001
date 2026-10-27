import { ESTADO_DERIVACION_LABEL, SEXO_LABEL, TEXTO_SIN_REGISTRAR, TEXTOS_FICHA_PDF as T, TIPO_REGISTRO_LABEL } from '@/constants/constants';
import type { FichaPdfCruda } from '@/interfaces';

import { aFechaDia, edadDesde, formatFechaLarga, hoy } from './fechas';
import { formatearPeso } from './formatos';
import { capitalizar } from './texto';

// Arma el HTML de la ficha clínica a partir de ficha_pdf (migración 34).
// expo-print lo convierte en PDF. Los colores son los de la marca.

const escapar = (texto: string | null | undefined): string =>
  (texto ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const o = (texto: string | null | undefined) => escapar(texto || TEXTO_SIN_REGISTRAR);

const dato = (etiqueta: string, valor: string | null | undefined) =>
  `<div class="dato"><span>${escapar(etiqueta)}</span><strong>${o(valor)}</strong></div>`;

const ESTILOS = `
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1A1F27; margin: 32px; font-size: 12px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0F8F80; padding-bottom: 12px; }
  h1 { margin: 0; font-size: 22px; color: #0F8F80; }
  h2 { font-size: 14px; color: #0B7266; margin: 22px 0 8px; text-transform: uppercase; letter-spacing: .5px; }
  .marca { font-weight: 800; font-size: 18px; color: #0F8F80; }
  .gris { color: #6B7280; }
  .grilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .dato { background: #F7FAF9; border-radius: 8px; padding: 8px 10px; }
  .dato span { display: block; color: #6B7280; font-size: 10px; margin-bottom: 2px; }
  .alerta { background: #FFF1D6; border-radius: 8px; padding: 8px 10px; margin-top: 8px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; background: #DDF3EE; color: #0B7266; font-size: 10px; padding: 6px 8px; }
  td { border-bottom: 1px solid #E7ECEB; padding: 6px 8px; vertical-align: top; }
  .receta { border: 1px solid #E7ECEB; border-radius: 8px; padding: 10px; margin-bottom: 8px; }
  footer { margin-top: 28px; font-size: 10px; color: #6B7280; text-align: center; }
`;

export const armarHtmlFicha = (f: FichaPdfCruda): string => {
  const m = f.mascota;
  const edad = edadDesde(m.fecha_nacimiento);
  const nacimiento = m.fecha_nacimiento ? `${formatFechaLarga(m.fecha_nacimiento)}${edad ? ` (${edad})` : ''}` : null;

  const alertas = [
    m.alergias ? `<div class="alerta"><strong>${T.alergias}:</strong> ${escapar(m.alergias)}</div>` : '',
    m.condiciones_cronicas ? `<div class="alerta"><strong>${T.condiciones}:</strong> ${escapar(m.condiciones_cronicas)}</div>` : '',
  ].join('');

  const historial = f.historial.length
    ? `<table><tr><th>${T.fecha}</th><th>${T.tipo}</th><th>${T.descripcion}</th><th>${T.atendio}</th></tr>${f.historial
        .map(
          (r) => `<tr>
            <td>${formatFechaLarga(r.fecha)}</td>
            <td>${TIPO_REGISTRO_LABEL[r.tipo]}</td>
            <td>${escapar(r.descripcion)}${r.tratamiento ? `<br><span class="gris">${escapar(r.tratamiento)}</span>` : ''}${
              r.proxima_dosis ? `<br><span class="gris">${T.proximaDosis}: ${formatFechaLarga(r.proxima_dosis)}</span>` : ''
            }</td>
            <td>${o(r.veterinario)}${r.centro ? `<br><span class="gris">${escapar(r.centro)}</span>` : ''}</td>
          </tr>`,
        )
        .join('')}</table>`
    : `<p class="gris">${T.sinRegistros}</p>`;

  const recetas = f.recetas.length
    ? f.recetas
        .map(
          (r) => `<div class="receta">
            <strong>${formatFechaLarga(r.fecha.slice(0, 10))}</strong> · ${o(r.veterinario)}${r.colegiado ? ` (N° ${escapar(r.colegiado)})` : ''}
            <ul>${r.medicamentos
              .map((md) => `<li><strong>${escapar(md.nombre)}</strong> — ${escapar(md.dosis)}, ${escapar(md.frecuencia)}, ${escapar(md.duracion)}</li>`)
              .join('')}</ul>
            ${r.indicaciones ? `<div><span class="gris">${T.indicaciones}:</span> ${escapar(r.indicaciones)}</div>` : ''}
            ${r.proximo_control ? `<div><span class="gris">${T.proximoControl}:</span> ${formatFechaLarga(r.proximo_control)}</div>` : ''}
          </div>`,
        )
        .join('')
    : `<p class="gris">${T.sinRegistros}</p>`;

  const derivaciones = f.derivaciones.length
    ? `<table>${f.derivaciones
        .map(
          (d) => `<tr><td>${formatFechaLarga(d.fecha.slice(0, 10))}</td><td>${o(d.origen)} → ${o(d.destino)}</td>
            <td>${escapar(d.motivo)}${d.resultado ? `<br><span class="gris">${escapar(d.resultado)}</span>` : ''}</td>
            <td>${ESTADO_DERIVACION_LABEL[d.estado]}</td></tr>`,
        )
        .join('')}</table>`
    : `<p class="gris">${T.sinRegistros}</p>`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>${ESTILOS}</style></head><body>
    <header>
      <div><div class="marca">AuraPet</div><h1>${T.titulo} · ${escapar(m.nombre)}</h1></div>
      <div class="gris">#${String(m.id).padStart(6, '0')}<br>${T.emitida} ${formatFechaLarga(hoy())}</div>
    </header>
    <h2>${T.paciente}</h2>
    <div class="grilla">
      ${dato(T.especie, capitalizar(m.especie))}
      ${dato(T.raza, m.raza)}
      ${dato(T.sexo, SEXO_LABEL[m.sexo])}
      ${dato(T.nacimiento, nacimiento)}
      ${dato(T.peso, m.peso_kg !== null ? formatearPeso(m.peso_kg) : null)}
      ${dato(T.esterilizado, m.esterilizado ? 'Sí' : 'No')}
      ${dato(T.microchip, m.microchip)}
      ${dato(T.tutor, f.tutor.nombre)}
      ${dato(T.telefono, f.tutor.telefono ? `+${f.tutor.telefono}` : null)}
    </div>
    ${alertas}
    <h2>${T.historial}</h2>${historial}
    <h2>${T.recetas}</h2>${recetas}
    <h2>${T.derivaciones}</h2>${derivaciones}
    <footer>${T.pie} · ${aFechaDia(new Date())}</footer>
  </body></html>`;
};
