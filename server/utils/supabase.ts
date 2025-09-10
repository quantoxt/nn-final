import { createServerClient } from '@supabase/ssr'
import { type H3Event, getCookie, setCookie, deleteCookie } from 'h3'
import type { CookieSerializeOptions } from 'cookie-es'

export const createSupabaseServerClient = (event: H3Event) => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabase.url
  const supabaseKey = config.public.supabase.key

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get: (name: string) => {
          return getCookie(event, name)
        },
        set: (name: string, value: string, options: CookieSerializeOptions) => {
          setCookie(event, name, value, options)
        },
        remove: (name: string) => {
          deleteCookie(event, name)
        },
      },
    }
  )
}