import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://ozllpnfyrsqwoszsnmvl.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2kTJCIXUfuLpYvzca2Lz7Q_BgfuCWvN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
