// server/api/authors/[slug]/chapters.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
// import type { Database } from '~/types/database.types'
// type Chapter = Database['public']['Tables']['chapters']['Row']

export default defineEventHandler(async (event) => {
  // 1. Get user from server session
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // 2. Get book slug from route
  const bookSlug = event.context.params?.slug
  if (!bookSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required'
    })
  }

  try {
    const supabase = await serverSupabaseClient(event)

    // 3. Fetch book to verify ownership
    const {  data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('slug', bookSlug)
      .eq('author_id', user.id)
      .single()

    if (bookError || !book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found or not authorized'
      })
    }

    // 4. Fetch chapters
    const {  data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', book.id)
      .order('chapter_number', { ascending: true })

    if (chaptersError) {
      throw createError({
        statusCode: 500,
        statusMessage: chaptersError.message
      })
    }

    return chapters || []
  } catch (err: unknown) {
    console.error('Error in authors chapters API:', err)

    // 5. Full unknown error handling
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