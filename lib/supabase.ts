import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase Client ကို Initialize လုပ်ခြင်း
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ဝန်ထမ်း (Editor) ရဲ့ လက်ရှိ Session ကို ရယူရန် Utility Function
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
};