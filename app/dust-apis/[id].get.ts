// server/api/books/authors/chapters/[id].get.ts
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

    // 3. Fetch chapter with book ownership verification
    const { data: chapter, error } = await supabase
      .from('chapters')
      .select(`
        *,
        books!inner(
          id,
          slug,
          author_id
        )
      `)
      .eq('id', chapterId)
      .eq('books.author_id', user.id)
      .single()

    if (error || !chapter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chapter not found or not authorized'
      })
    }

    return chapter
  } catch (err: unknown) {
    console.error('Error in chapter API:', err)
    
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