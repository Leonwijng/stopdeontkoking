import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

// Tijdelijke debug log
console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'MISSING')
console.log('Supabase Key:', supabaseAnonKey ? 'Loaded' : 'MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase credentials are missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
  )
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
