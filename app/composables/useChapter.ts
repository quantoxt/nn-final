import { ref } from 'vue'
import type { Database } from '~/types/database.types'

type Chapter = Database['public']['Tables']['chapters']['Row']

export const useChapter = (bookSlug: string, chapterId: string) => {
  console.log('🔍 useChapter called with:', { bookSlug, chapterId })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const chapter = ref<Chapter | null>(null)
  
  const fetchChapter = async () => {
    if (!bookSlug || !chapterId) {
      console.warn('⚠️ Book slug and chapter ID are required')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Fetching chapter:', { bookSlug, chapterId })
      // ✅ Fixed path to match new structure
      const response = await $fetch<Chapter>(`/api/books/authors/${bookSlug}/chapters/${chapterId}`)
      chapter.value = response
      console.log('✅ Successfully fetched chapter:', response)
    } catch (err: unknown) {
      console.error('❌ Error fetching chapter:', err)
      
      if (err instanceof Error) {
        error.value = err.message
        return
      }
      
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        error.value = `INTERNAL_ERROR: ${message}`
        return
      }
      
      error.value = `Unexpected error: ${String(err)}`
    } finally {
      loading.value = false
    }
  }
  
  const updateChapter = async (updates: Partial<Chapter>) => {
    if (!bookSlug || !chapterId) {
      error.value = 'Book slug and chapter ID are required'
      return { success: false, message: 'Book slug and chapter ID are required' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Updating chapter:', { bookSlug, chapterId, updates })
      // ✅ Fixed path
      const response = await $fetch<{ chapter: Chapter; message: string }>(
        `/api/books/authors/${bookSlug}/chapters/${chapterId}`,
        {
          method: 'PUT',
          body: updates
        }
      )
      
      chapter.value = response.chapter
      console.log('✅ Successfully updated chapter:', response.chapter)
      
      return { success: true, chapter: response.chapter }
    } catch (err: unknown) {
      console.error('❌ Error updating chapter:', err)
      
      if (err instanceof Error) {
        error.value = err.message
        return { success: false, message: err.message }
      }
      
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        error.value = `INTERNAL_ERROR: ${message}`
        return { success: false, message: error.value }
      }
      
      const errorMessage = `Unexpected error: ${String(err)}`
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  const deleteChapter = async () => {
    if (!bookSlug || !chapterId) {
      error.value = 'Book slug and chapter ID are required'
      return { success: false, message: 'Book slug and chapter ID are required' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Deleting chapter:', { bookSlug, chapterId })
      // ✅ Fixed path
      const response = await $fetch<{ message: string }>(
        `/api/books/authors/${bookSlug}/chapters/${chapterId}`,
        { method: 'DELETE' }
      )
      
      chapter.value = null
      console.log('✅ Successfully deleted chapter:', response.message)
      
      return { success: true, message: response.message }
    } catch (err: unknown) {
      console.error('❌ Error deleting chapter:', err)
      
      if (err instanceof Error) {
        error.value = err.message
        return { success: false, message: err.message }
      }
      
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        error.value = `INTERNAL_ERROR: ${message}`
        return { success: false, message: error.value }
      }
      
      const errorMessage = `Unexpected error: ${String(err)}`
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  return {
    chapter,
    loading,
    error,
    fetchChapter,
    updateChapter,
    deleteChapter
  }
}