import { createClient } from '@supabase/supabase-js';

console.log("Attempting to load Supabase keys...");
console.log("URL from env:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Anon Key from env:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey!);