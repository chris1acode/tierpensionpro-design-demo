import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useSynchronizedDraft } from './useSynchronizedDraft'

describe('useSynchronizedDraft', () => {
  it('resets its editable copy when the source changes', async () => {
    const scope = effectScope()
    const source = ref({ name: 'Erika', email: 'erika@example.test' })
    const synchronized = vi.fn()

    const { draft } = scope.run(() => useSynchronizedDraft(
      () => ({ ...source.value }),
      source,
      synchronized
    ))!

    draft.value.name = 'Ungespeichert'
    source.value = { name: 'Max', email: 'max@example.test' }
    await nextTick()

    expect(draft.value).toEqual({ name: 'Max', email: 'max@example.test' })
    expect(synchronized).toHaveBeenCalledOnce()
    scope.stop()
  })

  it('resets the draft explicitly', () => {
    const scope = effectScope()
    const source = ref('erste Fassung')
    const { draft, resetDraft } = scope.run(() => useSynchronizedDraft(
      () => ({ value: source.value }),
      source
    ))!

    draft.value.value = 'Ungespeichert'
    resetDraft()

    expect(draft.value).toEqual({ value: 'erste Fassung' })
    scope.stop()
  })
})
