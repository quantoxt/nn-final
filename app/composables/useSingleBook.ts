import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData } from '#app'
import type { Database } from '~/types/database.types'

type Book = Database['public']['Tables']['books']['Row']
type Chapter = Database['public']['Tables']['chapters']['Row']

// Define the combined response type
interface BookWithChapters extends Book {
  chapters: Chapter[]
  categories?: {
    name: string
    slug: string
  }
  profiles?: {
    username: string
    avatar_url: string
  }
}

export function useSingleBook() {
  const route = useRoute()

  const bookSlug = computed(() => route.params.slug as string)
  // const categorySlug = computed(() => route.params.category as string) // Fixed: should be category, not book
  const isBookReady = computed(() => {
    return !asyncData.pending.value && !!asyncData.data.value
  })
  const asyncData = useAsyncData(
    `book-${bookSlug.value}`,
    async () => {
      if (!bookSlug.value) {
        throw new Error('Book slug is required')
      }
      
      const response = await $fetch<BookWithChapters>(
        `/api/books/${bookSlug.value}`
      )
      return response
    },
    {
      immediate: !!bookSlug.value,
      server: true,
      default: () => null,
    }
  )

  const isValidRoute = computed(() => {
    return !!bookSlug.value
  })

  return {
    book: asyncData.data,
    loading: asyncData.pending,
    error: asyncData.error,
    bookSlug,
    isValidRoute,
    isBookReady,
    refresh: asyncData.refresh,
  }
}