import type { BookingTimelineBar, BookingTimelineRow, BookingView, Room } from '../domain'
import { addDaysToIsoDate } from './bookingPeriod'

function barsForRoom(bookings: BookingView[], startDate: string, days: number): BookingTimelineBar[][] {
  const endDate = addDaysToIsoDate(startDate, days)
  const bars = bookings
    .filter((booking) => booking.arrivalDate < endDate && booking.departure > startDate && booking.departure > booking.arrivalDate)
    .map((booking) => {
      const visibleStart = booking.arrivalDate > startDate ? booking.arrivalDate : startDate
      const visibleEnd = booking.departure < endDate ? booking.departure : endDate
      return {
        booking,
        startDay: Math.max(0, Math.round((Date.parse(`${visibleStart}T12:00:00`) - Date.parse(`${startDate}T12:00:00`)) / 86_400_000)),
        duration: Math.max(1, Math.round((Date.parse(`${visibleEnd}T12:00:00`) - Date.parse(`${visibleStart}T12:00:00`)) / 86_400_000))
      }
    })
    .sort((a, b) => a.startDay - b.startDay || b.duration - a.duration || a.booking.id.localeCompare(b.booking.id))

  const lanes: BookingTimelineBar[][] = []
  for (const bar of bars) {
    const lane = lanes.find((candidate) => candidate.every((placed) => placed.startDay + placed.duration <= bar.startDay || bar.startDay + bar.duration <= placed.startDay))
    ;(lane ?? (lanes[lanes.length] = [])).push(bar)
  }
  return lanes
}

/**
 * Projects stays into a compact, room-first planning view. Stays without a
 * currently resolvable room remain visible in the explicit fallback slot.
 */
export function createBookingTimeline(bookings: BookingView[], rooms: Room[], startDate: string, days = 7): BookingTimelineRow[] {
  const knownRoomIds = new Set(rooms.map((room) => room.id))
  const rows: BookingTimelineRow[] = rooms.map((room) => ({
    id: room.id,
    label: room.name,
    room,
    lanes: barsForRoom(bookings.filter((booking) => booking.roomId === room.id), startDate, days)
  }))
  const unassigned = bookings.filter((booking) => !knownRoomIds.has(booking.roomId))
  if (unassigned.length) rows.push({ id: 'unassigned', label: 'Ohne Zimmer', lanes: barsForRoom(unassigned, startDate, days) })
  return rows
}
