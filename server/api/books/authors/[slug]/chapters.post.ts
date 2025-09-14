// server/api/books/authors/[slug]/chapters.post.ts
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
  const { chapter_title, content, coin_cost = 0, is_locked = false } = body

  // 4. Validate required fields
  if (!chapter_title || typeof chapter_title !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter title is required'
    })
  }

  if (!content || typeof content !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter content is required'
    })
  }

  if (typeof coin_cost !== 'number' || coin_cost < 0 || coin_cost > 10) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin cost must be a number between 0 and 10'
    })
  }

  try {
    const supabase = await serverSupabaseClient(event)

    // 5. Verify book ownership and get next chapter number
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

    // 6. Get the next chapter number
    const { data: lastChapter } = await supabase
      .from('chapters')
      .select('chapter_number')
      .eq('book_id', book.id)
      .order('chapter_number', { ascending: false })
      .limit(1)
      .single()

    const nextChapterNumber = lastChapter ? lastChapter.chapter_number + 1 : 1

    // 7. Calculate word count
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length

    // 8. Create the chapter
    const { data: chapter, error: createError } = await supabase
      .from('chapters')
      .insert({
        book_id: book.id,
        chapter_number: nextChapterNumber,
        chapter_title,
        content,
        coin_cost,
        is_locked,
        word_count: wordCount
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating chapter:', createError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create chapter'
      })
    }

    return {
      message: 'Chapter created successfully',
      chapter
    }
  } catch (err: unknown) {
    console.error('Error in create chapter API:', err)
    
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