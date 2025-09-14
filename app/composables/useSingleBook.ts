import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Database } from '~/types/database.types'

type Book = Database['public']['Tables']['books']['Row']

export function useSingleBook() {
  const route = useRoute()

  const bookSlug = computed(() => route.params.slug as string)
  const categorySlug = computed(() => route.params.book as string)

  const { data, pending, error } = useFetch<Book>(
    () => `/api/books/${bookSlug.value}/get?category=${categorySlug.value}`,
    {
      immediate: !!bookSlug.value && !!categorySlug.value,
    }
  )

  const isValidRoute = computed(() => {
    return !!bookSlug.value && !!categorySlug.value
  })

  return {
    book: data,
    loading: pending,
    error,
    bookSlug,
    isValidRoute,
  }
}
