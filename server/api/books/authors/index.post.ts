import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  try {
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Read body
    const body = await readBody(event)

    // Validate slug FIRST
    if (!body.slug || typeof body.slug !== 'string' || body.slug.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug is required and must be a non-empty string'
      })
    }

    // Destructure AFTER validation
    const {
      title,
      slug,
      trope,
      description,
      cover_image_url,
      category_slug,
      status,
      chapter
    } = body

    // Validate book fields
    if (!title || !category_slug || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required book fields: title, category_slug, status'
      })
    }

    // Validate status
    if (status !== 'draft' && status !== 'pending_review') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid status. Only "draft" or "pending_review" allowed.'
      })
    }

    if (!trope || typeof trope !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Trope is required and must be a string'
      })
    }

    // Validate chapter fields
    if (!chapter?.chapter_title || !chapter?.chapter_number || !chapter?.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required chapter fields: chapter_title, chapter_number, content'
      })
    }

    // Split trope string into array
    const tropeArray = trope
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '')

    // Validate at least one trope
    if (tropeArray.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one trope is required'
      })
    }

    // Insert book
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .insert([
        {
          title,
          slug: slug.trim(),
          description,
          cover_image_url,
          category_slug,
          trope: tropeArray,
          status,
          author_id: user.id
        }
      ])
      .select()
      .single()

    if (bookError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create book: ${bookError.message}`
      })
    }

    // Insert chapter
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .insert([
        {
          book_id: bookData.id, // ✅ FK to books table
          chapter_number: chapter.chapter_number,
          chapter_title: chapter.chapter_title,
          content: chapter.content,
          is_locked: chapter.is_locked ?? true,
          coin_cost: chapter.coin_cost ?? 0
        }
      ])
      .select()
      .single()

    if (chapterError) {
      console.error('⚠️ Chapter creation failed (book created):', chapterError)
    }

    return {
      book: bookData,
      chapter: chapterData || null,
      message: chapterError ? 'Book created, but chapter failed to save.' : 'Book and chapter created successfully.'
    }

  } catch (err: unknown) {
    console.error('🔥 Book + chapter upload error:', err)

    // Full unknown error handling
    if (err instanceof Error) {
      throw createError({
        statusCode: 400,
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