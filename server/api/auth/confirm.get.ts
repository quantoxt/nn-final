import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie, sendRedirect, H3Event } from 'h3'
import type { CookieSerializeOptions } from 'cookie-es'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token_hash = query.token_hash as string
  const type = query.type as string
  const next = query.next as string || '/'
  
  if (!token_hash || !type) {
    return sendRedirect(event, `/auth/error?error=No token hash or type`)
  }
  
  // Create Supabase server client
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get: (name: string) => getCookie(event, name),
        set: (name: string, value: string, options: CookieSerializeOptions) => setCookie(event, name, value, options),
        remove: (name: string) => deleteCookie(event, name),
      },
    }
  )
  
  try {
    const { error } = await supabase.auth.verifyOtp({ 
        token_hash,
        type: 'email'
    })
    
    if (error) {
      return sendRedirect(event, `/auth/error?error=${encodeURIComponent(error.message)}`)
    }
    
    // Successful verification - redirect to next URL
    return sendRedirect(event, next)
  } catch (err) {
    console.error('Confirmation error:', err)
    return sendRedirect(event, `/auth/error?error=${encodeURIComponent('An unexpected error occurred')}`)
  }
})