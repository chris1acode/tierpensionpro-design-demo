import { describe, expect, it } from 'vitest'
import { addDaysToIsoDate, buildDateRange, enumerateStayDates, fromLocalIsoDate, isDateWithinStay, isValidBookingPeriod, isValidIsoDate, isValidOptionalTime, toLocalIsoDate } from './bookingPeriod'

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

  it('accepts an omitted collection time but rejects malformed optional values', () => {
    expect(isValidOptionalTime(undefined)).toBe(true)
    expect(isValidOptionalTime('')).toBe(true)
    expect(isValidOptionalTime('14:30')).toBe(true)
    expect(isValidOptionalTime('24:00')).toBe(false)
    expect(isValidOptionalTime('14.30')).toBe(false)
  })

  it('formats the injected local business date without UTC shifts', () => {
    expect(toLocalIsoDate(new Date(2026, 7, 9, 23, 30))).toBe('2026-08-09')
  })

  it('treats the departure date as a checkout day outside the occupied range', () => {
    expect(isDateWithinStay('2026-08-09', '2026-08-09', '2026-08-12')).toBe(true)
    expect(isDateWithinStay('2026-08-11', '2026-08-09', '2026-08-12')).toBe(true)
    expect(isDateWithinStay('2026-08-12', '2026-08-09', '2026-08-12')).toBe(false)
    expect(isDateWithinStay('2026-08-08', '2026-08-09', '2026-08-12')).toBe(false)
    expect(isDateWithinStay('2026-08-09', '2026-08-09', '2026-08-09')).toBe(false)
  })

  it('builds a gap-free range of consecutive ISO dates starting at the given day', () => {
    expect(buildDateRange(new Date(2026, 7, 9), 3)).toEqual(['2026-08-09', '2026-08-10', '2026-08-11'])
  })

  it('returns an empty range for zero or negative day counts', () => {
    expect(buildDateRange(new Date(2026, 7, 9), 0)).toEqual([])
    expect(buildDateRange(new Date(2026, 7, 9), -2)).toEqual([])
  })

  it('enumerates every occupied night of a stay, excluding the checkout day', () => {
    expect(enumerateStayDates('2026-08-09', '2026-08-12')).toEqual(['2026-08-09', '2026-08-10', '2026-08-11'])
  })

  it('crosses a month boundary and returns no nights for a same-day stay', () => {
    expect(enumerateStayDates('2026-08-30', '2026-09-02')).toEqual(['2026-08-30', '2026-08-31', '2026-09-01'])
    expect(enumerateStayDates('2026-08-09', '2026-08-09')).toEqual([])
  })

  it('parses an ISO date into a local calendar date without timezone shifts', () => {
    expect(toLocalIsoDate(fromLocalIsoDate('2026-08-09'))).toBe('2026-08-09')
  })

  it('shifts an ISO date forward and backward, crossing month and year boundaries', () => {
    expect(addDaysToIsoDate('2026-08-09', 7)).toBe('2026-08-16')
    expect(addDaysToIsoDate('2026-08-09', -7)).toBe('2026-08-02')
    expect(addDaysToIsoDate('2026-08-28', 7)).toBe('2026-09-04')
    expect(addDaysToIsoDate('2026-12-30', 7)).toBe('2027-01-06')
  })
})
