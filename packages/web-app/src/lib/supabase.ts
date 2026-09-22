import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = String(env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = String(env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
