import { useAsyncData } from '#app'
import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { Database } from '~/types/database.types'

type Chapter = Database['public']['Tables']['chapters']['Row']

export const useChapters = (slug: MaybeRefOrGetter<string>) => {
  return useAsyncData<Chapter[]>(
    () => `chapters-${toValue(slug)}`,
    async () => {
      const slugValue = toValue(slug)
      if (!slugValue) return []

      try {
        const data = await $fetch<Chapter[]>(`/api/authors/${slugValue}/chapters`)
        return data
      } catch (err: unknown) {
        // 1. Check if it's an instance of Error
        if (err instanceof Error) {
          if (err.message.includes('404')) return []
          throw err
        }

        // 2. Check if it's an object with status/message
        if (err !== null && typeof err === 'object') {
          const errorObj = err as Record<string, unknown>
          const statusCode = typeof errorObj.statusCode === 'number' ? errorObj.statusCode : 500
          const statusMessage = typeof errorObj.statusMessage === 'string' ? errorObj.statusMessage : 'Unknown error'

          if (statusCode === 404) return []
          throw new Error(`${statusCode}: ${statusMessage}`)
        }

        // 3. Fallback for primitives
        throw new Error(`Unexpected error: ${String(err)}`)
      }
    },
    { server: true }
  )
}