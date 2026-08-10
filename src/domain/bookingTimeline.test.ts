import { describe, expect, it } from 'vitest'
import type { BookingView, Room } from '../domain'
import { createBookingTimeline } from './bookingTimeline'

const room: Room = { id: 'r-1', name: 'Waldzimmer 1', category: 'Hundezimmer', capacity: 2 }
const booking = (id: string, arrivalDate: string, departure: string, roomId = 'r-1'): BookingView => ({
  id, petId: `p-${id}`, roomId, arrivalDate, departure, arrival: '09:00', status: 'confirmed',
  pet: { id: `p-${id}`, customerId: 'c-1', name: `Tier ${id}`, species: 'dog', breed: 'Mischling', initials: 'TT', color: '#fff' },
  customer: { id: 'c-1', firstName: 'Robin', lastName: 'Muster', email: 'robin@example.de', phone: '0123' }, room
})

describe('booking timeline', () => {
  it('clips continuous booking bars to the selected week and assigns collisions to lanes', () => {
    const rows = createBookingTimeline([
      booking('one', '2026-08-07', '2026-08-11'),
      booking('two', '2026-08-10', '2026-08-13'),
      booking('three', '2026-08-13', '2026-08-15')
    ], [room], '2026-08-09')

    expect(rows[0]?.lanes.map((lane) => lane.map(({ startDay, duration }) => [startDay, duration]))).toEqual([[[0, 2], [4, 2]], [[1, 3]]])
  })

  it('keeps stays with an unavailable room reference in the visible fallback row', () => {
    const rows = createBookingTimeline([booking('unassigned', '2026-08-10', '2026-08-12', 'removed-room')], [room], '2026-08-09')
    expect(rows.at(-1)).toMatchObject({ id: 'unassigned', label: 'Ohne Zimmer' })
    expect(rows.at(-1)?.lanes[0]?.[0]).toMatchObject({ startDay: 1, duration: 2 })
  })
})
