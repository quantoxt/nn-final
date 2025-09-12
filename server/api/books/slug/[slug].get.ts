import { serverSupabaseClient } from '#supabase/server'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const bookSlug = event.context.params?.slug
  const { category: categorySlug } = getQuery(event)

  if (!bookSlug || !categorySlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book and category slugs are required'
    })
  }

  try {
    // 1. Fetch the category to validate it
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('slug')
      .eq('slug', categorySlug)
      .single()

    if (categoryError || !category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // 2. Fetch the book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select(`
        *,
        categories(name, slug),
        profiles:author_id(username, avatar_url)
      `)
      .eq('slug', bookSlug)
      .single()

    if (bookError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch book: ${bookError.message}`
      })
    }

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found'
      })
    }

    // 3. Validate that the book belongs to the category
    if (book.category_slug !== categorySlug) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found in this category'
      })
    }

    return book
  } catch (err) {
    console.error('Error in book API:', err)
    // Check if the error is a PostgrestError and handle it
    if (err.code) {
      throw createError({
        statusCode: parseInt(err.code),
        statusMessage: err.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
