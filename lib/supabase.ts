import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ptrdrgetdfavyxucqazj.supabase.co';
const supabaseAnonKey = 'sb_publishable_ubneT3S5U4khidmHdvuv4A_qBHAN6CQ';

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
