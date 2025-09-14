// composables/useUserBooks.ts
import { computed, ref } from 'vue'
//import type { Database } from '~/types/database.types'

//type BookStatus = Database['public']['Enums']['book_status']

/**
 * Returns books authored by current user — filtered by status and limit.
 * Uses data from useBooks() → filters client-side.
 * @param status - BookStatus | 'all' (default: 'all')
 * @param limit - number | 'all' (default: 'all')
 */
export function useUserBooks(
  status: Ref<string> = ref('all'),
  limit: Ref<number | string> = ref('all')
) {
  const { user } = useAuthState()
  const { getBooks: getAllBooks, loading, error } = useBooks()

  const allBooks = getAllBooks()
  const userId = computed(() => user.value?.id) // 👈 reactive dep fix

  const userBooks = computed(() => {
    if (!userId.value) return []

    let filtered = allBooks.value ?? [] // 👈 nullish fix

    filtered = filtered.filter(book => book.author_id === userId.value)

    if (status.value && status.value !== 'all') {
      filtered = filtered.filter(book => book.status === status.value)
    }

    if (limit.value && limit.value !== 'all') {
      const numLimit = Number(limit.value)
      if (isFinite(numLimit)) {
        filtered = filtered.slice(0, numLimit)
      }
    }

    return filtered
  })

  const isEmpty = computed(() => !loading.value && userBooks.value.length === 0) // 👈 optional UX helper

  return {
    books: userBooks,
    loading,
    error,
    isEmpty // 👈 optional
  }
}