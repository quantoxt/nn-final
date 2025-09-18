// composables/useBecomeAuthor.ts
import { ref } from 'vue'

export const useBecomeAuthor = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const alreadyAuthor = ref(false)

  const becomeAuthor = async () => {
    loading.value = true
    error.value = null
    success.value = false
    alreadyAuthor.value = false

    try {
      console.log('🚀 Attempting to become author...')
      
      const response = await $fetch('/api/user/become-author', {
        method: 'POST'
      })
      
      console.log('✅ Become author response:', response)
      
      if (response.alreadyAuthor) {
        alreadyAuthor.value = true
        return { success: false, alreadyAuthor: true }
      }
      
      if (response.success) {
        success.value = true
        return { success: true, alreadyAuthor: false }
      }
      
      throw new Error(response.message || 'Failed to become author')
    } catch (err: unknown) {
      console.error('❌ Error becoming author:', err)
      
      // Handle Error instances
      if (err instanceof Error) {
        error.value = err.message
        return { success: false, alreadyAuthor: false, error: err.message }
      }
      
      // Handle object-like errors
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
        error.value = `${code}: ${message}`
        return { success: false, alreadyAuthor: false, error: error.value }
      }
      
      // Fallback for non-object errors
      const errorMessage = `Unexpected error: ${String(err)}`
      error.value = errorMessage
      return { success: false, alreadyAuthor: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    alreadyAuthor,
    becomeAuthor
  }
}