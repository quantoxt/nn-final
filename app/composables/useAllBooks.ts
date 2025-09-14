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
  author_id?: string // 👈 added
}

export function useBooks() {
  const { data: allBooks, pending, error } = useFetch<Book[]>('/api/books/all')
  
  const getBooks = (options: BookOptions = {}) => {
    return computed(() => {
      let filtered = allBooks.value ?? [] // 👈 nullish coalescing
      
      if (options.status && options.status !== 'all') {
        filtered = filtered.filter(book => book.status === options.status)
      }
      
      if (options.category) {
        filtered = filtered.filter(book => book.category_slug === options.category)
      }
      
      if (options.trope) {
        filtered = filtered.filter(book => 
          Array.isArray(book.trope) && book.trope.includes(options.trope) // 👈 fixed
        )
      }
      
      if (options.label) {
        filtered = filtered.filter(book => book.label === options.label)
      }

      if (options.author_id) { // 👈 added
        filtered = filtered.filter(book => book.author_id === options.author_id)
      }
      
      if (options.limit && options.limit !== 'all') {
        filtered = filtered.slice(0, options.limit)
      }
      
      return filtered
    })
  }
  
  return {
    getBooks,
    allBooks: computed(() => allBooks.value ?? []),
    loading: pending,
    error
  }
}