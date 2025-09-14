import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import { useAuthState } from './useAuthState'

/**
 * Uploads a new book + its first chapter in one flow.
 * - Uploads cover image to "book_covers" bucket
 * - Chapter content is plain text (no file upload for chapter)
 * - Creates book + chapter records
 */
export function useUploadBook() {
  const supabase = useSupabaseClient()
  const { user } = useAuthState()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)

  interface UploadMetadata {
    title: string
      slug: string
      trope: string
    description: string
    cover_image_url?: string
    category_slug: string
    chapter_number: number
    chapter_title: string
    chapter_content: string // ✅ CHANGED: text content, not file
    coin_cost: number
    is_locked: boolean
    isDraft: boolean
  }

  // ✅ Accept cover image file (for book cover), not chapter file
  const upload = async (coverImage: File, metadata: UploadMetadata) => {
    if (!user.value?.id) {
      throw new Error('User not authenticated')
    }

    if (!metadata.slug || typeof metadata.slug !== 'string' || metadata.slug.trim() === '') {
      throw new Error('Slug is required and must be a non-empty string')
    }

    loading.value = true
    error.value = null
    progress.value = 0

    try {
      let coverImageUrl = metadata.cover_image_url

      // ✅ Upload cover image to "book_covers" bucket
      if (coverImage) {
        // ✅ Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(coverImage.type)) {
          throw new Error('Only JPEG, JPG, PNG, and WebP images are allowed')
        }

        // ✅ Validate file size (max 5MB)
        if (coverImage.size > 5 * 1024 * 1024) {
          throw new Error('Image must be less than 5MB')
        }

        // ✅ Sanitize filename
        const safeFileName = coverImage.name
          .replace(/[^a-zA-Z0-9._-]/g, '-')
          .toLowerCase()

        const fileExt = safeFileName.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${user.value.id}/${fileName}`

        // ✅ Set valid contentType — force fallback to image/jpeg
        const mimeType = coverImage.type || 'image/jpeg'
        const contentType = mimeType.startsWith('image/') ? mimeType : 'image/jpeg'

        const { error: uploadError } = await supabase.storage
          .from('book_covers') // ✅ CHANGED: book_covers
          .upload(filePath, coverImage, {
            upsert: false,
            contentType: contentType
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('book_covers') // ✅ CHANGED: book_covers
          .getPublicUrl(filePath)

        coverImageUrl = publicUrl
      }

      const bookStatus = metadata.isDraft ? 'draft' : 'pending_review'

      // ✅ Send to API — chapter.content is text, not content_url
      const response = await $fetch('/api/books/authors/post', {
        method: 'POST',
        body: {
          title: metadata.title,
            slug: metadata.slug.trim(),
          trope: metadata.trope,
          description: metadata.description,
          cover_image_url: coverImageUrl, // ✅ From cover upload
          category_slug: metadata.category_slug,
          status: bookStatus,
          chapter: {
            chapter_number: metadata.chapter_number,
            chapter_title: metadata.chapter_title,
            content: metadata.chapter_content, // ✅ CHANGED: content (text)
            is_locked: metadata.is_locked,
            coin_cost: metadata.coin_cost
          }
        }
      })

      return response

    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Upload failed'
      }
      throw err
    } finally {
      loading.value = false
      progress.value = 0
    }
  }

  return {
    upload,
    loading,
    error,
    progress
  }
}