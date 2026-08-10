import { describe, expect, it } from 'vitest'
import { nextEntityId } from './nextEntityId'

describe('nextEntityId', () => {
  it.each([
    { entities: [], prefix: 'p', expected: 'p-1' },
    { entities: [{ id: 'p-1' }, { id: 'p-4' }], prefix: 'p', expected: 'p-5' },
    { entities: [{ id: 'b-12' }, { id: 'p-99' }], prefix: 'b', expected: 'b-13' }
  ])('creates $expected for prefix $prefix', ({ entities, prefix, expected }) => {
    expect(nextEntityId(entities, prefix)).toBe(expected)
  })

  it('ignores ids whose suffix is not a positive integer', () => {
    const entities = [{ id: 'p-draft' }, { id: 'p-4-copy' }, { id: 'p-2' }]

    expect(nextEntityId(entities, 'p')).toBe('p-3')
  })
})
