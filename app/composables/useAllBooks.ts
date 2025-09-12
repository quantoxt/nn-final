import { computed } from 'vue'
import type { Database } from '~/types/database.types'

type Book = Database['public']['Tables']['books']['Row']
type BookStatus = Database['public']['Enums']['book_status']
type BookLabel = Database['public']['Enums']['book_label']

interface BookOptions {
  status?: BookStatus | 'all'
  limit?: number | 'all'
  category?: string
  trope?: string
  label?: BookLabel
}

export function useBooks() {
  // Fetch all books from API
  const { data: allBooks, pending, error } = useFetch<Book[]>('/api/books/all')
  
  const getBooks = (options: BookOptions = {}) => {
    return computed(() => {
      // Start with all books or empty array
      let filtered = allBooks.value || []
      
      // Apply status filter (unless 'all')
      if (options.status && options.status !== 'all') {
        filtered = filtered.filter(book => book.status === options.status)
      }
      
      // Apply category filter if provided
      if (options.category) {
        filtered = filtered.filter(book => book.category_slug === options.category)
      }
      
      // Apply trope filter if provided
      if (options.trope) {
        filtered = filtered.filter(book => book.trope === options.trope)
      }
      
      // Apply label filter if provided
      if (options.label) {
        filtered = filtered.filter(book => book.label === options.label)
      }
      
      // Apply limit (unless 'all')
      if (options.limit && options.limit !== 'all') {
        filtered = filtered.slice(0, options.limit)
      }
      
      return filtered
    })
  }
  
  return {
    getBooks,
    allBooks: computed(() => allBooks.value || []),
    loading: pending,
    error
  }
}