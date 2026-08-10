import { describe, expect, it } from 'vitest'
import { MAX_ALLERGY_NOTE_LENGTH, MAX_FEEDING_PLAN_LENGTH, MAX_MEDICATION_PLAN_LENGTH, MAX_PET_NOTE_LENGTH, MAX_VACCINATION_STATUS_LENGTH } from './domain/petProfile'
import { createPensionStore } from './usePensionStore'

describe('PensionStore', () => {
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
    expect(store.customerViews.value.map((customer) => customer.lastName)).toEqual(
      [...store.customerViews.value.map((customer) => customer.lastName)].sort((first, second) => first.localeCompare(second, 'de'))
    )
    expect(store.customerViews.value).toHaveLength(100)
    expect(store.customerViews.value.every((customer) => customer.pets.length > 0)).toBe(true)
    expect(store.customerViews.value.every((customer) => customer.bookings.length > 0)).toBe(true)
  })

  it('provides a substantial directory and ten check-in/out stays for the demo day', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    const businessDate = '2026-08-09'

    expect(store.customers).toHaveLength(100)
    expect(store.pets.length).toBeGreaterThanOrEqual(100)
    expect(store.bookingViews.value.filter((booking) =>
      booking.arrivalDate === businessDate || booking.departure === businessDate
    )).toHaveLength(10)
    expect(store.arrivals.value).toHaveLength(5)
    expect(store.departures.value).toHaveLength(1)
  })

  it('creates a pet for an existing customer and rejects incomplete or unknown assignments', () => {
    const store = createPensionStore()

    expect(store.createPet({ customerId: 'c-1', name: '  Kiwi ', species: 'cat', breed: ' Hauskatze ', note: '  Schreckhaft  ', feedingPlan: '  Zweimal täglich  ', medicationPlan: '  Tablette um 18 Uhr ', allergyNote: '  Kein Geflügel  ', vaccinationStatus: '  Impfpass geprüft  ', veterinaryContact: { practiceName: '  Tierarztpraxis am Park ', phone: '030 1234567' } })).toBe(true)
    expect(store.customerViews.value.find((customer) => customer.id === 'c-1')?.pets.at(-1)).toMatchObject({
      id: 'p-102', customerId: 'c-1', name: 'Kiwi', species: 'cat', breed: 'Hauskatze', initials: 'KI', note: 'Schreckhaft', feedingPlan: 'Zweimal täglich', medicationPlan: 'Tablette um 18 Uhr', allergyNote: 'Kein Geflügel', vaccinationStatus: 'Impfpass geprüft', veterinaryContact: { practiceName: 'Tierarztpraxis am Park', phone: '030 1234567' }
    })
    expect(store.announcement.value).toBe('Kiwi wurde im Kundenprofil angelegt.')
    expect(store.createPet({ customerId: 'missing', name: 'Momo', species: 'dog', breed: 'Pudel' })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: '', species: 'dog', breed: 'Pudel' })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', note: 'x'.repeat(MAX_PET_NOTE_LENGTH + 1) })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', medicationPlan: 'x'.repeat(MAX_MEDICATION_PLAN_LENGTH + 1) })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', feedingPlan: 'x'.repeat(MAX_FEEDING_PLAN_LENGTH + 1) })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', allergyNote: 'x'.repeat(MAX_ALLERGY_NOTE_LENGTH + 1) })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', vaccinationStatus: 'x'.repeat(MAX_VACCINATION_STATUS_LENGTH + 1) })).toBe(false)
    expect(store.createPet({ customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', veterinaryContact: { practiceName: 'Praxis', phone: 'unbekannt' } })).toBe(false)
    expect(store.pets).toHaveLength(102)
  })

  it('updates normalized pet master data without changing its booking references', () => {
    const store = createPensionStore()
    const original = store.pets.find((pet) => pet.id === 'p-1')!

    expect(store.updatePet('p-1', { name: '  Balou ', breed: ' Labrador Retriever ', note: '  Benötigt Ruhe  ', feedingPlan: '  Zwei Portionen am Tag  ', medicationPlan: '  Eine Tablette abends  ', allergyNote: '  Kein Rind  ', vaccinationStatus: '  Gültig bis 2027  ', veterinaryContact: { practiceName: ' Tierarztpraxis Mitte ', phone: '030 7654321' } })).toBe(true)
    expect(store.pets.find((pet) => pet.id === 'p-1')).toMatchObject({
      id: 'p-1', customerId: original.customerId, species: original.species,
      name: 'Balou', breed: 'Labrador Retriever', note: 'Benötigt Ruhe', feedingPlan: 'Zwei Portionen am Tag', medicationPlan: 'Eine Tablette abends', allergyNote: 'Kein Rind', vaccinationStatus: 'Gültig bis 2027', veterinaryContact: { practiceName: 'Tierarztpraxis Mitte', phone: '030 7654321' }
    })
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-1')?.pet.name).toBe('Balou')
    expect(store.updatePet('p-1', { name: '', breed: 'Labrador' })).toBe(false)
    expect(store.updatePet('p-1', { name: 'Balu', breed: 'Labrador', note: 'x'.repeat(MAX_PET_NOTE_LENGTH + 1) })).toBe(false)
    expect(store.updatePet('p-1', { name: 'Balu', breed: 'Labrador', medicationPlan: 'x'.repeat(MAX_MEDICATION_PLAN_LENGTH + 1) })).toBe(false)
    expect(store.updatePet('p-1', { name: 'Balu', breed: 'Labrador', feedingPlan: 'x'.repeat(MAX_FEEDING_PLAN_LENGTH + 1) })).toBe(false)
    expect(store.updatePet('p-1', { name: 'Balu', breed: 'Labrador', allergyNote: 'x'.repeat(MAX_ALLERGY_NOTE_LENGTH + 1) })).toBe(false)
    expect(store.updatePet('p-1', { name: 'Balu', breed: 'Labrador', vaccinationStatus: 'x'.repeat(MAX_VACCINATION_STATUS_LENGTH + 1) })).toBe(false)
    expect(store.updatePet('p-1', { name: 'Balu', breed: 'Labrador', veterinaryContact: { practiceName: 'Praxis', phone: 'unbekannt' } })).toBe(false)
    expect(store.updatePet('missing', { name: 'Momo', breed: 'Pudel' })).toBe(false)
  })

  it('removes only pet profiles without stays and preserves historical references', () => {
    const store = createPensionStore()
    expect(store.createPet({ customerId: 'c-1', name: 'Kiwi', species: 'cat', breed: 'Hauskatze' })).toBe(true)

    expect(store.removePet('p-102')).toBe(true)
    expect(store.pets.some((pet) => pet.id === 'p-102')).toBe(false)
    expect(store.announcement.value).toBe('Kiwi wurde aus dem Kundenprofil entfernt.')
    expect(store.removePet('p-1')).toBe(false)
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-1')?.pet.id).toBe('p-1')
    expect(store.removePet('missing')).toBe(false)
  })

  it('removes only an existing veterinary contact without changing the pet profile', () => {
    const store = createPensionStore()
    const original = store.pets.find((pet) => pet.id === 'p-1')!

    expect(store.removePetVeterinaryContact('p-1')).toBe(true)
    expect(store.pets.find((pet) => pet.id === 'p-1')).toMatchObject({
      id: original.id, customerId: original.customerId, name: original.name, breed: original.breed
    })
    expect(store.pets.find((pet) => pet.id === 'p-1')?.veterinaryContact).toBeUndefined()
    expect(store.announcement.value).toBe(`Der Tierarztkontakt von ${original.name} wurde entfernt.`)
    expect(store.removePetVeterinaryContact('p-1')).toBe(false)
    expect(store.removePetVeterinaryContact('missing')).toBe(false)
  })

  it('creates a normalized customer and rejects invalid or duplicate contact data', () => {
    const store = createPensionStore()

    expect(store.createCustomer({ firstName: '  Ada ', lastName: ' Lovelace  ', email: ' ADA@EXAMPLE.DE ', phone: '+49 151 2345678' })).toBe(true)
    expect(store.customers.at(-1)).toEqual({ id: 'c-101', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.de', phone: '+49 151 2345678' })
    expect(store.customerViews.value.find((customer) => customer.id === 'c-101')).toMatchObject({ pets: [], bookings: [] })
    expect(store.announcement.value).toBe('Ada Lovelace wurde im Kundenverzeichnis angelegt.')

    expect(store.createCustomer({ firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.de', phone: '+49 (151) 2345678' })).toBe(false)
    expect(store.createCustomer({ firstName: '', lastName: 'Hopper', email: 'grace@example.de', phone: '01512345679' })).toBe(false)
    expect(store.createCustomer({ firstName: 'Grace', lastName: 'Hopper', email: 'not-an-email', phone: '01512345679' })).toBe(false)
    expect(store.createCustomer({ firstName: 'Grace', lastName: 'Hopper', email: 'ada@example.de', phone: '01512345679' })).toBe(false)
    expect(store.createCustomer({ firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.de', phone: 'abc' })).toBe(false)
    expect(store.customers).toHaveLength(101)
  })

  it('removes only customer profiles without animals or booking references', () => {
    const store = createPensionStore()
    expect(store.createCustomer({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.de', phone: '+49 151 2345678' })).toBe(true)

    expect(store.removeCustomer('c-101')).toBe(true)
    expect(store.customers.some((customer) => customer.id === 'c-101')).toBe(false)
    expect(store.announcement.value).toBe('Ada Lovelace wurde aus dem Kundenverzeichnis entfernt.')
    expect(store.removeCustomer('c-1')).toBe(false)
    expect(store.removeCustomer('missing')).toBe(false)
    expect(store.customerViews.value.find((customer) => customer.id === 'c-1')?.pets).toHaveLength(1)
  })

  it('updates customer contact data without losing booking links', () => {
    const store = createPensionStore()

    expect(store.updateCustomer('c-1', {
      firstName: '  Sophie ', lastName: ' Berger ', email: ' SOPHIE.BERGER@EXAMPLE.DE ', phone: ' 0176 445 21 92 '
    })).toBe(true)
    expect(store.customers.find((customer) => customer.id === 'c-1')).toMatchObject({
      id: 'c-1', firstName: 'Sophie', lastName: 'Berger', email: 'sophie.berger@example.de', phone: '0176 445 21 92'
    })
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-1')?.customer.firstName).toBe('Sophie')
    expect(store.announcement.value).toBe('Sophie Berger wurde im Kundenprofil aktualisiert.')

    expect(store.updateCustomer('c-1', {
      firstName: 'Sophie', lastName: 'Berger', email: 'mara.hoffmann@example.de', phone: '0176 445 21 92'
    })).toBe(false)
    expect(store.updateCustomer('missing', {
      firstName: 'Sophie', lastName: 'Berger', email: 'sophie.berger@example.de', phone: '0176 445 21 92'
    })).toBe(false)
  })

  it('keeps confirmations as dismissible, structured toast notifications', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T10:00:00.000Z') })

    expect(store.createCustomer({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.de', phone: '+49 151 2345678' })).toBe(true)
    expect(store.createPet({ customerId: 'c-1', name: 'Kiwi', species: 'cat', breed: 'Hauskatze' })).toBe(true)
    expect(store.toastNotifications).toMatchObject([
      { id: 'toast-1', message: 'Ada Lovelace wurde im Kundenverzeichnis angelegt.', createdAt: '2026-08-09T10:00:00.000Z' },
      { id: 'toast-2', message: 'Kiwi wurde im Kundenprofil angelegt.', createdAt: '2026-08-09T10:00:00.000Z' }
    ])

    store.dismissToast('toast-1')
    expect(store.toastNotifications).toMatchObject([{ id: 'toast-2' }])

    store.resetDemo()
    expect(store.toastNotifications).toMatchObject([{ id: 'toast-1', message: 'Die Demo-Daten wurden zurückgesetzt.' }])
  })

  it('moves a confirmed arrival into the checked-in guests', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    const arrivalCount = store.arrivals.value.length
    const guestCount = store.checkedIn.value.length
    expect(store.checkIn('b-1')).toBe(true)
    expect(store.arrivals.value).toHaveLength(arrivalCount - 1)
    expect(store.checkedIn.value).toHaveLength(guestCount + 1)
    expect(store.announcement.value).toBe('Balu ist jetzt eingecheckt.')
    expect(store.checkInOutHistory.value[0]).toMatchObject({ bookingId: 'b-1', type: 'check-in', occurredAt: '2026-08-09T10:00:00.000Z', booking: { id: 'b-1' } })
  })

  it('only checks in confirmed bookings on their arrival date', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    const tomorrowBooking = store.bookingViews.value.find((booking) => booking.id === 'b-4')!

    expect(tomorrowBooking.arrivalDate).toBe('2026-08-10')
    expect(store.checkIn(tomorrowBooking.id)).toBe(false)
    expect(tomorrowBooking.status).toBe('confirmed')
    expect(store.checkInOutHistory.value.some((event) => event.bookingId === tomorrowBooking.id)).toBe(false)
  })

  it('reverts a same-day check-in and records the reversal in the history', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T10:00:00.000Z') })
    const initialHistoryLength = store.checkInOutHistory.value.length

    expect(store.checkIn('b-1')).toBe(true)
    expect(store.canUndoCheckIn('b-1')).toBe(true)
    expect(store.undoCheckIn('b-1')).toBe(true)
    expect(store.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(true)
    expect(store.checkedIn.value.some((booking) => booking.id === 'b-1')).toBe(false)
    expect(store.checkInOutHistory.value[0]).toMatchObject({ bookingId: 'b-1', type: 'check-in-reverted', occurredAt: '2026-08-09T10:00:00.000Z' })
    expect(store.checkInOutHistory.value).toHaveLength(initialHistoryLength + 2)
    expect(store.announcement.value).toBe('Der Check-in von Balu wurde rückgängig gemacht.')
  })

  it('only permits undoing the latest same-day check-in', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T10:00:00.000Z') })

    expect(store.canUndoCheckIn('b-5')).toBe(false)
    expect(store.undoCheckIn('b-5')).toBe(false)
    expect(store.undoCheckIn('b-1')).toBe(false)
  })

  it('records completed check-outs and restores the mock history on reset', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T16:30:00.000Z') })
    const initialHistoryLength = store.checkInOutHistory.value.length

    expect(store.checkOut('b-5')).toBe(true)
    expect(store.checkInOutHistory.value[0]).toMatchObject({ bookingId: 'b-5', type: 'check-out', occurredAt: '2026-08-09T16:30:00.000Z' })
    expect(store.checkInOutHistory.value).toHaveLength(initialHistoryLength + 1)
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-5')?.checkoutPrice).toEqual({
      bookingId: 'b-5', dailyRateCents: 3500, billableDays: 2, totalCents: 7000
    })

    store.settings.dailyPetRates[0].amountCents = 9999
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-5')?.checkoutPrice?.totalCents).toBe(7000)

    store.resetDemo()
    expect(store.checkInOutHistory.value).toHaveLength(initialHistoryLength)
    expect(store.checkInOutHistory.value.some((event) => event.occurredAt === '2026-08-09T16:30:00.000Z')).toBe(false)
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-5')?.checkoutPrice).toBeUndefined()
  })

  it('shows only confirmed bookings for the current business day as arrivals', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    expect(store.arrivals.value.map((booking) => booking.id)).toEqual(['b-1', 'b-2', 'b-13', 'b-14', 'b-15'])
    expect(store.arrivals.value.some((booking) => booking.id === 'b-4')).toBe(false)
  })

  it('creates a referentially valid booking and rejects invalid room assignments', () => {
    const store = createPensionStore()
    const bookingCount = store.bookingViews.value.length

    expect(store.createBooking({ customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18', pickupTime: '15:30', bookingNote: '  Medikament mittags geben  ' })).toBe(true)
    expect(store.bookingViews.value).toHaveLength(bookingCount + 1)
    expect(store.bookingViews.value.at(-1)).toMatchObject({
      id: 'b-101', status: 'confirmed', pickupTime: '15:30', bookingNote: 'Medikament mittags geben', pet: { name: 'Frieda' }, room: { name: 'Gartenzimmer 2' }
    })
    expect(store.announcement.value).toBe('Die Buchung für Frieda wurde angelegt.')

    expect(store.createBooking({ customerId: 'c-7', petId: 'p-7', roomId: 'r-1', arrivalDate: '2026-08-15', arrival: '10:00', departure: '2026-08-19' })).toBe(false)
    expect(store.createBooking({ customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '10:00', departure: '2026-08-19' })).toBe(false)
    expect(store.bookingViews.value).toHaveLength(bookingCount + 1)
  })

  it('updates a planned booking without counting the stay against its own room capacity', () => {
    const store = createPensionStore()

    expect(store.updateBooking('b-1', {
      roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '10:30', departure: '2026-08-12', pickupTime: '16:00', bookingNote: '  Ruhiger Abschied  '
    })).toBe(true)
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-1')).toMatchObject({
      room: { id: 'r-1' }, arrival: '10:30', departure: '2026-08-12', pickupTime: '16:00', bookingNote: 'Ruhiger Abschied', status: 'confirmed', overbooked: false
    })
    expect(store.announcement.value).toBe('Die Buchung für Balu wurde aktualisiert.')
  })

  it('rejects an invalid optional collection time before persisting a booking', () => {
    const store = createPensionStore()

    expect(store.createBooking({
      customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18', pickupTime: 'after lunch'
    })).toBe(false)
    expect(store.updateBooking('b-1', {
      roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '10:30', departure: '2026-08-12', pickupTime: '99:99'
    })).toBe(false)
  })

  it('rejects oversized booking notes before changing an existing stay', () => {
    const store = createPensionStore()
    const originalNote = store.bookingViews.value.find((booking) => booking.id === 'b-1')?.bookingNote

    expect(store.updateBooking('b-1', {
      roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '10:30', departure: '2026-08-12', bookingNote: 'x'.repeat(301)
    })).toBe(false)
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-1')?.bookingNote).toBe(originalNote)
  })

  it('protects started stays and requires acknowledgement for an overbooked booking update', () => {
    const store = createPensionStore()
    store.rooms.find((room) => room.id === 'r-1')!.capacity = 1

    expect(store.updateBooking('b-1', {
      roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-12'
    })).toBe(false)
    expect(store.updateBooking('b-1', {
      roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-12', allowOverbooking: true
    })).toBe(true)
    expect(store.bookingViews.value.find((booking) => booking.id === 'b-1')?.overbooked).toBe(true)
    const startedStore = createPensionStore()
    expect(startedStore.checkIn('b-1')).toBe(true)
    expect(startedStore.updateBooking('b-1', {
      roomId: 'r-1', arrivalDate: '2026-08-10', arrival: '09:00', departure: '2026-08-12', allowOverbooking: true
    })).toBe(false)
  })

  it('uses the same period capacity rule for direct bookings and accepted requests', () => {
    const store = createPensionStore()
    const room = store.rooms.find((item) => item.id === 'r-2')!
    room.capacity = 1

    expect(store.createBooking({
      customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18'
    })).toBe(true)
    expect(store.acceptRequest('req-1', 'r-2', 'new')).toBe(false)
    expect(store.pendingRequests.value.some((request) => request.id === 'req-1')).toBe(true)
  })

  it('only creates an overbooking after explicit acknowledgement and records it on the stay', () => {
    const store = createPensionStore()
    store.rooms.find((item) => item.id === 'r-2')!.capacity = 1
    const input = { customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18' }

    expect(store.createBooking(input)).toBe(true)
    expect(store.createBooking({ ...input, petId: 'p-13' })).toBe(false)
    expect(store.createBooking({ ...input, petId: 'p-13', allowOverbooking: true })).toBe(true)
    expect(store.bookingViews.value.at(-1)).toMatchObject({ pet: { name: 'Willi' }, overbooked: true })
    expect(store.announcement.value).toBe('Die Buchung für Willi wurde als Überbuchung angelegt.')
  })

  it('creates a multi-animal reservation atomically and links its individual stays', () => {
    const store = createPensionStore()
    const bookingCount = store.bookingViews.value.length

    expect(store.createBookingReservation({
      customerId: 'c-6', petIds: ['p-6', 'p-13'], roomId: 'r-2',
      arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18'
    })).toBe(true)
    expect(store.bookingViews.value).toHaveLength(bookingCount + 2)
    expect(store.bookingReservations).toHaveLength(1)
    expect(store.bookingReservations[0]).toMatchObject({ id: 'reservation-1', customerId: 'c-6', petIds: ['p-6', 'p-13'] })
    expect(store.bookingViews.value.slice(-2).map((booking) => ({ pet: booking.pet.name, reservationId: booking.reservationId }))).toEqual([
      { pet: 'Frieda', reservationId: 'reservation-1' }, { pet: 'Willi', reservationId: 'reservation-1' }
    ])
    expect(store.announcement.value).toBe('Die gemeinsame Reservierung für Frieda, Willi wurde angelegt.')
  })

  it('normalizes a shared reservation note for the reservation and each animal stay', () => {
    const store = createPensionStore()

    expect(store.createBookingReservation({
      customerId: 'c-6', petIds: ['p-6', 'p-13'], roomId: 'r-2',
      arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18', bookingNote: '  Zusammen unterbringen  '
    })).toBe(true)
    expect(store.bookingReservations[0]).toMatchObject({ bookingNote: 'Zusammen unterbringen' })
    expect(store.bookingViews.value.slice(-2).map((booking) => booking.bookingNote)).toEqual([
      'Zusammen unterbringen', 'Zusammen unterbringen'
    ])
  })

  it('detaches an individually replanned stay from its shared reservation', () => {
    const store = createPensionStore()
    expect(store.createBookingReservation({
      customerId: 'c-6', petIds: ['p-6', 'p-13'], roomId: 'r-2',
      arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18',
      pickupTime: '15:30', bookingNote: 'Zusammen unterbringen'
    })).toBe(true)
    const reservationId = store.bookingReservations[0].id
    const friedasBooking = store.bookingViews.value.slice(-2).find((booking) => booking.pet.id === 'p-6')!

    expect(store.updateBooking(friedasBooking.id, {
      roomId: 'r-1', arrivalDate: '2026-12-16', arrival: '12:15', departure: '2026-12-19',
      pickupTime: '15:30', bookingNote: 'Zusammen unterbringen'
    })).toBe(true)

    expect(store.bookingReservations).toMatchObject([{ id: reservationId, petIds: ['p-13'] }])
    const replannedStay = store.bookingViews.value.find((booking) => booking.id === friedasBooking.id)
    expect(replannedStay).toMatchObject({ arrivalDate: '2026-12-16', departure: '2026-12-19' })
    expect(replannedStay?.reservationId).toBeUndefined()
  })

  it('does not partially create a multi-animal reservation without enough capacity', () => {
    const store = createPensionStore()
    store.rooms.find((room) => room.id === 'r-2')!.capacity = 1
    const bookingCount = store.bookingViews.value.length

    expect(store.createBookingReservation({
      customerId: 'c-6', petIds: ['p-6', 'p-13'], roomId: 'r-2',
      arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18'
    })).toBe(false)
    expect(store.bookingViews.value).toHaveLength(bookingCount)
    expect(store.bookingReservations).toHaveLength(0)
  })

  it('keeps a shared reservation in sync when one of its stays is deleted', () => {
    const store = createPensionStore()

    expect(store.createBookingReservation({
      customerId: 'c-6', petIds: ['p-6', 'p-13'], roomId: 'r-2',
      arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18'
    })).toBe(true)
    const [friedaStay, williStay] = store.bookingViews.value.slice(-2)

    expect(store.deleteBooking(friedaStay!.id)).toBe(true)
    expect(store.bookingReservations).toMatchObject([{ id: 'reservation-1', petIds: ['p-13'] }])

    expect(store.deleteBooking(williStay!.id)).toBe(true)
    expect(store.bookingReservations).toHaveLength(0)
  })

  it('deletes bookings in every stay status and removes their process history', () => {
    const store = createPensionStore()
    const bookingCount = store.bookingViews.value.length

    expect(store.deleteBooking('b-1')).toBe(true)
    expect(store.bookingViews.value).toHaveLength(bookingCount - 1)
    expect(store.bookingViews.value.some((booking) => booking.id === 'b-1')).toBe(false)
    expect(store.announcement.value).toBe('Die Buchung für Balu wurde gelöscht.')

    expect(store.deleteBooking('b-3')).toBe(true)
    expect(store.checkInOutHistory.value.some((event) => event.bookingId === 'b-3')).toBe(false)
    expect(store.checkInOutHistory.value.some((event) => event.bookingId === 'b-6')).toBe(true)
    expect(store.deleteBooking('b-6')).toBe(true)
    expect(store.checkInOutHistory.value.some((event) => event.bookingId === 'b-6')).toBe(false)
    expect(store.deleteBooking('missing')).toBe(false)
    expect(store.bookingViews.value).toHaveLength(bookingCount - 3)
  })

  it('allows deleting a booking after a reverted check-in and clears its history', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T10:00:00.000Z') })

    expect(store.checkIn('b-1')).toBe(true)
    expect(store.undoCheckIn('b-1')).toBe(true)
    expect(store.canDeleteBooking('b-1')).toBe(true)
    expect(store.deleteBooking('b-1')).toBe(true)
    expect(store.checkInOutHistory.value.some((event) => event.bookingId === 'b-1')).toBe(false)
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
    expect(store.bookingViews.value).toHaveLength(100)
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
    expect(store.bookingViews.value).toHaveLength(100)
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
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    const assignedRoom = store.bookingViews.value.find((booking) => booking.id === 'b-1')?.room
    expect(assignedRoom).toBeDefined()
    assignedRoom!.capacity = 1

    expect(store.checkIn('b-1')).toBe(false)
    expect(store.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(true)
    expect(store.checkedIn.value.filter((booking) => booking.roomId === 'r-1')).toHaveLength(1)
  })

  it('restores booking states after resetting the demo', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    store.checkIn('b-1')
    store.setRoomOperationalStatus('r-3', 'maintenance')

    store.resetDemo()

    expect(store.arrivals.value.some((booking) => booking.id === 'b-1')).toBe(true)
    expect(store.checkedIn.value.some((booking) => booking.id === 'b-1')).toBe(false)
    expect(store.roomViews.value.find((room) => room.id === 'r-3')?.operationalState.status).toBe('ready')
    expect(store.announcement.value).toBe('Die Demo-Daten wurden zurückgesetzt.')
    expect(store.demoEnvironment).toMatchObject({
      id: 'demo-standard', businessDate: '2026-08-09', resetCount: 1, lastResetAt: '2026-08-09T10:00:00.000Z'
    })
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
    const now = () => new Date(2026, 7, 9, 12, 0)
    const firstStore = createPensionStore({ now })
    const secondStore = createPensionStore({ now })

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

  it('checks out a guest whose stay ends today, freeing the room', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    const departure = store.departures.value.find((item) => item.id === 'b-5')

    expect(departure).toBeDefined()
    expect(store.checkOut('b-5')).toBe(true)
    expect(store.departures.value).toHaveLength(0)
    expect(store.checkedIn.value.some((booking) => booking.id === 'b-5')).toBe(false)
    expect(store.announcement.value).toBe('Rocky wurde ausgecheckt. Das Zimmer ist wieder frei.')
  })

  it('rejects checking out a booking that is not currently checked in', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    expect(store.checkOut('b-1')).toBe(false)
    expect(store.checkOut('does-not-exist')).toBe(false)
  })

  it('restores departures when resetting the demo', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    store.checkOut('b-5')

    store.resetDemo()

    expect(store.departures.value.some((departure) => departure.id === 'b-5')).toBe(true)
  })

  it('validates, saves and resets pension settings', () => {
    const store = createPensionStore()
    const changed = { ...store.settings, businessName: 'Tierhotel Waldpfote', checkInFrom: '09:00' }
    const { id: _id, ...update } = changed

    expect(store.updateSettings(update)).toBe(true)
    expect(store.settings.businessName).toBe('Tierhotel Waldpfote')
    expect(store.settings.dailyPetRates).toEqual([
      { id: 'rate-dog', species: 'dog', amountCents: 3500 },
      { id: 'rate-cat', species: 'cat', amountCents: 2400 }
    ])
    update.dailyPetRates[0].amountCents = 1
    expect(store.settings.dailyPetRates[0].amountCents).toBe(3500)
    expect(store.announcement.value).toBe('Die Einstellungen wurden gespeichert.')
    expect(store.updateSettings({ ...update, contactEmail: 'ungueltig' })).toBe(false)
    expect(store.settings.contactEmail).toBe('hallo@tierpension-pro.de')

    store.resetDemo()
    expect(store.settings).toMatchObject({ businessName: 'Tierpension Pro', checkInFrom: '08:00' })
    expect(store.settings.dailyPetRates[0].amountCents).toBe(3500)
  })

  it('configures room master data while preserving existing booking relations', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T10:00:00.000Z') })

    expect(store.createRoom({ name: '  Waldzimmer 3 ', category: 'Hundezimmer', capacity: 3 })).toBe(true)
    expect(store.rooms.at(-1)).toMatchObject({ id: 'r-5', name: 'Waldzimmer 3', category: 'Hundezimmer', capacity: 3 })
    expect(store.roomOperationalStates.at(-1)).toMatchObject({ roomId: 'r-5', status: 'ready' })
    expect(store.updateRoom('r-5', { name: 'Gartenhaus', category: 'Katzenzimmer', capacity: 2 })).toBe(true)
    expect(store.deleteRoom('r-5')).toBe(true)

    expect(store.updateRoom('r-1', { name: 'Waldzimmer 1', category: 'Katzenzimmer', capacity: 2 })).toBe(false)
    expect(store.updateRoom('r-1', { name: 'Waldzimmer 1', category: 'Hundezimmer', capacity: 1 })).toBe(false)
    expect(store.deleteRoom('r-1')).toBe(false)
    expect(store.createRoom({ name: 'Gartenzimmer 2', category: 'Hundezimmer', capacity: 2 })).toBe(false)
  })

  it('validates and saves personal account data', () => {
    const store = createPensionStore()

    expect(store.updateAccount({ firstName: 'Pat', lastName: 'Beispiel', email: 'pat@tierpension-pro.de' })).toBe(true)
    expect(store.account).toMatchObject({ firstName: 'Pat', lastName: 'Beispiel', email: 'pat@tierpension-pro.de' })
    expect(store.announcement.value).toBe('Deine Kontodaten wurden gespeichert.')

    expect(store.updateAccount({ firstName: '', lastName: 'Beispiel', email: 'pat@tierpension-pro.de' })).toBe(false)
    expect(store.account.firstName).toBe('Pat')
  })

  it('lets the root account cancel and reactivate the contract', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T10:00:00.000Z') })

    expect(store.account.cancelledAt).toBeUndefined()
    expect(store.cancelAccount()).toBe(true)
    expect(store.account.cancelledAt).toBe('2026-08-09T10:00:00.000Z')
    expect(store.announcement.value).toBe('Die Pension wurde zum Ende der Vertragslaufzeit gekündigt.')

    expect(store.cancelAccount()).toBe(false)

    expect(store.reactivateAccount()).toBe(true)
    expect(store.account.cancelledAt).toBeUndefined()
    expect(store.announcement.value).toBe('Die Kündigung wurde zurückgenommen.')
  })

  it('does not allow a staff account to cancel the contract', () => {
    const store = createPensionStore()
    store.account.role = 'staff'

    expect(store.cancelAccount()).toBe(false)
    expect(store.account.cancelledAt).toBeUndefined()
  })

  it('restores account data when resetting the demo', () => {
    const store = createPensionStore()
    store.updateAccount({ firstName: 'Pat', lastName: 'Beispiel', email: 'pat@tierpension-pro.de' })
    store.cancelAccount()

    store.resetDemo()

    expect(store.account).toMatchObject({ firstName: 'Robin', lastName: 'Muster', role: 'root' })
    expect(store.account.cancelledAt).toBeUndefined()
  })

  it('requires an explicit customer assignment before accepting a request', () => {
    const store = createPensionStore()
    const customerCount = store.customers.length

    expect(store.acceptRequest('req-1', 'r-2', 'missing')).toBe(false)
    expect(store.customers).toHaveLength(customerCount)
    expect(store.pendingRequests.value.some((request) => request.id === 'req-1')).toBe(true)
  })

  it('accepts a pending request as an explicitly added new customer', () => {
    const store = createPensionStore()
    const customerCount = store.customers.length
    const petCount = store.pets.length
    const bookingCount = store.bookingViews.value.length

    expect(store.acceptRequest('req-1', 'r-2', 'new')).toBe(true)
    expect(store.customers).toHaveLength(customerCount + 1)
    expect(store.pets).toHaveLength(petCount + 1)
    expect(store.bookingViews.value).toHaveLength(bookingCount + 1)
    expect(store.bookingViews.value.at(-1)).toMatchObject({
      status: 'confirmed', room: { id: 'r-2' }, pet: { name: 'Charlie' }, customer: { firstName: 'Hannah', lastName: 'Wolf', email: 'hannah.wolf@example.test' }
    })
    expect(store.pendingRequests.value.some((request) => request.id === 'req-1')).toBe(false)
    expect(store.requestHistory.value.find((request) => request.id === 'req-1')?.status).toBe('accepted')
  })

  it('accepts a pending request for an explicitly selected known customer and reuses the existing pet', () => {
    const store = createPensionStore()
    const customerCount = store.customers.length
    const petCount = store.pets.length

    expect(store.acceptRequest('req-2', 'r-1', 'c-8')).toBe(true)
    expect(store.customers).toHaveLength(customerCount)
    expect(store.pets).toHaveLength(petCount)
    expect(store.bookingViews.value.at(-1)).toMatchObject({ pet: { id: 'p-8', name: 'Oskar' }, customer: { id: 'c-8' } })
  })

  it('rejects accepting a request into a room that does not match the requested species', () => {
    const store = createPensionStore()

    expect(store.acceptRequest('req-1', 'r-3', 'new')).toBe(false)
    expect(store.pendingRequests.value.some((request) => request.id === 'req-1')).toBe(true)
  })

  it('rejects accepting a request into a room that is under maintenance', () => {
    const store = createPensionStore()
    expect(store.setRoomOperationalStatus('r-4', 'maintenance')).toBe(true)

    expect(store.acceptRequest('req-3', 'r-4', 'new')).toBe(false)
  })

  it('rejects accepting or declining a request that was already decided', () => {
    const store = createPensionStore()

    expect(store.acceptRequest('req-4', 'r-1', 'new')).toBe(false)
    expect(store.declineRequest('req-4', 'Kein Platz mehr frei')).toBe(false)
    expect(store.declineRequest('req-5', 'Kein Platz mehr frei')).toBe(false)
  })

  it('rejects declining a request without a reason', () => {
    const store = createPensionStore()

    expect(store.declineRequest('req-3', '')).toBe(false)
    expect(store.declineRequest('req-3', '   ')).toBe(false)
    expect(store.pendingRequests.value.some((request) => request.id === 'req-3')).toBe(true)
  })

  it('declines a pending request with a reason and without creating a booking', () => {
    const store = createPensionStore()
    const bookingCount = store.bookingViews.value.length

    expect(store.declineRequest('req-3', 'Zeitraum bereits ausgebucht')).toBe(true)
    expect(store.bookingViews.value).toHaveLength(bookingCount)
    expect(store.pendingRequests.value.some((request) => request.id === 'req-3')).toBe(false)
    const declined = store.requestHistory.value.find((request) => request.id === 'req-3')
    expect(declined?.status).toBe('declined')
    expect(declined?.declineReason).toBe('Zeitraum bereits ausgebucht')
    expect(declined?.declineNotification).toEqual({
      channel: 'email',
      recipient: 'elias.brandt@example.test',
      status: 'scheduled',
      createdAt: '2026-08-09T10:00:00.000Z'
    })
    expect(store.announcement.value).toBe('Die Anfrage von Elias Brandt wurde abgelehnt. Die E-Mail-Benachrichtigung ist vorbereitet.')
  })

  it('restores requests to their initial state after resetting the demo', () => {
    const store = createPensionStore()
    store.declineRequest('req-3', 'Zeitraum bereits ausgebucht')

    store.resetDemo()

    expect(store.pendingRequests.value.some((request) => request.id === 'req-3')).toBe(true)
  })

  it('derives the occupancy timeline from the injected business date by default', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    expect(store.occupancyStartDate.value).toBe('2026-08-09')
    expect(store.occupancyDates.value[0]).toBe('2026-08-09')
  })

  it('navigates the occupancy timeline week by week and jumps back to today', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    store.shiftOccupancyStartDate(7)
    expect(store.occupancyStartDate.value).toBe('2026-08-16')

    store.shiftOccupancyStartDate(-7)
    expect(store.occupancyStartDate.value).toBe('2026-08-09')

    store.shiftOccupancyStartDate(7)
    store.jumpOccupancyToToday()
    expect(store.occupancyStartDate.value).toBe('2026-08-09')
  })

  it('accepts a valid explicit start date and rejects a malformed one', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })

    expect(store.setOccupancyStartDate('2026-09-01')).toBe(true)
    expect(store.occupancyStartDate.value).toBe('2026-09-01')

    expect(store.setOccupancyStartDate('2026-02-30')).toBe(false)
    expect(store.occupancyStartDate.value).toBe('2026-09-01')
  })

  it('restores the occupancy timeline to the current business day after resetting the demo', () => {
    const store = createPensionStore({ now: () => new Date(2026, 7, 9, 12, 0) })
    store.shiftOccupancyStartDate(30)

    store.resetDemo()

    expect(store.occupancyStartDate.value).toBe('2026-08-09')
  })

  it('blocks bookings during a closure and restores closures with the demo reset', () => {
    const store = createPensionStore({ now: () => new Date('2026-08-09T12:00:00.000Z') })

    expect(store.createPensionClosure({ startDate: '2026-08-15', endDate: '2026-08-16', reason: '  Betriebsferien  ' })).toBe(true)
    expect(store.pensionClosures[0]).toMatchObject({ id: 'closure-1', reason: 'Betriebsferien', createdAt: '2026-08-09T12:00:00.000Z' })
    expect(store.createBooking({ customerId: 'c-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-08-15', arrival: '12:15', departure: '2026-08-18' })).toBe(false)
    expect(store.createPensionClosure({ startDate: '2026-08-20', endDate: '2026-08-19' })).toBe(false)

    store.resetDemo()
    expect(store.pensionClosures).toHaveLength(0)
  })
})
