import { createClient } from '@supabase/supabase-js'

// Both values come from .env (see .env.example). The publishable key is meant for
// browser code; never put the secret key in this project.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** False until both values are filled in. The page still works, but Save loan cannot reach the database. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null
