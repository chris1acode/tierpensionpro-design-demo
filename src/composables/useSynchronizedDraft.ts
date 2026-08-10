import { ref, watch, type WatchSource } from 'vue'

/**
 * Keeps an editable copy of externally owned state in sync without exposing
 * that state for direct mutation from a form.
 */
export function useSynchronizedDraft<T>(
  createDraft: () => T,
  source: WatchSource | WatchSource[],
  onSynchronized?: () => void
) {
  const draft = ref<T>(createDraft())

  function resetDraft(): void {
    draft.value = createDraft()
  }

  watch(source, () => {
    resetDraft()
    onSynchronized?.()
  })

  return { draft, resetDraft }
}
