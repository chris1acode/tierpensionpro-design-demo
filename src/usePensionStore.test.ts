import { describe, expect, it } from 'vitest'
import { createPensionStore } from './usePensionStore'

const completedChecklist = {
  belongingsReturned: true,
  medicationReturned: true,
  roomChecked: true
}

describe('PensionStore', () => {
  it('uses the injected clock for persisted checkout timestamps', () => {
    const now = new Date('2026-08-09T18:30:00.000Z')
    const store = createPensionStore({ now: () => now })

    const departure = store.departures.value.find((booking) => booking.id === 'b-5')
    expect(departure).toBeDefined()
    expect(store.completeCheckout(departure!.id, completedChecklist)).toBe(true)
    expect(departure!.handover.completedAt).toBe(now.toISOString())

  })

  it('resolves booking references to pet, customer and room', () => {
    const store = createPensionStore()
    const balu = store.bookingViews.value.find((booking) => booking.pet.name === 'Balu')
    expect(balu?.customer.lastName).toBe('Berger')
    expect(balu?.room.name).toBe('Waldzimmer 1')
  })

  it('groups pets and booking history into customer views', () => {
    const store = createPensionStore()
    const sofia = store.customerViews.value.find((customer) => customer.id === 'c-1')

    expect(sofia?.pets.map((pet) => pet.name)).toEqual(['Balu'])
    expect(sofia?.bookings.map((booking) => booking.id)).toEqual(['b-1'])
    expect(store.customerViews.value.map((customer) => customer.lastName)).toEqual([
      'Albrecht', 'Bauer', 'Berger', 'Fischer', 'Hoffmann', 'Klein', 'Koch', 'Krüger',
      'Neumann', 'Richter', 'Schulz', 'Vogel'
    ])
    expect(store.customerViews.value).toHaveLength(12)
    expect(store.customerViews.value.every((customer) => customer.pets.length > 0)).toBe(true)
    expect(store.customerViews.value.every((customer) => customer.bookings.length > 0)).toBe(true)
  })

  it('creates a pet for an existing customer and rejects incomplete or unknown assignments', () => {
    const store = createPensionStore()

    expect(store.createPet({ customerId: 'c-1', name: '  Kiwi ', species: 'cat', breed: ' Hauskatze ', note: '  Schreckhaft  ' })).toBe(true)
    expect(store.customerViews.value.find((customer) => customer.id === 'c-1')?.pets.at(-1)).toMatchObject({
      id: 'p-13', customerId: 'c-1', name: 'Kiwi', species: 'cat', breed: 'Hauskatze', initials: 'KI', note: 'Schreckhaft'
    })
    expect(store.announcement.value).toBe('Kiwi wurde im Kundenprofil angelegt.')
    expect(store.createPet({ customerId: 'missing', name: 'Momo', species: 'dog', breed: 'Pudel' })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: '', species: 'dog', breed: 'Pudel' })).toBe(false)
    expect(store.pets).toHaveLength(13)
  })

  it('creates a normalized customer and rejects invalid or duplicate phone contacts', () => {
    const store = createPensionStore()

    expect(store.createCustomer({ firstName: '  Ada ', lastName: ' Lovelace  ', phone: '+49 151 2345678' })).toBe(true)
    expect(store.customers.at(-1)).toEqual({ id: 'c-13', firstName: 'Ada', lastName: 'Lovelace', phone: '+49 151 2345678' })
    expect(store.customerViews.value.find((customer) => customer.id === 'c-13')).toMatchObject({ pets: [], bookings: [] })
    expect(store.announcement.value).toBe('Ada Lovelace wurde im Kundenverzeichnis angelegt.')

    expect(store.createCustomer({ firstName: 'Grace', lastName: 'Hopper', phone: '+49 (151) 2345678' })).toBe(false)
    expect(store.createCustomer({ firstName: '', lastName: 'Hopper', phone: '01512345679' })).toBe(false)
    expect(store.createCustomer({ firstName: 'Grace', lastName: 'Hopper', phone: 'abc' })).toBe(false)
    expect(store.customers).toHaveLength(13)
  })

  it('moves a confirmed arrival into the checked-in guests', () => {
    const store = createPensionStore()
    const arrivalCount = store.arrivals.value.length
    const guestCount = store.checkedIn.value.length
    expect(store.checkIn('b-1')).toBe(true)
    expect(store.arrivals.value).toHaveLength(arrivalCount - 1)
    expect(store.checkedIn.value).toHaveLength(guestCount + 1)
    expect(store.announcement.value).toBe('Balu ist jetzt eingecheckt.')
  })

  it('shows only confirmed bookings for the current business day as arrivals', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    expect(store.arrivals.value.map((booking) => booking.id)).toEqual(['b-1', 'b-2'])
    expect(store.arrivals.value.some((booking) => booking.id === 'b-4')).toBe(false)
  })

  it('creates a referentially valid booking and rejects invalid room assignments', () => {
    const store = createPensionStore()
    const bookingCount = store.bookingViews.value.length

    expect(store.createBooking({ customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18' })).toBe(true)
    expect(store.bookingViews.value).toHaveLength(bookingCount + 1)
    expect(store.bookingViews.value.at(-1)).toMatchObject({
      id: 'b-13', status: 'confirmed', pet: { name: 'Frieda' }, room: { name: 'Gartenzimmer 2' }
    })
    expect(store.announcement.value).toBe('Die Buchung für Frieda wurde angelegt.')

    expect(store.createBooking({ customerId: 'c-7', petId: 'p-7', roomId: 'r-1', arrivalDate: '2026-08-15', arrival: '10:00', departure: '2026-08-19' })).toBe(false)
    expect(store.createBooking({ customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '10:00', departure: '2026-08-19' })).toBe(false)
    expect(store.bookingViews.value).toHaveLength(bookingCount + 1)
  })

  it('rejects a booking when the selected pet does not belong to the selected customer', () => {
    const store = createPensionStore()

    expect(store.createBooking({
      customerId: 'c-7',
      petId: 'p-6',
      roomId: 'r-2',
      arrivalDate: '2026-08-15',
      arrival: '12:15',
      departure: '2026-08-18'
    })).toBe(false)
    expect(store.bookingViews.value).toHaveLength(12)
  })

  it('rejects a booking whose departure precedes its arrival', () => {
    const store = createPensionStore()

    expect(store.createBooking({
      customerId: 'c-6',
      petId: 'p-6',
      roomId: 'r-2',
      arrivalDate: '2026-08-20',
      arrival: '12:15',
      departure: '2026-08-18'
    })).toBe(false)
    expect(store.bookingViews.value).toHaveLength(12)
  })

  it('rejects repeated check-ins without changing derived state', () => {
    const store = createPensionStore()
    expect(store.checkIn('b-1')).toBe(true)
    const arrivalCount = store.arrivals.value.length
    const guestCount = store.checkedIn.value.length

    expect(store.checkIn('b-1')).toBe(false)
    expect(store.arrivals.value).toHaveLength(arrivalCount)
    expect(store.checkedIn.value).toHaveLength(guestCount)
    expect(store.announcement.value).toBe('Balu ist jetzt eingecheckt.')
  })

  it('rejects unknown booking ids without changing state', () => {
    const store = createPensionStore()
    const bookingCount = store.bookingViews.value.length

    expect(store.checkIn('does-not-exist')).toBe(false)
    expect(store.bookingViews.value).toHaveLength(bookingCount)
  })

  it('rejects check-in when the assigned room is at capacity', () => {
    const store = createPensionStore()

    const assignedRoom = store.bookingViews.value.find((booking) => booking.id === 'b-1')?.room
    expect(assignedRoom).toBeDefined()
    assignedRoom!.capacity = 1

    expect(store.checkIn('b-1')).toBe(false)
    expect(store.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(true)
    expect(store.checkedIn.value.filter((booking) => booking.roomId === 'r-1')).toHaveLength(1)
  })

  it('restores booking states after resetting the demo', () => {
    const store = createPensionStore()
    store.checkIn('b-1')
    store.setRoomOperationalStatus('r-3', 'maintenance')

    store.resetDemo()

    expect(store.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(true)
    expect(store.checkedIn.value.some((booking) => booking.id === 'b-1')).toBe(false)
    expect(store.roomViews.value.find((room) => room.id === 'r-3')?.operationalState.status).toBe('ready')
    expect(store.announcement.value).toBe('Die Demo-Daten wurden zurückgesetzt.')
  })

  it('derives occupancy and category capacities from room data', () => {
    const store = createPensionStore()
    expect(store.totalCapacity.value).toBe(7)
    expect(store.occupancyRate.value).toBe(29)
    expect(store.occupancyByCategory.value).toEqual([
      { category: 'Hundezimmer', occupied: 2, capacity: 4 },
      { category: 'Katzenzimmer', occupied: 0, capacity: 3 }
    ])
    expect(store.roomViews.value.find((room) => room.id === 'r-3')).toMatchObject({
      capacity: 2,
      availablePlaces: 2,
      guests: []
    })
  })

  it('persists room availability and excludes blocked rooms from operations', () => {
    const now = new Date('2026-08-09T19:45:00.000Z')
    const store = createPensionStore({ now: () => now })

    expect(store.setRoomOperationalStatus('r-3', 'maintenance', '  Türschloss prüfen  ')).toBe(true)
    expect(store.roomViews.value.find((room) => room.id === 'r-3')).toMatchObject({
      availablePlaces: 0,
      operationalState: { status: 'maintenance', note: 'Türschloss prüfen', updatedAt: now.toISOString() }
    })
    expect(store.totalCapacity.value).toBe(5)
    expect(store.occupancyByCategory.value).toContainEqual({ category: 'Katzenzimmer', occupied: 0, capacity: 1 })
    expect(store.checkIn('b-2')).toBe(false)
    expect(store.createBooking({ customerId: 'c-7', petId: 'p-7', roomId: 'r-3', arrivalDate: '2026-08-15', arrival: '10:00', departure: '2026-08-20' })).toBe(false)

    expect(store.setRoomOperationalStatus('r-3', 'ready')).toBe(true)
    expect(store.roomViews.value.find((room) => room.id === 'r-3')?.availablePlaces).toBe(2)
  })

  it('does not allow occupied or unknown rooms to be blocked', () => {
    const store = createPensionStore()

    expect(store.setRoomOperationalStatus('r-1', 'maintenance')).toBe(false)
    expect(store.setRoomOperationalStatus('missing', 'maintenance')).toBe(false)
    expect(store.roomViews.value.find((room) => room.id === 'r-1')?.operationalState.status).toBe('ready')
  })

  it('creates isolated store instances', () => {
    const firstStore = createPensionStore()
    const secondStore = createPensionStore()

    expect(firstStore.checkIn('b-1')).toBe(true)
    expect(firstStore.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(false)
    expect(secondStore.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(true)
    expect(secondStore.announcement.value).toBe('')
  })

  it('isolates referenced customer, pet and room data between store instances', () => {
    const firstStore = createPensionStore()
    const secondStore = createPensionStore()
    const firstBooking = firstStore.bookingViews.value.find((booking) => booking.id === 'b-1')

    expect(firstBooking).toBeDefined()
    firstBooking!.pet.name = 'Geänderter Name'
    firstBooking!.customer.lastName = 'Geänderter Nachname'
    firstBooking!.room.name = 'Geändertes Zimmer'

    const secondBooking = secondStore.bookingViews.value.find((booking) => booking.id === 'b-1')
    expect(secondBooking?.pet.name).toBe('Balu')
    expect(secondBooking?.customer.lastName).toBe('Berger')
    expect(secondBooking?.room.name).toBe('Waldzimmer 1')
  })

  it('restores referenced demo data when resetting the store', () => {
    const store = createPensionStore()
    const booking = store.bookingViews.value.find((item) => item.id === 'b-1')

    expect(booking).toBeDefined()
    booking!.pet.name = 'Geänderter Name'
    booking!.customer.lastName = 'Geänderter Nachname'
    booking!.room.name = 'Geändertes Zimmer'

    store.resetDemo()

    const restoredBooking = store.bookingViews.value.find((item) => item.id === 'b-1')
    expect(restoredBooking?.pet.name).toBe('Balu')
    expect(restoredBooking?.customer.lastName).toBe('Berger')
    expect(restoredBooking?.room.name).toBe('Waldzimmer 1')
  })

  it('only completes a checkout after every handover item is confirmed', () => {
    const store = createPensionStore()
    const departure = store.departures.value.find((item) => item.id === 'b-5')

    expect(departure).toBeDefined()
    expect(store.completeCheckout('b-5', {
      ...completedChecklist,
      roomChecked: false
    })).toBe(false)
    expect(departure!.handover).toMatchObject({
      belongingsReturned: false,
      medicationReturned: false,
      roomChecked: false
    })

    expect(store.completeCheckout('b-5', completedChecklist)).toBe(true)
    expect(store.departures.value).toHaveLength(0)
    expect(store.checkedIn.value.some((booking) => booking.id === 'b-5')).toBe(false)
    expect(departure!.handover.completedAt).toBeTruthy()
    expect(store.announcement.value).toBe('Rocky wurde ausgecheckt. Das Zimmer ist wieder frei.')
  })

  it('restores checkout handovers when resetting the demo', () => {
    const store = createPensionStore()
    const departure = store.departures.value[0]
    store.completeCheckout(departure.id, completedChecklist)

    store.resetDemo()

    expect(store.departures.value).toHaveLength(1)
    expect(store.departures.value[0].handover).toMatchObject({
      belongingsReturned: false,
      medicationReturned: false,
      roomChecked: false
    })
    expect(store.departures.value[0].handover).not.toHaveProperty('completedAt')
  })

  it('validates, saves and resets pension settings', () => {
    const store = createPensionStore()
    const changed = { ...store.settings, businessName: 'Tierhotel Waldpfote', checkInFrom: '09:00' }
    const { id: _id, ...update } = changed

    expect(store.updateSettings(update)).toBe(true)
    expect(store.settings.businessName).toBe('Tierhotel Waldpfote')
    expect(store.announcement.value).toBe('Die Einstellungen wurden gespeichert.')
    expect(store.updateSettings({ ...update, contactEmail: 'ungueltig' })).toBe(false)
    expect(store.settings.contactEmail).toBe('hallo@tierpension-pro.de')

    store.resetDemo()
    expect(store.settings).toMatchObject({ businessName: 'Tierpension Pro', checkInFrom: '08:00' })
  })
})
