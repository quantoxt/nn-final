import { useCache, invalidateCache as invalidate } from './useCache'

// Define BookOptions type
interface BookOptions {
  status?: 'all' | 'published' | 'pending' | 'rejected'
  category?: string
  trope?: string
  label?: string
}

export function useBooksWithCache(options: BookOptions = {}) {
  // Create a unique cache key based on the options
  const cacheKey = `books-${JSON.stringify(options)}`

  // Define the fetcher function that retrieves the books
  const fetcher = async () => {
    const params = new URLSearchParams()
    if (options.status && options.status !== 'all') {
      params.append('status', options.status)
    }
    if (options.category) {
      params.append('category', options.category)
    }
    if (options.trope) {
      params.append('trope', options.trope)
    }
    if (options.label) {
      params.append('label', options.label)
    }

    const queryString = params.toString()
    const url = `/api/books${queryString ? `?${queryString}` : ''}`

    // Assuming $fetch is globally available, otherwise import it
    return await $fetch<any[]>(url)
  }

  // Use the generic cache composable
  const { data, isFetching, isStale, fetchData } = useCache(cacheKey, fetcher, {
    ttl: 2 * 60 * 1000, // 2 minutes
    staleWhileRevalidate: true,
  })

  // Function to invalidate the cache for these specific options
  const invalidateCache = () => {
    invalidate(cacheKey)
  }

  return {
    books: data,
    isFetching,
    isStale,
    fetchBooks: fetchData, // Expose manual refetching
    invalidateCache, // Expose invalidation
  }
}
