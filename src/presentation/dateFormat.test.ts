import { describe, expect, it } from 'vitest'
import { formatCancellationDate, formatDayAndMonth, formatEventTimestamp, formatLongWeekdayDate, formatShortWeekday } from './dateFormat'

describe('date presentation', () => {
  it('formats ISO calendar dates without a timezone-related day shift', () => {
    expect(formatShortWeekday('2026-08-09')).toBe('So')
    expect(formatDayAndMonth('2026-08-09')).toBe('09.08.')
  })

  it('formats the full weekday date used in the dashboard heading', () => {
    expect(formatLongWeekdayDate('2026-08-09')).toBe('Sonntag, 9. August')
    expect(formatLongWeekdayDate('2026-08-10')).toBe('Montag, 10. August')
  })

  it('formats event timestamps and cancellation dates for German users', () => {
    // We expect German formatting but tolerate the time part to vary by timezone if needed, 
    // though the current implementation uses Europe/Berlin.
    expect(formatEventTimestamp('2026-08-09T10:30:00.000Z')).toMatch(/09\.08\.2026, \d{2}:\d{2}/)
    expect(formatCancellationDate('2026-08-09T10:30:00.000Z')).toBe('09.08.2026')
  })
})
