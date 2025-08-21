import {createClient} from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

export function createSupabaseClient(useServiceRole = false) {

    const supabaseKey = useServiceRole
        ? supabaseServiceRoleKey!
        : supabaseAnonKey;

    return createClient(supabaseUrl, supabaseKey);
}

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

