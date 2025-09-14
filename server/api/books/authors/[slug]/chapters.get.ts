// server/api/books/authors/[slug]/chapters.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. Get user from session
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // 2. Get book slug from route
  const bookSlug = getQuery(event).slug as string
  if (!bookSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required'
    })
  }

  try {
    const supabase = await serverSupabaseClient(event)

    // 3. Verify the book exists and belongs to the user
    const { data: book, error: bookError } = await supabase
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

    // 4. Fetch all chapters for the book
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select(`
        id,
        chapter_number,
        chapter_title,
        coin_cost,
        is_locked,
        created_at,
        updated_at,
        word_count
      `)
      .eq('book_id', book.id)
      .order('chapter_number', { ascending: true })

    if (chaptersError) {
      console.error('Error fetching chapters:', chaptersError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch chapters'
      })
    }

    return {
      chapters: chapters || [],
      bookId: book.id
    }
  } catch (err: unknown) {
    console.error('Error in chapters API:', err)
    
    // Handle Error instances
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: err.message
      })
    }
    
    // Handle object-like errors
    if (err !== null && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
      const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
      throw createError({
        statusCode: 500,
        statusMessage: `${code}: ${message}`
      })
    }
    
    // Fallback for non-object errors
    throw createError({
      statusCode: 500,
      statusMessage: `Unexpected error: ${String(err)}`
    })
  }
})