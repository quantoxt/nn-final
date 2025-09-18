import { useAsyncData } from '#app'
import type { Database } from '~/types/database.types'

// Original book type from Supabase schema
type Book = Database['public']['Tables']['books']['Row']

// ✨ NEW: Create a more specific type for our API response, which now includes chapter_count
type BookWithChapterCount = Book & { chapter_count: number }

export const useBook = (slug: string) => {
  console.log('🔍 useBook called with slug:', slug)
  
  // ✨ UPDATED: Use the new, more specific type here
  const asyncData = useAsyncData<BookWithChapterCount | null>(
    `book-${slug}`, // Unique key per book
    async () => {
      console.log('🚀 Fetching book data for slug:', slug)
      
      if (!slug) {
        console.warn('⚠️ Slug is empty, returning null')
        return null
      }
      
      try {
        // ✨ UPDATED: And also here, so $fetch knows what to expect
        const data = await $fetch<BookWithChapterCount>(`/api/books/authors/${slug}`)
        console.log('✅ Successfully fetched book with chapter count:', data)
        return data
      } catch (err) {
        console.error('❌ Error fetching book:', err)
        
        if (err instanceof Error && err.message.includes('404')) {
          console.log('📭 Book not found (404), returning null')
          return null
        }
        
        console.error('🔥 Non-404 error thrown:', err)
        throw err
      }
    },
    {
      server: false, 
      default: () => null,
    }
  )
  
  return {
    book: asyncData.data,
    pending: asyncData.pending,
    error: asyncData.error
  }
}
