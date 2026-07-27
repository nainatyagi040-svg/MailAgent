import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

const hasValidConfig = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && supabaseUrl !== 'your_supabase_project_url';

if (!hasValidConfig) {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '<div style="padding: 2rem; color: red; font-family: sans-serif; text-align: center; margin-top: 20vh;"><h1>Missing Supabase configuration — check your .env file</h1><p>Please add your real Supabase Project URL and Anon Key to the .env file.</p></div>';
  }
  throw new Error("Missing Supabase configuration — check your .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
