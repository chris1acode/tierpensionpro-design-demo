import { effectScope, nextTick, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import type { BookingView, Customer, NewBookingReservation, Pet, RoomView } from '../domain'
import { useReservationDraft } from './useReservationDraft'

const customers: Customer[] = [{ id: 'customer-1', firstName: 'Erika', lastName: 'Muster', phone: '01234' }]
const pets: Pet[] = [{
  id: 'pet-1', customerId: 'customer-1', name: 'Balu', species: 'dog', breed: 'Mischling', initials: 'B', color: '#fff'
}]
const rooms: RoomView[] = [{
  id: 'room-1', name: 'Hof', category: 'Hundezimmer', capacity: 2,
  operationalState: { id: 'state-1', roomId: 'room-1', status: 'ready', updatedAt: '2026-08-09T08:00:00.000Z' },
  guests: [], availablePlaces: 2
}]
const emptyDraft = (): NewBookingReservation => ({
  customerId: '', petIds: [], roomId: '', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-10'
})

describe('useReservationDraft', () => {
  it('shares the available candidates and resets dependent selections after changing the customer', () => {
    const scope = effectScope()
    const reservation = scope.run(() => useReservationDraft({
      customers: reactive(customers.map((customer) => ({ ...customer }))),
      pets: reactive(pets.map((pet) => ({ ...pet }))),
      roomViews: () => rooms,
      bookingViews: () => [] as BookingView[],
      pensionClosures: []
    }, emptyDraft))!

    expect(reservation.availableCustomers.value).toEqual(customers)
    expect(reservation.availablePets.value).toEqual(pets)

    reservation.draft.value.customerId = 'customer-1'
    reservation.draft.value.petIds = ['pet-1']
    reservation.draft.value.roomId = 'room-1'
    reservation.draft.value.allowOverbooking = true
    reservation.selectCustomer()

    expect(reservation.draft.value).toEqual({
      ...emptyDraft(), customerId: 'customer-1', allowOverbooking: false
    })
    scope.stop()
  })

  it('clears a no-longer-available room and restores form defaults explicitly', async () => {
    const scope = effectScope()
    const reservation = scope.run(() => useReservationDraft({
      customers,
      pets,
      roomViews: () => rooms,
      bookingViews: () => [] as BookingView[],
      pensionClosures: []
    }, emptyDraft))!

    reservation.draft.value.petIds = ['pet-1']
    reservation.draft.value.roomId = 'room-1'
    reservation.draft.value.departure = '2026-08-08'
    await nextTick()

    expect(reservation.draft.value.roomId).toBe('')
    reservation.draft.value.customerId = 'customer-1'
    reservation.resetDraft()
    expect(reservation.draft.value).toEqual(emptyDraft())
    scope.stop()
  })
})
