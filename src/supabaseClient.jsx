import { createClient } from '@supabase/supabase-js';

console.log(import.meta.env.VITE_SUPABASE_URL)

export const supabase = createClient(
    process.env.supabase_url,
    process.env.supabase_anon_key
  );