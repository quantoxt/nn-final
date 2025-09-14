// composables/useDeleteChapter.ts
import { ref } from 'vue'
import { toValue, clearNuxtData } from '#imports'
import type { MaybeRefOrGetter } from 'vue'

export function useDeleteChapter(id: MaybeRefOrGetter<string>) {
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const remove = async (): Promise<boolean> => {
    const idValue = toValue(id)
    if (!idValue) {
      error.value = new Error('Chapter ID is required to delete')
      return false
    }

    pending.value = true
    error.value = null

    try {
      await $fetch(`/api/chapters/${idValue}`, {
        method: 'DELETE',
      })

      // Invalidate all cache — safe fallback
      // Later: clearNuxtData(`chapters-${bookSlug}`) when we standardize keys
      await clearNuxtData()

      return true
    } catch (e) {
      error.value = e as Error
      return false
    } finally {
      pending.value = false
    }
  }

  return {
    remove, // 👈 named "remove" to avoid conflict with JS delete keyword
    pending,
    error,
  }
}