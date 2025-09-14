// server/api/books/[slug]/chapters/reorder.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
// import type { Database } from '~/types/database.types'

type ChapterReorderItem = {
  id: string
  chapter_number: number
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const bookSlug = event.context.params?.slug
  if (!bookSlug) {
    throw createError({ statusCode: 400, message: 'Slug required' })
  }

  const body = await readBody<{ updates: ChapterReorderItem[] }>(event)
  if (!body.updates || !Array.isArray(body.updates)) {
    throw createError({ statusCode: 400, message: 'Updates array required' })
  }

  const supabase = await serverSupabaseClient(event)

  // Verify book ownership
  const {  data: book, error: bookError } = await supabase
    .from('books')
    .select('id, author_id')
    .eq('slug', bookSlug)
    .single()

  if (bookError || !book) {
    throw createError({ statusCode: 404, message: 'Book not found' })
  }

  if (book.author_id !== user.id) {
    throw createError({ statusCode: 403, message: 'Not your book' })
  }

  // Verify all chapters belong to this book
  const chapterIds = body.updates.map(item => item.id)
  const {  data:chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, book_id')
    .in('id', chapterIds)

  if (chaptersError || !chapters || chapters.length !== chapterIds.length) {
    throw createError({ statusCode: 400, message: 'Invalid chapter IDs' })
  }

  if (chapters.some(ch => ch.book_id !== book.id)) {
    throw createError({ statusCode: 403, message: 'One or more chapters do not belong to this book' })
  }

  // Batch update chapter numbers
  const {  data: updatedChapters, error: updateError } = await supabase
    .from('chapters')
    .upsert(
      body.updates.map(item => ({
        id: item.id,
        chapter_number: item.chapter_number,
        updated_at: new Date().toISOString()
      })),
      { onConflict: 'id' }
    )
    .select()

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to reorder chapters',
      cause: updateError
    })
  }

  return updatedChapters
})