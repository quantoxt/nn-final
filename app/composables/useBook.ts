import { useAsyncData } from '#app'
import type { Database } from '~/types/database.types'

type Book = Database['public']['Tables']['books']['Row']

export const useBook = (slug: string) => {
  console.log('🔍 useBook called with slug:', slug)
  
  const asyncData = useAsyncData<Book | null>(
    `book-${slug}`, // Unique key per book
    async () => {
      console.log('🚀 Fetching book data for slug:', slug)
      
      if (!slug) {
        console.warn('⚠️ Slug is empty, returning null')
        return null
      }
      
      try {
        const data = await $fetch<Book>(`/api/books/authors/${slug}`)
        console.log('✅ Successfully fetched book:', data)
        return data
      } catch (err) {
        console.error('❌ Error fetching book:', err)
        
        // 404 → treat as "not found", not error
        if (err instanceof Error && err.message.includes('404')) {
          console.log('📭 Book not found (404), returning null')
          return null
        }
        
        // Any other error → throw so parent can handle UI
        console.error('🔥 Non-404 error thrown:', err)
        throw err
      }
    },
    {
      server: false, // Removed SSR to avoid session issues
      default: () => null, // Ensures .value is always null initially
    }
  )
  
  // Return the data in a way that matches the component's expectations
  return {
    book: asyncData.data,
    pending: asyncData.pending,
    error: asyncData.error
  }
}