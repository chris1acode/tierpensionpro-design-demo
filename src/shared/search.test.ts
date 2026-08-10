import { describe, expect, it } from 'vitest'
import { matchesSearchTerm, resolveSearchTerm } from './search'

describe('search helpers', () => {
  it('normalizes the local query and gives it precedence over the global query', () => {
    expect(resolveSearchTerm('  BÄR  ', 'ignored')).toBe('bär')
    expect(resolveSearchTerm('', '  ZIMMER  ')).toBe('zimmer')
  })

  it('matches case-insensitively and treats an empty term as no filter', () => {
    expect(matchesSearchTerm('müller', ['Petra Müller', 'Balu'])).toBe(true)
    expect(matchesSearchTerm('katze', ['Hundezimmer', 'Balu'])).toBe(false)
    expect(matchesSearchTerm('', [])).toBe(true)
  })
})
