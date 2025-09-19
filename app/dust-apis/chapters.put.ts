// server/api/books/authors/[slug]/chapters.put.ts
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
  const { chapters } = body

  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapters must be a non-empty array'
    })
  }

  // 4. Validate each chapter
  for (const chapter of chapters) {
    if (!chapter.id || typeof chapter.id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Each chapter must have a valid ID'
      })
    }
    if (typeof chapter.chapter_number !== 'number' || chapter.chapter_number < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chapter number must be a positive number'
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
    const chapterIds = chapters.map(chapter => chapter.id)
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

    // 7. Update chapter numbers in bulk
    const updatePromises = chapters.map(chapter => 
      supabase
        .from('chapters')
        .update({ 
          chapter_number: chapter.chapter_number,
          chapter_title: chapter.chapter_title,
          coin_cost: chapter.coin_cost,
          is_locked: chapter.is_locked
        })
        .eq('id', chapter.id)
    )

    await Promise.all(updatePromises)

    return {
      message: 'Chapters updated successfully'
    }
  } catch (err: unknown) {
    console.error('Error in update chapters API:', err)
    
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