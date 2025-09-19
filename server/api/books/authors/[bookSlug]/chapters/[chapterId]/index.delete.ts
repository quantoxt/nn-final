// server/api/books/authors/chapters/[id].delete.ts
import { defineEventHandler, createError } from 'h3'
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

  try {
    const supabase = await serverSupabaseClient(event)

    // 3. Verify chapter ownership
    const { data: chapter, error: fetchError } = await supabase
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

    if (fetchError || !chapter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chapter not found or not authorized'
      })
    }

    // 4. Delete the chapter
    const { error: deleteError } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId)

    if (deleteError) {
      console.error('Error deleting chapter:', deleteError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete chapter'
      })
    }

    // 5. Renumber remaining chapters
    const { data: remainingChapters, error: fetchChaptersError } = await supabase
      .from('chapters')
      .select('id, chapter_number')
      .eq('book_id', chapter.book_id)
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
      const ch = remainingChapters[i]
      if (ch.chapter_number !== i + 1) {
        await supabase
          .from('chapters')
          .update({ chapter_number: i + 1 })
          .eq('id', ch.id)
      }
    }

    return {
      message: 'Chapter deleted successfully'
    }
  } catch (err: unknown) {
    console.error('Error in delete chapter API:', err)
    
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