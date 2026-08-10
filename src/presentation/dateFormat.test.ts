import { describe, expect, it } from 'vitest'
import { formatCancellationDate, formatDayAndMonth, formatEventTimestamp, formatShortWeekday } from './dateFormat'

describe('date presentation', () => {
  it('formats ISO calendar dates without a timezone-related day shift', () => {
    expect(formatShortWeekday('2026-08-09')).toBe('So')
    expect(formatDayAndMonth('2026-08-09')).toBe('09.08.')
  })

  it('formats event timestamps and cancellation dates for German users', () => {
    expect(formatEventTimestamp('2026-08-09T10:30:00.000Z')).toBe('09.08.2026, 12:30')
    expect(formatCancellationDate('2026-08-09T10:30:00.000Z')).toBe('09.08.2026')
  })
})
