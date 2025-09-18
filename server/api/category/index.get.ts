import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch categories: ${error.message}`
      })
    }

    return data || []
  } catch (err) {
    console.error('Error in categories API:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
