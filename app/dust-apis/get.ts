// server/api/books/[slug]/get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
//import type { Database } from '~/types/database.types'

//type Book = Database['public']['Tables']['books']['Row']

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Get book slug from route
  const bookSlug = event.context.params?.slug
  if (!bookSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required'
    })
  }

  try {
    // Fetch single book with related data
    const { data: book, error } = await supabase
      .from('books')
      .select(`
        *,
        categories(name, slug),
        profiles:author_id(username, avatar_url)
      `)
      .eq('slug', bookSlug)
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch book: ${error.message}`
      })
    }

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found'
      })
    }

    return book
  } catch (err: unknown) {
    console.error('Error in book API:', err)

    // Full unknown error handling
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