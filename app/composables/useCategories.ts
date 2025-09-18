import { useAsyncData } from '#app'
import type { Database } from '~/types/database.types'

// Define the specific type we need for the category dropdown
type Category = Pick<Database['public']['Tables']['categories']['Row'], 'slug' | 'name'>

/**
 * Fetches all categories (slug + name) for dropdowns.
 * This is cached across the application thanks to the unique key.
 */
export const useCategories = () => {
  const { data: categories, pending, error } = useAsyncData<Category[]>(
    'all-categories', // Unique key to ensure this is fetched only once
    async () => {
      // ✨ FIXED: Pointing to your existing API endpoint
      try {
        const data = await $fetch<Category[]>('/api/category/category')
        return data
      } catch (err) {
        console.error('❌ Error fetching categories:', err)
        // Return null or an empty array on failure
        return []
      }
    },
    {
      // Set a default value to prevent errors on first render
      default: () => [],
    }
  )

  return {
    categories,
    pending,
    error,
  }
}

