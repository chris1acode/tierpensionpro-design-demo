import { describe, expect, it } from 'vitest'
import { isValidBookingPeriod, isValidIsoDate, toLocalIsoDate } from './bookingPeriod'

describe('booking period', () => {
  it('accepts same-day and multi-day stays', () => {
    expect(isValidBookingPeriod('2026-08-09', '09:30', '2026-08-09')).toBe(true)
    expect(isValidBookingPeriod('2026-08-09', '09:30', '2026-08-16')).toBe(true)
  })

  it('rejects reversed, impossible and incomplete dates or times', () => {
    expect(isValidBookingPeriod('2026-08-10', '09:30', '2026-08-09')).toBe(false)
    expect(isValidBookingPeriod('2026-02-30', '09:30', '2026-03-01')).toBe(false)
    expect(isValidBookingPeriod('2026-08-09', '25:00', '2026-08-10')).toBe(false)
    expect(isValidIsoDate('09.08.2026')).toBe(false)
  })

  it('formats the injected local business date without UTC shifts', () => {
    expect(toLocalIsoDate(new Date(2026, 7, 9, 23, 30))).toBe('2026-08-09')
  })
})
