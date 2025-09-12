import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slug'
    })
  }
  
  const { data, error: fetchError } = await supabase
    .from('books')
    .select(`
      *,
      categories(name, slug)
    `)
    .eq('category_slug', slug)
    .order('created_at', { ascending: false })
  
  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: fetchError.message
    })
  }
  
  return data || []
})