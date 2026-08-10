import { describe, expect, it } from 'vitest'
import type { Booking, BookingView, Pet, RoomView } from '../domain'
import { getRequestAvailability, getRequestRoomOptions, hasRoomCapacityForStay, selectAvailableRoomsForBooking, selectRoomBookingAvailability } from './roomAvailability'

const bookings: Booking[] = [
  { id: 'b-1', petId: 'p-1', roomId: 'r-1', arrivalDate: '2026-08-10', arrival: '09:00', departure: '2026-08-13', status: 'confirmed' },
  { id: 'b-2', petId: 'p-2', roomId: 'r-1', arrivalDate: '2026-08-11', arrival: '10:00', departure: '2026-08-12', status: 'checked-out' },
  { id: 'b-3', petId: 'p-3', roomId: 'r-2', arrivalDate: '2026-08-10', arrival: '09:00', departure: '2026-08-13', status: 'confirmed' }
]

describe('room availability', () => {
  it('rejects a stay when any occupied night has reached room capacity', () => {
    expect(hasRoomCapacityForStay(bookings, 'r-1', 1, '2026-08-11', '2026-08-14')).toBe(false)
  })

  it('allows a stay outside the occupied period and ignores checked-out bookings', () => {
    expect(hasRoomCapacityForStay(bookings, 'r-1', 1, '2026-08-13', '2026-08-15')).toBe(true)
    expect(hasRoomCapacityForStay(bookings, 'r-1', 1, '2026-08-11', '2026-08-12')).toBe(false)
    expect(hasRoomCapacityForStay([bookings[1]], 'r-1', 1, '2026-08-11', '2026-08-12')).toBe(true)
  })

  it('treats the checkout day as free for a subsequent stay', () => {
    expect(hasRoomCapacityForStay(bookings, 'r-1', 1, '2026-08-13', '2026-08-14')).toBe(true)
  })

  it('rejects invalid stay dates and unavailable rooms', () => {
    expect(hasRoomCapacityForStay(bookings, 'r-1', 1, '2026-02-30', '2026-03-01')).toBe(false)
    expect(hasRoomCapacityForStay(bookings, 'r-1', 0, '2026-08-13', '2026-08-14')).toBe(false)
  })

  it('reserves enough capacity for every animal in a shared reservation', () => {
    expect(hasRoomCapacityForStay([], 'r-1', 2, '2026-08-13', '2026-08-15', 2)).toBe(true)
    expect(hasRoomCapacityForStay(bookings, 'r-1', 2, '2026-08-11', '2026-08-12', 2)).toBe(false)
    expect(hasRoomCapacityForStay([], 'r-1', 2, '2026-08-13', '2026-08-15', 0)).toBe(false)
  })

  it('selects only operational, species-compatible rooms with capacity for the full stay', () => {
    const pet: Pet = { id: 'p-1', customerId: 'c-1', name: 'Mika', species: 'cat', breed: 'EKH', initials: 'M', color: '#fff' }
    const rooms: RoomView[] = [
      { id: 'r-ready', name: 'Katzenloft', category: 'Katzenzimmer', capacity: 2, availablePlaces: 2, guests: [], operationalState: { id: 'os-1', roomId: 'r-ready', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' } },
      { id: 'r-full', name: 'Katzennest', category: 'Katzenzimmer', capacity: 1, availablePlaces: 0, guests: [], operationalState: { id: 'os-2', roomId: 'r-full', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' } },
      { id: 'r-maintenance', name: 'Katzenruhe', category: 'Katzenzimmer', capacity: 2, availablePlaces: 2, guests: [], operationalState: { id: 'os-3', roomId: 'r-maintenance', status: 'maintenance', updatedAt: '2026-08-09T00:00:00.000Z' } },
      { id: 'r-dog', name: 'Hundehof', category: 'Hundezimmer', capacity: 2, availablePlaces: 2, guests: [], operationalState: { id: 'os-4', roomId: 'r-dog', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' } }
    ]
    const bookingViews: BookingView[] = [{
      ...bookings[0], roomId: 'r-full',
      pet: { ...pet, id: 'p-booked' }, customer: { id: 'c-1', firstName: 'Kim', lastName: 'Muster', email: 'kim@example.de', phone: '123' }, room: rooms[1]
    }]

    expect(selectAvailableRoomsForBooking(rooms, bookingViews, pet, '2026-08-11', '09:00', '2026-08-12').map((room) => room.id)).toEqual(['r-ready'])
    expect(selectAvailableRoomsForBooking(rooms, bookingViews, pet, '2026-02-30', '09:00', '2026-03-01')).toEqual([])
  })

  it('requires only species information, so booking requests reuse the central availability policy', () => {
    const catRequest = { species: 'cat' as const }
    const rooms: RoomView[] = [
      { id: 'r-cat', name: 'Katzenloft', category: 'Katzenzimmer', capacity: 1, availablePlaces: 1, guests: [], operationalState: { id: 'os-1', roomId: 'r-cat', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' } },
      { id: 'r-dog', name: 'Hundehof', category: 'Hundezimmer', capacity: 1, availablePlaces: 1, guests: [], operationalState: { id: 'os-2', roomId: 'r-dog', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' } }
    ]

    expect(selectAvailableRoomsForBooking(rooms, [], catRequest, '2026-08-11', '09:00', '2026-08-12')
      .map((room) => room.id)).toEqual(['r-cat'])
  })

  it('retains full compatible rooms as explicitly marked overbooking options', () => {
    const pet: Pet = { id: 'p-1', customerId: 'c-1', name: 'Mika', species: 'cat', breed: 'EKH', initials: 'M', color: '#fff' }
    const room: RoomView = { id: 'r-full', name: 'Katzennest', category: 'Katzenzimmer', capacity: 1, availablePlaces: 0, guests: [], operationalState: { id: 'os-1', roomId: 'r-full', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' } }
    const bookingViews: BookingView[] = [{
      ...bookings[0], roomId: room.id, pet: { ...pet, id: 'p-booked' },
      customer: { id: 'c-1', firstName: 'Kim', lastName: 'Muster', email: 'kim@example.de', phone: '123' }, room
    }]

    expect(selectRoomBookingAvailability([room], bookingViews, pet, '2026-08-11', '09:00', '2026-08-12'))
      .toMatchObject([{ room: { id: 'r-full' }, availablePlaces: 0, peakOccupied: 1, wouldOverbook: true }])
  })

  it('derives a request status from the same period capacity and closure policies', () => {
    const pet = { species: 'cat' as const }
    const room: RoomView = {
      id: 'r-cat', name: 'Katzenloft', category: 'Katzenzimmer', capacity: 1, availablePlaces: 1, guests: [],
      operationalState: { id: 'os-1', roomId: 'r-cat', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' }
    }
    const bookedRoom: BookingView = {
      ...bookings[0], roomId: room.id, pet: { id: 'p-booked', customerId: 'c-1', name: 'Mika', species: 'cat', breed: 'EKH', initials: 'M', color: '#fff' },
      customer: { id: 'c-1', firstName: 'Kim', lastName: 'Muster', email: 'kim@example.de', phone: '123' }, room
    }

    expect(getRequestAvailability([room], [], pet, '2026-08-14', '09:00', '2026-08-16')).toEqual({
      status: 'available', availableRoomCount: 1, compatibleRoomCount: 1
    })
    expect(getRequestAvailability([room], [bookedRoom], pet, '2026-08-11', '09:00', '2026-08-12')).toEqual({
      status: 'unavailable', availableRoomCount: 0, compatibleRoomCount: 1
    })
    expect(getRequestAvailability([room], [], pet, '2026-08-14', '09:00', '2026-08-16', [
      { id: 'closure-1', startDate: '2026-08-15', endDate: '2026-08-15', createdAt: '2026-08-09T00:00:00.000Z' }
    ])).toEqual({ status: 'closed', availableRoomCount: 0, compatibleRoomCount: 1 })
  })

  it('returns the status and its selectable rooms from one request decision', () => {
    const pet = { species: 'cat' as const }
    const room: RoomView = {
      id: 'r-cat', name: 'Katzenloft', category: 'Katzenzimmer', capacity: 1, availablePlaces: 1, guests: [],
      operationalState: { id: 'os-1', roomId: 'r-cat', status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' }
    }

    expect(getRequestRoomOptions([room], [], pet, '2026-08-14', '09:00', '2026-08-16')).toMatchObject({
      availability: { status: 'available', availableRoomCount: 1, compatibleRoomCount: 1 },
      rooms: [{ id: 'r-cat' }]
    })
  })
})
