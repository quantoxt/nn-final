import { ref, type Ref } from 'vue'

// Define the structure of a cache entry
interface CacheEntry<T> {
  data: Ref<T | null>
  timestamp: number
  ttl: number
  staleWhileRevalidate: boolean
  isFetching: Ref<boolean>
}

// In-memory cache stored in a Map
const cache = new Map<string, CacheEntry<any>>()

// Options for configuring cache behavior
interface CacheOptions {
  ttl?: number // Time-to-live in milliseconds
  staleWhileRevalidate?: boolean // Return stale data while fetching fresh
}

export function useCache<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}) {
  const {
    ttl = 1000 * 60 * 5, // Default TTL: 5 minutes
    staleWhileRevalidate = false,
  } = options

  // Initialize cache entry if it doesn't exist
  if (!cache.has(key)) {
    cache.set(key, {
      data: ref(null),
      timestamp: 0,
      ttl,
      staleWhileRevalidate,
      isFetching: ref(false),
    })
  }

  const entry = cache.get(key) as CacheEntry<T>

  const isStale = () => {
    return (Date.now() - entry.timestamp) > entry.ttl
  }

  const fetchData = async () => {
    if (entry.isFetching.value) {
      return
    }

    entry.isFetching.value = true
    try {
      const freshData = await fetcher()
      entry.data.value = freshData
      entry.timestamp = Date.now()
    } catch (error) {
      console.error(`Failed to fetch data for cache key "${key}":`, error)
    } finally {
      entry.isFetching.value = false
    }
  }

  // Initial fetch or revalidation
  if (!entry.data.value || isStale()) {
    if (entry.staleWhileRevalidate && entry.data.value) {
      // Return stale data and revalidate in the background
      fetchData()
    } else {
      // Fetch data immediately
      fetchData()
    }
  }

  return {
    data: entry.data,
    isFetching: entry.isFetching,
    isStale,
    fetchData, // Expose fetchData to allow manual refresh
  }
}

// Function to invalidate a specific cache entry
export function invalidateCache(key: string) {
  if (cache.has(key)) {
    const entry = cache.get(key)
    // Re-fetch data if needed
    const { fetcher, options } = entry[Symbol.for('fetcher-meta')]
    useCache(key, fetcher, options)
  }
}

// Function to clear the entire cache
export function clearCache() {
  cache.clear()
}
