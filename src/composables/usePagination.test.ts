import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { usePagination } from './usePagination'

describe('usePagination', () => {
  it('returns the requested page and keeps it within the available range', () => {
    const scope = effectScope()
    const items = ref(['a', 'b', 'c', 'd', 'e'])
    const pagination = scope.run(() => usePagination(items, 2))!

    pagination.selectPage(3)

    expect(pagination.pageCount.value).toBe(3)
    expect(pagination.pagedItems.value).toEqual(['e'])

    pagination.selectPage(99)
    expect(pagination.currentPage.value).toBe(3)
    scope.stop()
  })

  it('moves back to the last page when the list becomes shorter', async () => {
    const scope = effectScope()
    const items = ref(['a', 'b', 'c', 'd'])
    const pagination = scope.run(() => usePagination(items, 2))!
    pagination.selectPage(2)

    items.value = ['a']
    await nextTick()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.pagedItems.value).toEqual(['a'])
    scope.stop()
  })

  it('uses one item per page for an invalid page size', () => {
    const scope = effectScope()
    const items = ref(['a', 'b'])
    const pagination = scope.run(() => usePagination(items, 0))!

    expect(pagination.pageCount.value).toBe(2)
    expect(pagination.pagedItems.value).toEqual(['a'])

    pagination.selectPage(2)
    expect(pagination.pagedItems.value).toEqual(['b'])
    scope.stop()
  })
})
