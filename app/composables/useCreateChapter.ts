// composables/useCreateChapter.ts
import { ref } from 'vue'
import type { Database } from '~/types/database.types'

type Chapter = Database['public']['Tables']['chapters']['Row']

interface CreateChapterData {
  chapter_title: string
  content: string
  coin_cost?: number
  is_locked?: boolean
}

export const useCreateChapter = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const createChapter = async (bookSlug: string, chapterData: CreateChapterData) => {
    if (!bookSlug) {
      error.value = 'Book slug is required'
      return { success: false, message: 'Book slug is required' }
    }
    
    if (!chapterData.chapter_title || !chapterData.content) {
      error.value = 'Chapter title and content are required'
      return { success: false, message: 'Chapter title and content are required' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Creating chapter for book:', bookSlug, 'with data:', chapterData)
      const response = await $fetch<{ chapter: Chapter; message: string }>(
        `/api/books/authors/${bookSlug}/chapters`,
        {
          method: 'POST',
          body: chapterData
        }
      )
      
      console.log('✅ Successfully created chapter:', response.chapter)
      
      return { success: true, chapter: response.chapter }
    } catch (err: unknown) {
      console.error('❌ Error creating chapter:', err)
      
      // Handle Error instances
      if (err instanceof Error) {
        error.value = err.message
        return { success: false, message: err.message }
      }
      
      // Handle object-like errors
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
        error.value = `${code}: ${message}`
        return { success: false, message: error.value }
      }
      
      // Fallback for non-object errors
      const errorMessage = `Unexpected error: ${String(err)}`
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    createChapter
  }
}