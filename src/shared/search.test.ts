import { describe, expect, it } from 'vitest'
import { matchesSearchTerm, resolveSearchTerm } from './search'

describe('search helpers', () => {
  it('normalizes a local query', () => {
    expect(resolveSearchTerm('  BÄR  ')).toBe('bär')
    expect(resolveSearchTerm('')).toBe('')
  })

  it('matches case-insensitively and treats an empty term as no filter', () => {
    expect(matchesSearchTerm('müller', ['Petra Müller', 'Balu'])).toBe(true)
    expect(matchesSearchTerm(resolveSearchTerm('  WUFFI@EXAMPLE.DE '), ['Petra Müller', 'wuffi@example.de', '0170 1234567'])).toBe(true)
    expect(matchesSearchTerm('katze', ['Hundezimmer', 'Balu'])).toBe(false)
    expect(matchesSearchTerm('', [])).toBe(true)
  })
})
