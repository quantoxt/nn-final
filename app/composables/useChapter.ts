// composables/useChapter.ts
import { ref } from 'vue'
import type { Database } from '~/types/database.types'

type Chapter = Database['public']['Tables']['chapters']['Row']

export const useChapter = (chapterId: string) => {
  console.log('🔍 useChapter called with chapterId:', chapterId)
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const chapter = ref<Chapter | null>(null)
  
  const fetchChapter = async () => {
    if (!chapterId) {
      console.warn('⚠️ Chapter ID is empty')
    return
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Fetching chapter:', chapterId)
      const response = await $fetch<Chapter>(`/api/books/authors/chapters/${chapterId}`)
      chapter.value = response
      console.log('✅ Successfully fetched chapter:', response)
    } catch (err: unknown) {
      console.error('❌ Error fetching chapter:', err)
      
      // Handle Error instances
      if (err instanceof Error) {
        error.value = err.message
        return
      }
      
      // Handle object-like errors
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
        error.value = `${code}: ${message}`
        return
      }
      
      // Fallback for non-object errors
      error.value = `Unexpected error: ${String(err)}`
    } finally {
      loading.value = false
    }
  }
  
  const updateChapter = async (updates: Partial<Chapter>) => {
    if (!chapterId) {
      error.value = 'Chapter ID is required'
      return { success: false, message: 'Chapter ID is required' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Updating chapter:', chapterId, 'with updates:', updates)
      const response = await $fetch<{ chapter: Chapter; message: string }>(
        `/api/books/authors/chapters/${chapterId}`,
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
  
  const deleteChapter = async () => {
    if (!chapterId) {
      error.value = 'Chapter ID is required'
      return { success: false, message: 'Chapter ID is required' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Deleting chapter:', chapterId)
      const response = await $fetch<{ message: string }>(
        `/api/books/authors/chapters/${chapterId}`,
        { method: 'DELETE' }
      )
      
      chapter.value = null
      console.log('✅ Successfully deleted chapter:', response.message)
      
      return { success: true, message: response.message }
    } catch (err: unknown) {
      console.error('❌ Error deleting chapter:', err)
      
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
    chapter,
    loading,
    error,
    fetchChapter,
    updateChapter,
    deleteChapter
  }
}