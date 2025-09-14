// server/api/authors/books.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
// import type { Database } from '~/types/database.types'
// type Book = Database['public']['Tables']['books']['Row']

export default defineEventHandler(async (event) => {
  // 1. Get user from server session
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const supabase = await serverSupabaseClient(event)
    

    // 2. Fetch all books where author_id = user.id
    const {  data: books, error } = await supabase
      .from('books')
      .select(`
        *,
        categories(name, slug),
        profiles:author_id(username, avatar_url)
      `)
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch books: ${error.message}`
      })
    }

    return books || []
  } catch (err: unknown) {
    console.error('Error in authors books API:', err)

    // 3. Full unknown error handling
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