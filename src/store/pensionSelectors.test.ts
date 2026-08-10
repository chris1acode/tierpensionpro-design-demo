import { describe, expect, it } from 'vitest'
import type { Booking, Customer, Pet, Room } from '../domain'
import { selectBookingViews, selectCustomerViews } from './pensionSelectors'

const customers: Customer[] = [
  { id: 'customer-1', firstName: 'Ada', lastName: 'Zeller', phone: '123' },
  { id: 'customer-2', firstName: 'Bea', lastName: 'Albrecht', phone: '456' }
]
const pets: Pet[] = [
  { id: 'pet-1', customerId: 'customer-1', name: 'Balu', species: 'dog', breed: 'Mix', initials: 'BA', color: '#fff' }
]
const rooms: Room[] = [
  { id: 'room-1', name: 'Zimmer 1', category: 'Hundezimmer', capacity: 1 }
]
const bookings: Booking[] = [
  { id: 'booking-1', petId: 'pet-1', roomId: 'room-1', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-10', status: 'confirmed' }
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

  it('reports the affected booking when a reference is invalid', () => {
    expect(() => selectBookingViews(
      [{ ...bookings[0], petId: 'missing' }],
      pets,
      customers,
      rooms
    )).toThrow('Ungültige Referenz in Buchung booking-1')
  })
})
