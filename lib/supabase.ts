// This file is kept for backward compatibility
// Please use lib/supabase/client.ts or lib/supabase/server.ts instead

export { createClient as createClientSupabase } from './supabase/client'

/**
 * ဝန်ထမ်း (Editor) ရဲ့ လက်ရှိ Session ကို ရယူရန် Utility Function
 * Note: This should be used in Server Components or API Routes
 */
export const getCurrentUser = async () => {
  try {
    const { createClient } = await import('./supabase/server')
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
