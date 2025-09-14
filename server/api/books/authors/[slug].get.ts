// server/api/books/authors/[slug].get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

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
    
    // 3. First, let's check if there are multiple books with this slug
    const { data: booksCheck, error: checkError } = await supabase
      .from('books')
      .select('id, slug, author_id')
      .eq('slug', bookSlug)
    
    if (checkError) {
      console.error('Error checking books:', checkError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to check books: ${checkError.message}`
      })
    }
    
    console.log('Books check result:', booksCheck)
    
    // If we found multiple books with the same slug, that's a problem
    if (booksCheck && booksCheck.length > 1) {
      console.error('Multiple books found with the same slug:', booksCheck)
      throw createError({
        statusCode: 500,
        statusMessage: 'Multiple books found with the same slug'
      })
    }
    
    // 4. Now fetch the specific book owned by the user
    const { data: book, error } = await supabase
      .from('books')
      .select(`
        *,
        categories(name, slug),
        profiles:author_id(username, avatar_url)
      `)
      .eq('slug', bookSlug)
      .eq('author_id', user.id)
      .single()
    
    // 5. Handle the specific error for no rows returned
    if (error) {
      console.error('Supabase error:', error)
      
      // PGRST116 is the code for "no rows returned"
      if (error.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Book not found or not authorized'
        })
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch book: ${error.message}`
      })
    }
    
    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found or not authorized'
      })
    }
    
    return book
  } catch (err: unknown) {
    console.error('Error in authors book API:', err)
    
    // 6. Full unknown error handling
    if (err instanceof Error) {
      // Check if this is already a createError (has statusCode)
      if ('statusCode' in err) {
        throw err
      }
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