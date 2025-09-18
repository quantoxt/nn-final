import { defineEventHandler, createError, getRouterParam } from 'h3'
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
  const bookSlug = getRouterParam(event, 'slug')
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
    
    if (booksCheck && booksCheck.length > 1) {
      console.error('Multiple books found with the same slug:', booksCheck)
      throw createError({
        statusCode: 500,
        statusMessage: 'Multiple books found with the same slug'
      })
    }
    
    // 4. Now fetch the specific book owned by the user
    // ✨ ADDED chapters(count) to the select query
    const { data: book, error } = await supabase
      .from('books')
      .select(`
        *,
        categories(name, slug),
        profiles:author_id(username, avatar_url),
        chapters(count) 
      `)
      .eq('slug', bookSlug)
      .eq('author_id', user.id)
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
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

    // ✨ ADDED: Process the chapter count and format the response
    // Supabase returns the count as an array of objects, like [{ count: 5 }]
    const chapterCount = Array.isArray(book.chapters) && book.chapters.length > 0 ? book.chapters[0].count : 0;

    // Create a cleaner response object
    const responseData = {
      ...book,
      chapter_count: chapterCount
    };

    // Remove the original chapters array to avoid confusion
    delete (responseData as any).chapters;

    return responseData

  } catch (err: unknown) {
    console.error('Error in authors book API:', err)
    
    if (err instanceof Error) {
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
