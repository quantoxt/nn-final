import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  
  try {
    // ✨ OPTIMIZED: Only select the columns we actually need
    const { data: categories, error } = await supabase
      .from('categories')
      .select('slug, name') 
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

    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: err.message
      })
    }

    if (err !== null && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
      const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'

      throw createError({
        statusCode: 500,
        statusMessage: `${code}: ${message}`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Unexpected error: ${String(err)}`
    })
  }
})
