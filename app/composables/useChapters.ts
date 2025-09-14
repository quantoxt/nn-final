// composables/useChapters.ts
import { useAsyncData } from '#app'
import type { Database } from '~/types/database.types'

type Chapter = Database['public']['Tables']['chapters']['Row']

export const useChapters = (bookSlug: string) => {
  console.log('🔍 useChapters called with bookSlug:', bookSlug)
  
  const asyncData = useAsyncData(
    `chapters-${bookSlug}`,
    async () => {
      console.log('🚀 Fetching chapters for book:', bookSlug)
      
      if (!bookSlug) {
        console.warn('⚠️ Book slug is empty, returning empty array')
        return []
      }
      
      try {
        const response = await $fetch<{ chapters: Chapter[] }>(`/api/books/authors/${bookSlug}/chapters`)
        console.log('✅ Successfully fetched chapters:', response.chapters)
        return response.chapters
      } catch (err: unknown) {
        console.error('❌ Error fetching chapters:', err)
        
        // Handle Error instances
        if (err instanceof Error) {
          throw new Error(`Failed to fetch chapters: ${err.message}`)
        }
        
        // Handle object-like errors
        if (err !== null && typeof err === 'object') {
          const errorObj = err as Record<string, unknown>
          const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
          const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
          throw new Error(`${code}: ${message}`)
        }
        
        // Fallback for non-object errors
        throw new Error(`Unexpected error: ${String(err)}`)
      }
    },
    {
      server: false,
      default: () => [],
    }
  )
  
  return {
    chapters: asyncData.data,
    pending: asyncData.pending,
    error: asyncData.error,
    refresh: asyncData.refresh
  }
}