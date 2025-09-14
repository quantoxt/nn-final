import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug as string
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = await serverSupabaseClient(event)

  // 👇 Read and validate input
  const body = await readBody(event)
  const { title, description, cover_image_url, category_slug, trope, label, slug: newSlug, status, published_at, rating, saves } = body

  // 👇 Required field validation
  if (!title || typeof title !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Title is required and must be a string' })
  }

  // 👇 Validate slug is string or null/undefined
  if (newSlug !== undefined && newSlug !== null && typeof newSlug !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Slug must be a string or null/undefined' })
  }

  // 👇 Validate trope is string or null/undefined (prevents PostgreSQL type errors)
  if (trope !== undefined && trope !== null && typeof trope !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Trope must be a comma-separated string or null/undefined'
    })
  }

  // 👇 Find book owned by user
  const { data: book, error: fetchErr } = await supabase
    .from('books')
    .select('id')
    .eq('slug', slug)
    .eq('author_id', user.id)
    .single()

  if (fetchErr || !book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found or not owned' })
  }

  // 👇 Prepare update data with proper handling for each field
  const updateData: any = {
    title,
    description: description ?? null,
    cover_image_url: cover_image_url ?? null,
    category_slug: category_slug ?? null,
    trope: trope ? trope.split(',').map(t => t.trim()).filter(Boolean) : null, // 👈 Safe array conversion
    label: label ?? null,
    status: status ?? 'draft', // 👈 Default to 'draft' if not provided
    published_at: published_at ?? null,
    rating: rating ?? 0,
    saves: saves ?? 0,
  }

  // Only update slug if it's provided and different
  if (newSlug && newSlug !== slug) {
    updateData.slug = newSlug
  }

  console.log('Updating book with data:', updateData)

  // 👇 Update the book
  const { data: updatedBook, error: updateErr } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', book.id)
    .select()
    .single()

  if (updateErr) {
    console.error('Update error:', updateErr)
    if (updateErr instanceof Error) {
      throw createError({ statusCode: 500, statusMessage: updateErr.message })
    }
    if (updateErr !== null && typeof updateErr === 'object' && 'message' in updateErr) {
      throw createError({
        statusCode: 500,
        statusMessage: updateErr as string
      })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to update book' })
  }

  // 👇 Return updated book + success message
  return {
    message: 'Book updated successfully',
    book: updatedBook
  }
})
