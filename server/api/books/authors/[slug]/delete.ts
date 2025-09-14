// server/api/books/authors/[slug]/book.delete.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug as string
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  // 👇 Authenticate user via Supabase session
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // 👇 Get the Supabase client and await it
  const supabase = await serverSupabaseClient(event)

  // 👇 Find the book owned by this user
  const { data: book, error: fetchErr } = await supabase
    .from('books')
    .select('id')
    .eq('slug', slug)
    .eq('author_id', user.id)
    .single()

  if (fetchErr) {
    // Handle unknown error structure
    if (fetchErr instanceof Error) {
      if (fetchErr.message.includes('Not found')) {
        throw createError({ statusCode: 404, statusMessage: 'Book not found or not owned' })
      }
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch book' })
    }

    if (fetchErr !== null && typeof fetchErr === 'object') {
      const errObj = fetchErr as Record<string, unknown>
      const code = errObj.code as string | undefined
      const message = errObj.message as string | undefined

      if (code === 'PGRST116' || message?.includes('not found')) {
        throw createError({ statusCode: 404, statusMessage: 'Book not found or not owned' })
      }
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch book' })
    }

    throw createError({ statusCode: 500, statusMessage: 'Unknown error during book lookup' })
  }

  if (!book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found or not owned' })
  }

  // 👇 Delete the book
  const { error: deleteErr } = await supabase
    .from('books')
    .delete()
    .eq('id', book.id)

  if (deleteErr) {
    if (deleteErr instanceof Error) {
      throw createError({ statusCode: 500, statusMessage: deleteErr.message })
    }

    if (deleteErr !== null && typeof deleteErr === 'object') {
      const errObj = deleteErr as Record<string, unknown>
      const message = errObj.message as string | undefined
      const code = errObj.code as string | undefined

      throw createError({
        statusCode: 500,
        statusMessage: message || `Delete failed (code: ${code})`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Unexpected error during deletion: ${String(deleteErr)}`
    })
  }

  return { message: 'Book deleted successfully' }
})