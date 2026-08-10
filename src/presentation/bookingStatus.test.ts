import { describe, expect, it } from 'vitest'
import type { BookingStatus } from '../domain'
import { bookingStatusFilters, bookingStatusLabels } from './bookingStatus'

describe('booking status presentation', () => {
  it('provides one consistent label for every booking status', () => {
    const statuses: BookingStatus[] = ['confirmed', 'checked-in', 'checked-out']

    expect(Object.keys(bookingStatusLabels)).toEqual(statuses)
    expect(bookingStatusLabels).toEqual({
      confirmed: 'Bestätigt',
      'checked-in': 'Eingecheckt',
      'checked-out': 'Abgeschlossen'
    })
  })

  it('offers all statuses plus the unfiltered option', () => {
    expect(bookingStatusFilters.map(({ value }) => value)).toEqual([
      'all',
      'confirmed',
      'checked-in',
      'checked-out'
    ])
  })
})
