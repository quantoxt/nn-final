import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
// import type { Database } from '~/types/database.types'

// type Category = Database['public']['Tables']['categories']['Row']

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
      
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    return categories || []
  } catch (err: unknown) {
    console.error('Error in categories API:', err)

    // 1. Check if it's an instance of Error
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: err.message
      })
    }

    // 2. Check if it's an object with message/code
    if (err !== null && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
      const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'

      throw createError({
        statusCode: 500,
        statusMessage: `${code}: ${message}`
      })
    }

    // 3. Fallback for primitives
    throw createError({
      statusCode: 500,
      statusMessage: `Unexpected error: ${String(err)}`
    })
  }
})