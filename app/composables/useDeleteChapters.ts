// composables/useDeleteChapters.ts
import { ref } from 'vue'

export const useDeleteChapters = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const deleteChapters = async (bookSlug: string, chapterIds: string[]) => {
    if (!bookSlug) {
      error.value = 'Book slug is required'
      return { success: false, message: 'Book slug is required' }
    }
    
    if (!Array.isArray(chapterIds) || chapterIds.length === 0) {
      error.value = 'Chapter IDs must be a non-empty array'
      return { success: false, message: 'Chapter IDs must be a non-empty array' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Deleting chapters for book:', bookSlug, 'chapter IDs:', chapterIds)
      const response = await $fetch<{ message: string }>(
        `/api/books/authors/${bookSlug}/chapters`,
        {
          method: 'DELETE',
          body: { chapterIds }
        }
      )
      
      console.log('✅ Successfully deleted chapters:', response.message)
      
      return { success: true, message: response.message }
    } catch (err: unknown) {
      console.error('❌ Error deleting chapters:', err)
      
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
    deleteChapters
  }
}