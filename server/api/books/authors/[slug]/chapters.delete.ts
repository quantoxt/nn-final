// server/api/books/authors/[slug]/chapters.delete.ts
import { defineEventHandler, getQuery, readBody, createError } from 'h3'
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

  // 3. Read and validate request body
  const body = await readBody(event)
  const { chapterIds } = body

  if (!Array.isArray(chapterIds) || chapterIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter IDs must be a non-empty array'
    })
  }

  // 4. Validate each chapter ID
  for (const id of chapterIds) {
    if (!id || typeof id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Each chapter ID must be a valid string'
      })
    }
  }

  try {
    const supabase = await serverSupabaseClient(event)

    // 5. Verify book ownership
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

    // 6. Verify all chapters belong to this book
    const { data: existingChapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .in('id', chapterIds)
      .eq('book_id', book.id)

    if (chaptersError || !existingChapters || existingChapters.length !== chapterIds.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'One or more chapters not found or not authorized'
      })
    }

    // 7. Delete the chapters
    const { error: deleteError } = await supabase
      .from('chapters')
      .delete()
      .in('id', chapterIds)

    if (deleteError) {
      console.error('Error deleting chapters:', deleteError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete chapters'
      })
    }

    // 8. Renumber remaining chapters
    const { data: remainingChapters, error: fetchChaptersError } = await supabase
      .from('chapters')
      .select('id, chapter_number')
      .eq('book_id', book.id)
      .order('chapter_number', { ascending: true })

    if (fetchChaptersError) {
      console.error('Error fetching remaining chapters:', fetchChaptersError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to renumber chapters'
      })
    }

    // Update chapter numbers
    for (let i = 0; i < remainingChapters.length; i++) {
      const chapter = remainingChapters[i]
      if (chapter.chapter_number !== i + 1) {
        await supabase
          .from('chapters')
          .update({ chapter_number: i + 1 })
          .eq('id', chapter.id)
      }
    }

    return {
      message: 'Chapters deleted successfully'
    }
  } catch (err: unknown) {
    console.error('Error in delete chapters API:', err)
    
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