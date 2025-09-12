import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Database } from '~/types/database.types'

type Book = Database['public']['Tables']['books']['Row']

export function useSingleBook() {
  const route = useRoute()

  const categorySlug = computed(() => route.params.book as string)
  const bookSlug = computed(() => route.params.slug as string)

  const { data, pending, error } = useFetch<Book>(
    () => `/api/books/slug/${bookSlug.value}?category=${categorySlug.value}`,
    {
      immediate: !!categorySlug.value && !!bookSlug.value,
    }
  )

  const isValidRoute = computed(() => {
    return !!categorySlug.value && !!bookSlug.value
  })

  return {
    book: data,
    loading: pending,
    error,
    categorySlug,
    bookSlug,
    isValidRoute,
  }
}
