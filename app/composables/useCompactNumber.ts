import type { ComputedRef } from 'vue'

export function useCompactNumber(value: Ref<number | string>): ComputedRef<string> {
  return computed(() => {
    if (typeof value.value !== 'number') {
      return String(value.value)
    }

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    })

    return formatter.format(value.value)
  })
}