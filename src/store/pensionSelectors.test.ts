import { describe, expect, it } from 'vitest'
import type { Booking, CheckInOutEvent, Customer, Pet, Room, RoomOperationalState } from '../domain'
import {
  selectBookingViews,
  selectArrivals,
  selectCheckInOutHistory,
  selectCustomerViews,
  selectDailyOccupancy,
  selectDepartures,
  selectCheckedIn,
  occupancyLevelFor,
  selectReservationCandidates,
  selectRoomOccupancyForPeriod,
  selectRoomTimelines
} from './pensionSelectors'

const customers: Customer[] = [
  { id: 'customer-1', firstName: 'Ada', lastName: 'Zeller', email: 'ada@example.de', phone: '123' },
  { id: 'customer-2', firstName: 'Bea', lastName: 'Albrecht', email: 'bea@example.de', phone: '456' }
]
const pets: Pet[] = [
  { id: 'pet-1', customerId: 'customer-1', name: 'Balu', species: 'dog', breed: 'Mix', initials: 'BA', color: '#fff' }
]
const rooms: Room[] = [
  { id: 'room-1', name: 'Zimmer 1', category: 'Hundezimmer', capacity: 1 },
  { id: 'room-2', name: 'Zimmer 2', category: 'Hundezimmer', capacity: 2 }
]
const bookings: Booking[] = [
  { id: 'booking-1', petId: 'pet-1', roomId: 'room-1', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-10', createdAt: '2026-08-01T09:00:00.000Z', status: 'confirmed' }
]

describe('pension selectors', () => {
  it('resolves and groups views without relying on Vue reactivity', () => {
    const bookingViews = selectBookingViews(bookings, pets, customers, rooms)
    const customerViews = selectCustomerViews(customers, pets, bookingViews)

    expect(bookingViews[0]).toMatchObject({ pet: { name: 'Balu' }, customer: { lastName: 'Zeller' } })
    expect(customerViews.map((customer) => customer.lastName)).toEqual(['Albrecht', 'Zeller'])
    expect(customerViews[0]).toMatchObject({ pets: [], bookings: [] })
    expect(customerViews[1].bookings).toHaveLength(1)
  })

  it('derives open arrivals and checked-in departures for a selected operational day', () => {
    const bookingViews = selectBookingViews([
      bookings[0],
      { ...bookings[0], id: 'booking-2', arrivalDate: '2026-08-10', departure: '2026-08-11', status: 'confirmed' },
      { ...bookings[0], id: 'booking-3', arrivalDate: '2026-08-08', departure: '2026-08-10', status: 'checked-in' }
    ], pets, customers, rooms)

    expect(selectArrivals(bookingViews, '2026-08-10').map((booking) => booking.id)).toEqual(['booking-2'])
    expect(selectDepartures(bookingViews, '2026-08-10').map((booking) => booking.id)).toEqual(['booking-3'])
    expect(selectCheckedIn(bookingViews).map((booking) => booking.id)).toEqual(['booking-3'])
  })

  it('reports the affected booking when a reference is invalid', () => {
    expect(() => selectBookingViews(
      [{ ...bookings[0], petId: 'missing' }],
      pets,
      customers,
      rooms
    )).toThrow('Ungültige Referenz in Buchung booking-1')
  })

  it('offers only customers with pets that are not in an active reservation', () => {
    const candidates = selectReservationCandidates(customers, pets, [
      { ...bookings[0], status: 'confirmed' },
      { petId: 'pet-1', status: 'checked-out' }
    ])

    expect(candidates).toEqual({ pets: [], customers: [] })

    const afterCheckout = selectReservationCandidates(customers, pets, [
      { ...bookings[0], status: 'checked-out' }
    ])
    expect(afterCheckout.pets.map((pet) => pet.id)).toEqual(['pet-1'])
    expect(afterCheckout.customers.map((customer) => customer.id)).toEqual(['customer-1'])
  })
})

describe('occupancy timeline selectors', () => {
  const operationalStates: RoomOperationalState[] = [
    { id: 'state-1', roomId: 'room-1', status: 'ready', updatedAt: '2026-08-01T00:00:00.000Z' },
    { id: 'state-2', roomId: 'room-2', status: 'maintenance', updatedAt: '2026-08-01T00:00:00.000Z' }
  ]
  const dates = ['2026-08-08', '2026-08-09', '2026-08-10']
  const bookingViews = selectBookingViews(bookings, pets, customers, rooms)

  it('places bookings only on the dates they actually occupy the room', () => {
    const [roomOne, roomTwo] = selectRoomTimelines(rooms, operationalStates, bookingViews, dates)

    expect(roomOne.segments.map((segment) => segment.bookings.length)).toEqual([0, 1, 0])
    expect(roomOne.segments.map((segment) => segment.level)).toEqual(['low', 'full', 'low'])
    expect(roomOne.segments[1].bookings[0]).toMatchObject({ id: 'booking-1' })
    expect(roomTwo.segments.every((segment) => segment.bookings.length === 0)).toBe(true)
  })

  it('excludes checked-out bookings and reports the operational state per room', () => {
    const checkedOut = selectBookingViews(
      [{ ...bookings[0], status: 'checked-out' }],
      pets,
      customers,
      rooms
    )
    const [roomOne, roomTwo] = selectRoomTimelines(rooms, operationalStates, checkedOut, dates)

    expect(roomOne.segments.every((segment) => segment.bookings.length === 0)).toBe(true)
    expect(roomTwo.operationalState.status).toBe('maintenance')
  })

  it('throws when a room has no operational state on record', () => {
    expect(() => selectRoomTimelines(rooms, [operationalStates[0]], bookingViews, dates))
      .toThrow('Fehlender Betriebsstatus für Zimmer room-2')
  })

  it('derives daily occupancy only from ready rooms and active bookings', () => {
    const daily = selectDailyOccupancy(rooms, operationalStates, bookingViews, dates)

    expect(daily).toEqual([
      { date: '2026-08-08', occupied: 0, capacity: 1, availablePlaces: 1, rate: 0, level: 'low', isClosed: false },
      { date: '2026-08-09', occupied: 1, capacity: 1, availablePlaces: 0, rate: 100, level: 'full', isClosed: false },
      { date: '2026-08-10', occupied: 0, capacity: 1, availablePlaces: 1, rate: 0, level: 'low', isClosed: false }
    ])
  })

  it('reports zero utilisation instead of dividing by zero when no room is ready', () => {
    const allMaintenance = operationalStates.map((state) => ({ ...state, status: 'maintenance' as const }))
    const daily = selectDailyOccupancy(rooms, allMaintenance, bookingViews, dates)

    expect(daily.every((day) => day.rate === 0 && day.capacity === 0 && day.level === 'unavailable')).toBe(true)
  })

  it('sets all available places to zero for a closure day without hiding existing stays', () => {
    const closures = [{ id: 'closure-1', startDate: '2026-08-09', endDate: '2026-08-09', createdAt: '2026-08-01T00:00:00.000Z' }]
    const daily = selectDailyOccupancy(rooms, operationalStates, bookingViews, dates, closures)
    const [roomOne] = selectRoomTimelines(rooms, operationalStates, bookingViews, dates, closures)

    expect(daily[1]).toMatchObject({ occupied: 1, capacity: 0, availablePlaces: 0, level: 'unavailable', isClosed: true })
    expect(roomOne.segments[1]).toMatchObject({ isClosed: true, bookings: [expect.objectContaining({ id: 'booking-1' })] })
  })

  it('classifies load levels with a separate unavailable state', () => {
    expect(occupancyLevelFor(0, 0)).toBe('unavailable')
    expect(occupancyLevelFor(10, 4)).toBe('low')
    expect(occupancyLevelFor(10, 5)).toBe('medium')
    expect(occupancyLevelFor(10, 8)).toBe('high')
    expect(occupancyLevelFor(10, 10)).toBe('full')
    expect(occupancyLevelFor(10, 11)).toBe('overbooked')
  })
})

describe('room occupancy for a requested period', () => {
  const bookingViews = selectBookingViews(bookings, pets, customers, rooms)

  it('reports the peak occupancy of the room across a requested stay', () => {
    const occupancy = selectRoomOccupancyForPeriod(rooms[0], bookingViews, '2026-08-08', '2026-08-11')

    expect(occupancy).toEqual({
      roomId: 'room-1',
      capacity: 1,
      peakOccupied: 1,
      peakDate: '2026-08-09',
      availablePlaces: 0
    })
  })

  it('ignores existing bookings outside the requested period and checked-out stays', () => {
    const outsideRange = selectRoomOccupancyForPeriod(rooms[0], bookingViews, '2026-08-11', '2026-08-14')
    expect(outsideRange).toEqual({
      roomId: 'room-1',
      capacity: 1,
      peakOccupied: 0,
      peakDate: null,
      availablePlaces: 1
    })

    const checkedOut = selectBookingViews([{ ...bookings[0], status: 'checked-out' }], pets, customers, rooms)
    const withCheckedOut = selectRoomOccupancyForPeriod(rooms[0], checkedOut, '2026-08-08', '2026-08-11')
    expect(withCheckedOut.peakOccupied).toBe(0)
  })
})

describe('check-in/out history selector', () => {
  it('resolves bookings, excludes orphaned events and sorts newest events first', () => {
    const bookingViews = selectBookingViews(bookings, pets, customers, rooms)
    const events: CheckInOutEvent[] = [
      { id: 'cio-2', bookingId: 'booking-1', type: 'check-out', occurredAt: '2026-08-10T10:00:00.000Z' },
      { id: 'cio-10', bookingId: 'booking-1', type: 'check-in', occurredAt: '2026-08-10T10:00:00.000Z' },
      { id: 'cio-1', bookingId: 'missing', type: 'check-in', occurredAt: '2026-08-11T10:00:00.000Z' },
      { id: 'cio-3', bookingId: 'booking-1', type: 'check-in-reverted', occurredAt: '2026-08-09T10:00:00.000Z' }
    ]

    const history = selectCheckInOutHistory(events, bookingViews)

    expect(history.map((event) => event.id)).toEqual(['cio-10', 'cio-2', 'cio-3'])
    expect(history[0].booking).toMatchObject({ id: 'booking-1', pet: { name: 'Balu' } })
  })
})
