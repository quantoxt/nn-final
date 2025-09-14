// server/api/books/authors/chapters/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3'
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

  // 2. Get chapter ID from route
  const chapterId = event.context.params?.id as string
  if (!chapterId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter ID is required'
    })
  }

  // 3. Read and validate request body
  const body = await readBody(event)
  const { chapter_title, content, coin_cost, is_locked, chapter_number } = body

  // 4. Validate fields
  if (chapter_title !== undefined && (typeof chapter_title !== 'string' || !chapter_title.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter title must be a non-empty string'
    })
  }

  if (content !== undefined && (typeof content !== 'string' || !content.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter content must be a non-empty string'
    })
  }

  if (coin_cost !== undefined && (typeof coin_cost !== 'number' || coin_cost < 0 || coin_cost > 10)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin cost must be a number between 0 and 10'
    })
  }

  if (chapter_number !== undefined && (typeof chapter_number !== 'number' || chapter_number < 1)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chapter number must be a positive number'
    })
  }

  try {
    const supabase = await serverSupabaseClient(event)

    // 5. Verify chapter ownership
    const { data: existingChapter, error: fetchError } = await supabase
      .from('chapters')
      .select(`
        id,
        book_id,
        books!inner(
          author_id
        )
      `)
      .eq('id', chapterId)
      .eq('books.author_id', user.id)
      .single()

    if (fetchError || !existingChapter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chapter not found or not authorized'
      })
    }

    // 6. Prepare update data
    const updateData: any = {}
    
    if (chapter_title !== undefined) updateData.chapter_title = chapter_title
    if (content !== undefined) {
      updateData.content = content
      updateData.word_count = content.trim().split(/\s+/).filter(word => word.length > 0).length
    }
    if (coin_cost !== undefined) updateData.coin_cost = coin_cost
    if (is_locked !== undefined) updateData.is_locked = is_locked
    if (chapter_number !== undefined) updateData.chapter_number = chapter_number

    // 7. Update the chapter
    const { data: chapter, error: updateError } = await supabase
      .from('chapters')
      .update(updateData)
      .eq('id', chapterId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating chapter:', updateError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update chapter'
      })
    }

    return {
      message: 'Chapter updated successfully',
      chapter
    }
  } catch (err: unknown) {
    console.error('Error in update chapter API:', err)
    
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