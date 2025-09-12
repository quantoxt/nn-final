import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  try {
    // Fetch all books with all columns and related data
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        categories(name, slug),
        profiles:author_id(username, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch books: ${error.message}`
      })
    }

    return data || []
  } catch (err) {
    console.error('Error in books API:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})