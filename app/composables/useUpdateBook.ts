import { ref } from 'vue'
import { toast } from 'vue-sonner'
import type { Database } from '~/types/database.types'

//type BookData = Partial<Database['public']['Tables']['books']['Row']>
type BookUpdateData = Partial<Pick<
  Database['public']['Tables']['books']['Row'],
  'title' | 'description' | 'category_slug' | 'status' | 'cover_image_url' | 'trope' | 'label' | 'slug'
>>

interface ApiResponse {
  success: boolean
  message: string
}

interface AppError {
  message: string
  code?: string | number
}

export function useUpdateBook() {
  const loading = ref(false)
  const error = ref<AppError | null>(null)

  // Helper function to safely handle errors
  const handleError = (err: unknown): AppError => {
    // 1. Check for Error instance
    if (err instanceof Error) {
      return {
        message: err.message,
        code: (err as { code?: string | number }).code
      }
    }
    
    // 2. Handle object-like errors
    if (typeof err === 'object' && err !== null) {
      const errorObj = err as Record<string, unknown>
      const message = typeof errorObj.message === 'string' 
        ? errorObj.message 
        : typeof errorObj.data === 'string'
          ? errorObj.data
          : JSON.stringify(err)
      
      const code = typeof errorObj.code === 'string' || typeof errorObj.code === 'number'
        ? errorObj.code
        : typeof errorObj.data === 'string' || typeof errorObj.data === 'number'
          ? errorObj.data
          : undefined
      
      return { message, code }
    }
    
    // 3. Fallback for primitives and other types
    return { message: String(err) }
  }

  const updateBook = async (bookSlug: string, bookData: BookUpdateData): Promise<ApiResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse>(`/api/books/authors/${bookSlug}`, {
        method: 'PUT',
        body: bookData,
      })
      console.log('🚀 Updating book:', { bookSlug, bookData })
      if (response.success) {
        return { success: true, message: response.message }
      } else {
        return { success: false, message: 'An unknown error occurred' }
      }
    } catch (err) {
      const appError = handleError(err)
      error.value = appError
      toast.error(appError.message)
      return { success: false, message: appError.message }
    } finally {
      loading.value = false
    }
  }

  return { updateBook, loading, error }
}