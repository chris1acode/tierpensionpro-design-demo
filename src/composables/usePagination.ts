import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

/**
 * Provides consistent page bounds and the visible slice for a reactive list.
 */
export function usePagination<T>(items: MaybeRefOrGetter<readonly T[]>, pageSize: number) {
  const currentPage = ref(1)
  const effectivePageSize = Math.max(1, Math.floor(pageSize))
  const pageCount = computed(() => Math.max(1, Math.ceil(toValue(items).length / effectivePageSize)))
  const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * effectivePageSize
    return toValue(items).slice(start, start + effectivePageSize)
  })

  function resetPage(): void {
    currentPage.value = 1
  }

  function selectPage(page: number): void {
    currentPage.value = Math.min(Math.max(page, 1), pageCount.value)
  }

  watch(pageCount, (count) => {
    if (currentPage.value > count) currentPage.value = count
  })

  return { currentPage, pageCount, pagedItems, resetPage, selectPage }
}
