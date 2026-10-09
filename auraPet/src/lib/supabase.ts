import { createClient } from "@supabase/supabase-js";
// Tipos generados desde la base (npm run gen:types en auraPet-Backend).
// Le dicen a TypeScript qué tablas, columnas y funciones existen.
import type { Database } from "./database.types";

// tenemos que poner en el repo la variable de entorno que contiene la url de la base de datos y su clave
// ésta se ignora en el gitignore por obvias razones de seguridad, por ende es importante tenerla a mano :p

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env.local. " +
      "Si acabas de crearlo, reinicia `npm run dev`."
  );
}

export const supabase = createClient<Database>(url, publishableKey);
