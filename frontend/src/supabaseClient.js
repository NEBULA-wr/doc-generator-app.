// Asegúrate de que esta línea esté al principio del todo
import { createClient } from '@supabase/supabase-js';

// Lee las variables desde el archivo .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Comprobación para asegurarnos de que las variables existen
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Anon Key is missing from .env file");
}

// Crea y exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);