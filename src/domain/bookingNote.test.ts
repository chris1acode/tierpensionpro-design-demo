import { describe, expect, it } from 'vitest'
import { isValidBookingNote, normalizeBookingNote } from './bookingNote'

describe('booking note policy', () => {
  it('trims optional notes and omits empty input', () => {
    expect(normalizeBookingNote('  Medikament mittags geben  ')).toBe('Medikament mittags geben')
    expect(normalizeBookingNote('   ')).toBeUndefined()
  })

  it('rejects notes longer than the concise operational limit', () => {
    expect(isValidBookingNote('x'.repeat(300))).toBe(true)
    expect(isValidBookingNote('x'.repeat(301))).toBe(false)
  })
})
