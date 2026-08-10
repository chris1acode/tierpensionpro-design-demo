import { describe, expect, it } from 'vitest'
import { replaceArrayContents } from './replaceArrayContents'

describe('replaceArrayContents', () => {
  it('replaces all items while preserving the target array reference', () => {
    const target = ['existing', 'items']
    const targetReference = target
    const source = ['fresh', 'snapshot']

    replaceArrayContents(target, source)

    expect(target).toBe(targetReference)
    expect(target).toEqual(['fresh', 'snapshot'])
    expect(source).toEqual(['fresh', 'snapshot'])
  })

  it('clears the target when the source is empty', () => {
    const target = ['existing']

    replaceArrayContents(target, [])

    expect(target).toEqual([])
  })
})
