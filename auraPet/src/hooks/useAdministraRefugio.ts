import { useMisRefugios } from "./useMisRefugios";

// ¿La persona conectada administra algún refugio? (para mostrar "Mi refugio" en su menú)
export const useAdministraRefugio = () => useMisRefugios().length > 0;
