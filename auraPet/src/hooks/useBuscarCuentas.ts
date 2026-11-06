import { useState } from "react";
import { buscarCuentas } from "../Api/getInfo";
import { MS_BUSCAR_CUENTAS } from "../constants";
import { useConsulta } from "./useConsulta";
import { useValorDiferido } from "./useValorDiferido";

// Buscador de cuentas (superadmin): espera a que deje de escribir y consulta.
export const useBuscarCuentas = () => {
  const [texto, setTexto] = useState("");
  const diferido = useValorDiferido(texto.trim(), MS_BUSCAR_CUENTAS);
  const listo = diferido.length >= 2;
  const { datos, cargando } = useConsulta(() => (listo ? buscarCuentas(diferido) : Promise.resolve([])), [diferido]);
  const alDia = diferido === texto.trim();
  return {
    texto,
    setTexto,
    resultados: listo ? datos ?? [] : [],
    buscando: listo && (cargando || !alDia),
    sinResultados: listo && alDia && !cargando && !(datos ?? []).length,
    limpiar: () => setTexto(""),
  };
};
