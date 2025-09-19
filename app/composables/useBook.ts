import type { Database } from '~/types/database.types'

// Original book type from Supabase schema
type Book = Database['public']['Tables']['books']['Row']

// ✨ Create a type for our author API response
type AuthorBook = Book & { 
  chapter_count: number 
  categories?: {
    name: string
    slug: string
  }
  profiles?: {
    username: string
    avatar_url: string
  }
}

export const useBook = (bookSlug: string) => {
  console.log('🔍 useBook called with bookSlug:', bookSlug)
  
  // ✅ Use computed to create a reactive string key
  const key = computed(() => `author-book-${bookSlug}`)
  
  const asyncData = useAsyncData<AuthorBook | null>(
    key,
    async () => {
      console.log('🚀 Fetching author book data for slug:', bookSlug)
      
      if (!bookSlug) {
        console.warn('⚠️ Book slug is empty, returning null')
        return null
      }
      
      try {
        const { data, error } = await useFetch<AuthorBook>(`/api/books/authors/${bookSlug}`)
        
        if (error.value) {
          throw error.value
        }
        
        console.log('✅ Successfully fetched author book:', data.value)
        return data.value
      } catch (err) {
        console.error('❌ Error fetching author book:', err)
        
        if (err instanceof Error && err.message.includes('404')) {
          console.log('📭 Author book not found (404), returning null')
          return null
        }
        
        console.error('🔥 Non-404 error thrown:', err)
        throw err
      }
    },
    {
      server: true,
      default: () => null,
    }
  )
  
  return {
    book: asyncData.data,
    pending: asyncData.pending,
    error: asyncData.error,
    refresh: asyncData.refresh
  }
}