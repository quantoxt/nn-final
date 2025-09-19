import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Book slug is required'
    })
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, categories(name, slug), profiles(id, username, avatar_url)')
      .eq('slug', slug)
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch book: ${error.message}`
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found'
      })
    }

    // Fetch chapters for this book
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select(`
        id, 
        chapter_number, 
        chapter_title, 
        content,
        is_locked, 
        coin_cost, 
        created_at, 
        updated_at, 
        word_count,
        book_id
      `)
      .eq('book_id', data.id)
      .order('chapter_number', { ascending: true })

    if (chaptersError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch chapters: ${chaptersError.message}`
      })
    }

    // Return book with chapters
    return {
      ...data,
      chapters: chapters || []
    }
  } catch (err) {
    console.error('Error in /api/books/[slug]/index.get.ts:', err)
    throw err
  }
})