import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Book slug is required'
    })
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, categories(name, slug), profiles(username, avatar_url)')
      .eq('slug', slug)
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch book: ${error.message}`
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found'
      })
    }

    return data
  } catch (err) {
    console.error('Error in /api/books/[slug].get.ts:', err)
    throw err
  }
})
