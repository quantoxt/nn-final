import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. Get the authenticated user (auth handled by route middleware)
  const user = await serverSupabaseUser(event)

  // 2. Get the book slug from the URL
  const bookSlug = getRouterParam(event, 'bookSlug')
  if (!bookSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Book slug is required' })
  }

  // 3. Get the updated data from the request body
  const body = await readBody(event)

  // ✨ FIX: Remove categories field if present
  if (body.categories) {
    delete body.categories
  }

  try {
    // 4. Define allowed update fields
    const allowedUpdates: Record<string, unknown> = {}
    const fields = ['title', 'description', 'category_slug', 'status', 'slug', 'cover_image_url', 'label']

    for (const field of fields) {
      if (body[field] !== undefined) {
        allowedUpdates[field] = body[field]
      }
    }
    
    // Special handling for tropes
    if (typeof body.trope === 'string') {
        allowedUpdates.trope = body.trope.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    // Ensure there's something to update
    if (Object.keys(allowedUpdates).length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid fields provided for update' })
    }
    
    const supabase = await serverSupabaseClient(event)

    // 5. Perform the update query (simplified - no explicit auth check needed)
    const { data, error } = await supabase
      .from('books')
      .update(allowedUpdates)
      .eq('slug', bookSlug)
      .eq('author_id', user.id)  // ✅ Keep this for data integrity
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Book not found.', // ✅ Simplified message
        })
      }
      console.error('Error updating book:', error)
      throw new Error('Failed to update book')
    }

    return { message: 'Book updated successfully', book: data }
  } catch (err: unknown) {
    console.error('Error in update book API:', err)
    
    if (err instanceof Error && 'statusCode' in err) {
      throw err
    }
    
    if (err instanceof Error) {
      throw createError({ statusCode: 500, statusMessage: err.message })
    }

    if (err !== null && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
      throw createError({ statusCode: 500, statusMessage: message })
    }

    throw createError({ statusCode: 500, statusMessage: 'An unexpected server error occurred' })
  }
})