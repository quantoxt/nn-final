// composables/useCategories.ts
import { useAsyncData } from '#app'
import type { Database } from '~/types/database.types'

type Category = Pick<Database['public']['Tables']['categories']['Row'], 'slug' | 'name'>

/**
 * Fetches all categories (slug + name) for dropdowns.
 * Globally cached. No auth required.
 * @returns {  Ref<Category[]>, pending: Ref<boolean>, error: Ref<Error | null> }
 */
export const useCategories = () => {
  return useAsyncData<Category[]>(
    'categories', // 👈 static key → shared across all components
    () => $fetch('/api/category/category'),
    {
      server: true,
      default: () => [], // 👈 CRITICAL: ensures .value is always an array — never undefined
      getCachedData: (key) => {
        const cached = useNuxtApp().payload.data[key]
        return cached || useNuxtApp().static.data[key]
      }
    }
  )
}