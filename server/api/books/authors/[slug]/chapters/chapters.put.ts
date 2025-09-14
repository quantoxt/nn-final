// server/api/chapters/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

type ChapterUpdate = Database['public']['Tables']['chapters']['Update']

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const chapterId = event.context.params?.id
  if (!chapterId) {
    throw createError({ statusCode: 400, message: 'Chapter ID required' })
  }

  const body = await readBody<ChapterUpdate>(event)

  const supabase = await serverSupabaseClient(event)

  // Verify chapter exists and belongs to user's book
  const { data: chapter, error: fetchError } = await supabase
    .from('chapters')
    .select('id, book_id')
    .eq('id', chapterId)
    .single()

  if (fetchError || !chapter) {
    throw createError({ statusCode: 404, message: 'Chapter not found' })
  }

  // Verify ownership via book
  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('author_id')
    .eq('id', chapter.book_id)
    .single()

  if (bookError || !book || book.author_id !== user.id) {
    throw createError({ statusCode: 403, message: 'Not your chapter' })
  }

  // Update chapter
  const { data: updatedChapter, error: updateError } = await supabase
    .from('chapters')
    .update(body)
    .eq('id', chapterId)
    .select()
    .single()

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update chapter',
      cause: updateError
    })
  }

  return updatedChapter
})