// composables/useUpdateBook.ts
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import { useAuthState } from './useAuthState'
import type { Database } from '~/types/database.types'
/**
 * Updates an existing book's metadata and optionally replaces its cover image.
 * Does NOT handle chapters. Only updates book fields + cover.
 */
export function useUpdateBook(slug: string) {
  const supabase = useSupabaseClient()
  const { user } = useAuthState()
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  interface UpdateFields {
    title?: string
    description?: string | null
    category_slug?: string | null
    trope?: string // 👈 comma-separated string — server splits into array
    status?: Database['public']['Enums']['book_status']
    label?: Database['public']['Enums']['book_label'] | null
    cover_image_url?: string | null
    slug?: string | null // Added slug field
    published_at?: string | null
    rating?: number
    saves?: number
  }
  
  const update = async (
    coverImage?: File,
    updates: UpdateFields
  ): Promise<{ success: true; book?: any } | { success: false; message: string }> => {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Book slug is required')
    }
    
    loading.value = true
    error.value = null
    
    try {
      let coverImageUrl = updates.cover_image_url as string | undefined
      
      // ✅ Handle cover image upload if provided
      if (coverImage) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(coverImage.type)) {
          throw new Error('Only JPEG, JPG, PNG, and WebP images are allowed')
        }
        if (coverImage.size > 5 * 1024 * 1024) {
          throw new Error('Image must be less than 5MB')
        }
        
        // Sanitize filename
        const safeFileName = coverImage.name
          .replace(/[^a-zA-Z0-9._-]/g, '-')
          .toLowerCase()
        const fileExt = safeFileName.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${user.value?.id || 'unknown'}/${fileName}`
        const mimeType = coverImage.type || 'image/jpeg'
        const contentType = mimeType.startsWith('image/') ? mimeType : 'image/jpeg'
        
        const { error: uploadError } = await supabase.storage
          .from('book_covers')
          .upload(filePath, coverImage, {
            upsert: false,
            contentType,
          })
          
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('book_covers')
          .getPublicUrl(filePath)
          
        coverImageUrl = publicUrl
      }
      
      // ✅ Send updated fields to API
      const response = await $fetch(`/api/books/authors/${slug}/put`, {
        method: 'PUT',
        body: {
          ...updates,
          cover_image_url: coverImageUrl, // ✅ Replace if uploaded
        },
      })
      
      console.log('Update response:', response)
      return { success: true, book: response.book }
      
    } catch (err: unknown) {
      // 👇 Your strict error handling rules — applied precisely
      if (err instanceof Error) {
        error.value = err.message
        return { success: false, message: err.message }
      }
      if (err !== null && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>
        const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
        const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
        error.value = `${code}: ${message}`
        return { success: false, message: error.value }
      }
      error.value = `Unexpected error: ${String(err)}`
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  return {
    update,
    loading,
    error,
  }
}