import { computed, reactive, ref } from 'vue'
import type { AccountUpdate, Booking, BookingRequest, BookingReservation, BookingUpdate, CheckInOutEvent, Customer, CustomerUpdate, NewBooking, NewBookingReservation, NewCustomer, NewPet, NewPensionClosure, OccupancyRangeDays, PensionClosureUpdate, PensionSettingsUpdate, PetUpdate, RegistrationProfile, RoomInput, RoomOperationalStatus, ToastNotification } from './domain'
import { isValidAccountUpdate } from './domain/account'
import { isValidEmail } from './domain/email'
import { isValidBookingNote, normalizeBookingNote } from './domain/bookingNote'
import { addDaysToIsoDate, buildDateRange, enumerateStayDates, fromLocalIsoDate, isValidBookingPeriod, isValidIsoDate, isValidOptionalTime, toLocalIsoDate } from './domain/bookingPeriod'
import { createCustomerProfile, updateCustomerProfile } from './domain/customerProfile'
import { createPetProfile, updatePetProfile } from './domain/petProfile'
import { isValidPensionSettingsUpdate } from './domain/pensionSettings'
import { isValidRoomInput } from './domain/roomConfiguration'
import { doesStayOverlapClosure, isValidPensionClosure } from './domain/pensionClosure'
import { hasRoomCapacityForStay } from './domain/roomAvailability'
import { isRoomCompatibleWithSpecies } from './domain/roomCompatibility'
import { calculateStayPrice } from './domain/stayPrice'
import {
  selectBookingViews,
  selectArrivals,
  selectCheckInOutHistory,
  selectCustomerViews,
  selectDailyOccupancy,
  selectDepartures,
  selectCheckedIn,
  selectOccupancyByCategory,
  selectPendingRequests,
  selectRequestHistory,
  selectRoomTimelines,
  selectRoomViews
} from './store/pensionSelectors'
import { nextEntityId } from './store/nextEntityId'
import { createDemoState } from './store/demoState'
import { replaceArrayContents } from './store/replaceArrayContents'

export interface PensionStoreDependencies {
  now: () => Date
}

// Mock data is anchored to this fixed demo date (2026-08-09) so the clickdummy shows
// consistent arrivals/departures regardless of the real calendar date it is opened on.
const defaultDependencies: PensionStoreDependencies = {
  now: () => new Date(2026, 7, 9, 12, 0)
}

export function createPensionStore(dependencies: PensionStoreDependencies = defaultDependencies) {
  const initialState = createDemoState()
  const customers = reactive(initialState.customers)
  const pets = reactive(initialState.pets)
  const rooms = reactive(initialState.rooms)
  const roomOperationalStates = reactive(initialState.roomOperationalStates)
  const pensionClosures = reactive(initialState.pensionClosures)
  const bookings = reactive<Booking[]>(initialState.bookings)
  const bookingReservations = reactive<BookingReservation[]>(initialState.bookingReservations)
  const bookingRequests = reactive<BookingRequest[]>(initialState.bookingRequests)
  const checkInOutEvents = reactive<CheckInOutEvent[]>(initialState.checkInOutEvents)
  const settings = reactive(initialState.settings)
  const account = reactive(initialState.account)
  const demoSession = reactive(initialState.demoSession)
  const registrationRequest = reactive(initialState.registrationRequest)
  const demoEnvironment = reactive(initialState.demoEnvironment)
  const toastNotifications = reactive<ToastNotification[]>([])
  // Kept as a read-only compatibility projection for existing consumers; presentation uses
  // the structured notification queue above instead of page-bound status text.
  const announcement = computed(() => toastNotifications.at(-1)?.message ?? '')
  const isAuthenticated = computed(() => demoSession.isAuthenticated)
  const occupancyRangeDays = ref<OccupancyRangeDays>(14)
  const occupancyStartDate = ref(toLocalIsoDate(dependencies.now()))

  const bookingViews = computed(() => selectBookingViews(bookings, pets, customers, rooms))
  const businessDate = computed(() => toLocalIsoDate(dependencies.now()))

  const arrivals = computed(() => selectArrivals(bookingViews.value, businessDate.value))
  const customerViews = computed(() => selectCustomerViews(customers, pets, bookingViews.value))
  const checkedIn = computed(() => selectCheckedIn(bookingViews.value))
  const departures = computed(() => selectDepartures(bookingViews.value, businessDate.value))
  const roomViews = computed(() => selectRoomViews(rooms, checkedIn.value, roomOperationalStates))
  const totalCapacity = computed(() => roomViews.value.reduce((sum, room) =>
    sum + (room.operationalState.status === 'ready' ? room.capacity : 0), 0))
  const occupancyRate = computed(() => totalCapacity.value === 0
    ? 0
    : Math.round((checkedIn.value.length / totalCapacity.value) * 100))
  const occupancyByCategory = computed(() => selectOccupancyByCategory(
    roomViews.value.filter((room) => room.operationalState.status === 'ready'),
    checkedIn.value
  ))
  const occupancyDates = computed(() => buildDateRange(fromLocalIsoDate(occupancyStartDate.value), occupancyRangeDays.value))
  const roomTimelines = computed(() => selectRoomTimelines(rooms, roomOperationalStates, bookingViews.value, occupancyDates.value, pensionClosures))
  const dailyOccupancy = computed(() => selectDailyOccupancy(rooms, roomOperationalStates, bookingViews.value, occupancyDates.value, pensionClosures))
  const pendingRequests = computed(() => selectPendingRequests(bookingRequests))
  const requestHistory = computed(() => selectRequestHistory(bookingRequests))
  const checkInOutHistory = computed(() => selectCheckInOutHistory(checkInOutEvents, bookingViews.value))

  function showToast(message: string): void {
    toastNotifications.push({
      id: nextEntityId(toastNotifications, 'toast'),
      message,
      createdAt: dependencies.now().toISOString()
    })
  }

  function dismissToast(toastId: string): void {
    const index = toastNotifications.findIndex((toast) => toast.id === toastId)
    if (index >= 0) toastNotifications.splice(index, 1)
  }

  /** The demo accepts arbitrary credentials and always opens Robin Muster's account. */
  function logIn(): void {
    demoSession.isAuthenticated = true
    demoSession.accountId = account.id
  }

  function logOut(): void {
    demoSession.isAuthenticated = false
  }

  function startRegistration(email: string): boolean {
    const normalizedEmail = email.trim().toLocaleLowerCase('de')
    if (!isValidEmail(normalizedEmail)) return false

    registrationRequest.email = normalizedEmail
    registrationRequest.status = 'email-sent'
    registrationRequest.verificationCode = undefined
    registrationRequest.requestedAt = dependencies.now().toISOString()
    delete registrationRequest.verifiedAt
    delete registrationRequest.profile
    delete registrationRequest.completedAt
    return true
  }

  function verifyRegistrationCode(code: string): boolean {
    const normalizedCode = code.trim()
    if (registrationRequest.status !== 'email-sent' || normalizedCode.length < 4) return false

    registrationRequest.verificationCode = normalizedCode
    registrationRequest.status = 'code-verified'
    registrationRequest.verifiedAt = dependencies.now().toISOString()
    return true
  }

  function completeRegistration(profile: RegistrationProfile): boolean {
    const normalizedProfile: RegistrationProfile = {
      firstName: profile.firstName.trim(), lastName: profile.lastName.trim(),
      businessName: profile.businessName.trim(), street: profile.street.trim(),
      postalCode: profile.postalCode.trim(), city: profile.city.trim()
    }
    if (registrationRequest.status !== 'code-verified' || !Object.values(normalizedProfile).every(Boolean)
      || !/^\d{5}$/.test(normalizedProfile.postalCode)) return false
    registrationRequest.profile = normalizedProfile
    registrationRequest.status = 'completed'
    registrationRequest.completedAt = dependencies.now().toISOString()
    return true
  }

  function recordCheckInOutEvent(bookingId: string, type: CheckInOutEvent['type']): void {
    checkInOutEvents.push({
      id: nextEntityId(checkInOutEvents, 'cio'),
      bookingId,
      type,
      occurredAt: dependencies.now().toISOString()
    })
  }

  function checkIn(bookingId: string, allowOverbooking = false): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    const room = booking && rooms.find((item) => item.id === booking.roomId)
    const roomState = roomOperationalStates.find((item) => item.roomId === booking?.roomId)
    if (!booking || !pet || !room || roomState?.status !== 'ready'
      || booking.status !== 'confirmed' || booking.arrivalDate !== businessDate.value) return false

    const occupiedPlaces = bookings.filter((item) => item.roomId === room.id && item.status === 'checked-in').length
    if (occupiedPlaces >= room.capacity && !allowOverbooking) return false

    booking.status = 'checked-in'
    if (occupiedPlaces >= room.capacity) {
      booking.overbooked = true
    }
    recordCheckInOutEvent(booking.id, 'check-in')
    showToast(occupiedPlaces >= room.capacity
      ? `${pet.name} wurde als Überbuchung eingecheckt.`
      : `${pet.name} ist jetzt eingecheckt.`)
    return true
  }

  function canUndoCheckIn(bookingId: string): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const latestEvent = checkInOutEvents
      .filter((event) => event.bookingId === bookingId)
      .sort((first, second) => second.occurredAt.localeCompare(first.occurredAt)
        || second.id.localeCompare(first.id, undefined, { numeric: true }))[0]
    return booking?.status === 'checked-in'
      && latestEvent?.type === 'check-in'
      && toLocalIsoDate(new Date(latestEvent.occurredAt)) === businessDate.value
  }

  function undoCheckIn(bookingId: string): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    if (!booking || !pet || !canUndoCheckIn(bookingId)) return false

    booking.status = 'confirmed'
    recordCheckInOutEvent(booking.id, 'check-in-reverted')
    showToast(`Der Check-in von ${pet.name} wurde rückgängig gemacht.`)
    return true
  }

  function createBooking(input: NewBooking): boolean {
    const customer = customers.find((item) => item.id === input.customerId)
    const pet = pets.find((item) => item.id === input.petId)
    const room = rooms.find((item) => item.id === input.roomId)
    const speciesMatchesRoom = pet && room && isRoomCompatibleWithSpecies(room, pet.species)
    const roomIsReady = roomOperationalStates.some((state) => state.roomId === room?.id && state.status === 'ready')
    const petBelongsToCustomer = customer && pet && pet.customerId === customer.id
    const hasActiveBooking = bookings.some((item) => item.petId === input.petId && item.status !== 'checked-out')
    const exceedsCapacity = room && !hasRoomCapacityForStay(bookings, room.id, room.capacity, input.arrivalDate, input.departure)
    if (!petBelongsToCustomer || !room || !speciesMatchesRoom || !roomIsReady || hasActiveBooking
      || !isValidBookingPeriod(input.arrivalDate, input.arrival, input.departure)
      || !isValidOptionalTime(input.pickupTime)
      || !isValidBookingNote(input.bookingNote)
      || doesStayOverlapClosure(input.arrivalDate, input.departure, pensionClosures)
      || (exceedsCapacity && !input.allowOverbooking)) return false

    bookings.push({
      id: nextEntityId(bookings, 'b'),
      petId: input.petId,
      roomId: input.roomId,
      arrivalDate: input.arrivalDate,
      arrival: input.arrival,
      departure: input.departure,
      createdAt: dependencies.now().toISOString(),
      ...(input.pickupTime ? { pickupTime: input.pickupTime } : {}),
      ...(normalizeBookingNote(input.bookingNote) ? { bookingNote: normalizeBookingNote(input.bookingNote) } : {}),
      status: 'confirmed',
      overbooked: Boolean(exceedsCapacity)
    })
    showToast(exceedsCapacity
      ? `Die Buchung für ${pet.name} wurde als Überbuchung angelegt.`
      : `Die Buchung für ${pet.name} wurde angelegt.`)
    return true
  }

  /** Creates all animal stays together, after validating capacity for the whole group. */
  function createBookingReservation(input: NewBookingReservation): boolean {
    const { allowOverbooking = false, bookingNote, ...reservationInput } = input
    const petIds = [...new Set(input.petIds)]
    const customer = customers.find((item) => item.id === input.customerId)
    const room = rooms.find((item) => item.id === input.roomId)
    const selectedPets = petIds.map((id) => pets.find((item) => item.id === id))
    const roomIsReady = roomOperationalStates.some((state) => state.roomId === room?.id && state.status === 'ready')
    const petsBelongToCustomer = selectedPets.length === petIds.length
      && selectedPets.every((pet) => pet?.customerId === customer?.id)
    const allPetsAreCompatible = room && selectedPets.every((pet) => pet && isRoomCompatibleWithSpecies(room, pet.species))
    const hasActiveBooking = petIds.some((petId) => bookings.some((booking) => booking.petId === petId && booking.status !== 'checked-out'))
    const exceedsCapacity = room && !hasRoomCapacityForStay(bookings, room.id, room.capacity, input.arrivalDate, input.departure, petIds.length)
    if (!customer || !room || !petIds.length || !petsBelongToCustomer || !allPetsAreCompatible || !roomIsReady || hasActiveBooking
      || !isValidBookingPeriod(input.arrivalDate, input.arrival, input.departure)
      || !isValidOptionalTime(input.pickupTime)
      || !isValidBookingNote(input.bookingNote)
      || doesStayOverlapClosure(input.arrivalDate, input.departure, pensionClosures)
      || (exceedsCapacity && !allowOverbooking)) return false

    const reservationId = nextEntityId(bookingReservations, 'reservation')
    const createdAt = dependencies.now().toISOString()
    bookingReservations.push({
      ...reservationInput, id: reservationId, petIds, createdAt,
      ...(normalizeBookingNote(bookingNote) ? { bookingNote: normalizeBookingNote(bookingNote) } : {})
    })
    for (const petId of petIds) {
      bookings.push({
        id: nextEntityId(bookings, 'b'), reservationId, petId, roomId: room.id,
        arrivalDate: input.arrivalDate, arrival: input.arrival, departure: input.departure, createdAt,
        ...(input.pickupTime ? { pickupTime: input.pickupTime } : {}),
        ...(normalizeBookingNote(bookingNote) ? { bookingNote: normalizeBookingNote(bookingNote) } : {}),
        status: 'confirmed', overbooked: Boolean(exceedsCapacity)
      })
    }
    const names = selectedPets.map((pet) => pet!.name).join(', ')
    showToast(exceedsCapacity
      ? `Die Reservierung für ${names} wurde als Überbuchung angelegt.`
      : petIds.length === 1
        ? `Die Reservierung für ${names} wurde angelegt.`
        : `Die gemeinsame Reservierung für ${names} wurde angelegt.`)
    return true
  }

  /** Updates an unstarted stay while preserving its pet/customer references and status. */
  function updateBooking(bookingId: string, input: BookingUpdate): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    const room = rooms.find((item) => item.id === input.roomId)
    const roomIsReady = roomOperationalStates.some((state) => state.roomId === room?.id && state.status === 'ready')
    const speciesMatchesRoom = pet && room && isRoomCompatibleWithSpecies(room, pet.species)
    const otherBookings = bookings.filter((item) => item.id !== bookingId)
    const exceedsCapacity = room && !hasRoomCapacityForStay(
      otherBookings, room.id, room.capacity, input.arrivalDate, input.departure
    )
    if (!booking || !pet || booking.status !== 'confirmed' || !room || !roomIsReady || !speciesMatchesRoom
      || !isValidBookingPeriod(input.arrivalDate, input.arrival, input.departure)
      || !isValidOptionalTime(input.pickupTime)
      || !isValidBookingNote(input.bookingNote)
      || doesStayOverlapClosure(input.arrivalDate, input.departure, pensionClosures)
      || (exceedsCapacity && !input.allowOverbooking)) return false

    const bookingNote = normalizeBookingNote(input.bookingNote)
    const reservation = booking.reservationId
      ? bookingReservations.find((item) => item.id === booking.reservationId)
      : undefined
    const separatesFromReservation = reservation && (
      reservation.roomId !== room.id
      || reservation.arrivalDate !== input.arrivalDate
      || reservation.arrival !== input.arrival
      || reservation.departure !== input.departure
      || reservation.pickupTime !== (input.pickupTime || undefined)
      || reservation.bookingNote !== bookingNote
    )

    booking.roomId = room.id
    booking.arrivalDate = input.arrivalDate
    booking.arrival = input.arrival
    booking.departure = input.departure
    if (input.pickupTime) booking.pickupTime = input.pickupTime
    else delete booking.pickupTime
    if (bookingNote) booking.bookingNote = bookingNote
    else delete booking.bookingNote
    booking.overbooked = Boolean(exceedsCapacity)
    if (separatesFromReservation && reservation) {
      reservation.petIds = reservation.petIds.filter((petId) => petId !== booking.petId)
      delete booking.reservationId
      if (!reservation.petIds.length) {
        bookingReservations.splice(bookingReservations.indexOf(reservation), 1)
      }
    }
    showToast(`Die Buchung für ${pet.name} wurde aktualisiert.`)
    return true
  }

  /**
   * Moves an already checked-in stay into another room. Capacity overrides need
   * an explicit acknowledgement, just like when a booking is created or edited.
   */
  function changeCheckedInBookingRoom(bookingId: string, roomId: string, allowOverbooking = false): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    const previousRoom = booking && rooms.find((item) => item.id === booking.roomId)
    const room = rooms.find((item) => item.id === roomId)
    const roomIsReady = roomOperationalStates.some((state) => state.roomId === room?.id && state.status === 'ready')
    const speciesMatchesRoom = pet && room && isRoomCompatibleWithSpecies(room, pet.species)
    const otherBookings = bookings.filter((item) => item.id !== bookingId)
    const hasCapacity = booking && room && hasRoomCapacityForStay(
      otherBookings, room.id, room.capacity, businessDate.value, booking.departure
    )
    if (!booking || !pet || !previousRoom || booking.status !== 'checked-in' || !room || !roomIsReady
      || !speciesMatchesRoom || room.id === previousRoom.id || (!hasCapacity && !allowOverbooking)) return false

    booking.roomId = room.id
    booking.overbooked = !hasCapacity
    const reservation = booking.reservationId ? bookingReservations.find((item) => item.id === booking.reservationId) : undefined
    if (reservation && reservation.roomId !== room.id) {
      reservation.petIds = reservation.petIds.filter((petId) => petId !== booking.petId)
      delete booking.reservationId
      if (!reservation.petIds.length) bookingReservations.splice(bookingReservations.indexOf(reservation), 1)
    }

    showToast(!hasCapacity
      ? `${pet.name} wurde von ${previousRoom.name} in ${room.name} verlegt und ist dort überbucht.`
      : `${pet.name} wurde von ${previousRoom.name} in ${room.name} verlegt.`)
    return true
  }

  function canDeleteBooking(bookingId: string): boolean {
    return bookings.some((booking) => booking.id === bookingId)
  }

  function deleteBooking(bookingId: string): boolean {
    const bookingIndex = bookings.findIndex((item) => item.id === bookingId)
    const booking = bookings[bookingIndex]
    const pet = booking && pets.find((item) => item.id === booking.petId)
    if (bookingIndex < 0 || !booking || !pet || !canDeleteBooking(bookingId)) return false

    // A deletion is deliberately final in the demo. Remove the process events together
    // with their booking so that history never contains references to removed data.
    const relatedEventIndexes = checkInOutEvents
      .map((event, index) => event.bookingId === bookingId ? index : -1)
      .filter((index) => index >= 0)
      .reverse()
    for (const eventIndex of relatedEventIndexes) checkInOutEvents.splice(eventIndex, 1)
    bookings.splice(bookingIndex, 1)

    // Reservations retain the remaining animal stays when one member is
    // deleted. Remove the aggregate too once it no longer contains a stay.
    if (booking.reservationId) {
      const reservationIndex = bookingReservations.findIndex((reservation) => reservation.id === booking.reservationId)
      const reservation = bookingReservations[reservationIndex]
      if (reservation) {
        reservation.petIds = reservation.petIds.filter((petId) => petId !== booking.petId)
        if (!reservation.petIds.length) bookingReservations.splice(reservationIndex, 1)
      }
    }
    showToast(`Die Buchung für ${pet.name} wurde gelöscht.`)
    return true
  }

  function acceptRequest(requestId: string, roomId: string, customerAssignment: Customer['id'] | 'new'): boolean {
    const request = bookingRequests.find((item) => item.id === requestId)
    const room = rooms.find((item) => item.id === roomId)
    const roomIsReady = roomOperationalStates.some((state) => state.roomId === roomId && state.status === 'ready')
    if (!request || request.status !== 'pending' || !room || !roomIsReady
      || !isRoomCompatibleWithSpecies(room, request.species)
      || !isValidBookingPeriod(request.arrivalDate, request.arrival, request.departure)
      || doesStayOverlapClosure(request.arrivalDate, request.departure, pensionClosures)
      || !hasRoomCapacityForStay(bookings, room.id, room.capacity, request.arrivalDate, request.departure)) return false

    let customer: Customer | undefined
    if (customerAssignment === 'new') {
      customer = createCustomerProfile(nextEntityId(customers, 'c'), {
        firstName: request.customerFirstName,
        lastName: request.customerLastName,
        email: request.contactEmail,
        phone: request.phone
      }, customers.map((item) => item.phone), customers.map((item) => item.email))
      if (!customer) return false
      customers.push(customer)
    } else {
      customer = customers.find((item) => item.id === customerAssignment)
      if (!customer) return false
    }

    let pet = pets.find((item) => item.customerId === customer.id
      && item.species === request.species
      && item.name.localeCompare(request.petName, 'de', { sensitivity: 'base' }) === 0)
    if (!pet) {
      pet = createPetProfile(nextEntityId(pets, 'p'), {
        customerId: customer.id,
        name: request.petName,
        species: request.species,
        note: request.note
      })
      if (!pet) return false
      pets.push(pet)
    }

    const hasActiveBooking = bookings.some((item) => item.petId === pet!.id && item.status !== 'checked-out')
    if (hasActiveBooking) return false

    bookings.push({
      id: nextEntityId(bookings, 'b'),
      petId: pet.id,
      roomId: room.id,
      arrivalDate: request.arrivalDate,
      arrival: request.arrival,
      departure: request.departure,
      createdAt: dependencies.now().toISOString(),
      status: 'confirmed'
    })
    request.customerId = customer.id
    request.status = 'accepted'
    showToast(`Die Anfrage von ${request.customerFirstName} ${request.customerLastName} wurde als Reservierung angelegt.`)
    return true
  }

  function declineRequest(requestId: string, reason: string): boolean {
    const request = bookingRequests.find((item) => item.id === requestId)
    const trimmedReason = reason.trim()
    if (!request || request.status !== 'pending' || !trimmedReason) return false

    request.status = 'declined'
    request.declineReason = trimmedReason
    request.declineNotification = {
      channel: 'email',
      recipient: request.contactEmail,
      status: 'scheduled',
      createdAt: dependencies.now().toISOString()
    }
    showToast(`Die Anfrage von ${request.customerFirstName} ${request.customerLastName} wurde abgelehnt. Die E-Mail-Benachrichtigung ist vorbereitet.`)
    return true
  }

  function createPet(input: NewPet): boolean {
    const customer = customers.find((item) => item.id === input.customerId)
    const id = nextEntityId(pets, 'p')
    const pet = createPetProfile(id, input)
    if (!customer || !pet) return false

    pets.push(pet)
    showToast(`${pet.name} wurde im Kundenprofil angelegt.`)
    return true
  }

  function updatePet(petId: string, input: PetUpdate): boolean {
    const pet = pets.find((item) => item.id === petId)
    const updatedPet = pet && updatePetProfile(pet, input)
    if (!pet || !updatedPet) return false

    Object.assign(pet, updatedPet)
    showToast(`${pet.name} wurde im Kundenprofil aktualisiert.`)
    return true
  }

  /**
   * A pet may only be removed before its first stay. Bookings intentionally keep
   * their pet reference, including historical check-in/out events.
   */
  function removePet(petId: string): boolean {
    const petIndex = pets.findIndex((item) => item.id === petId)
    if (petIndex < 0 || bookings.some((booking) => booking.petId === petId)) return false

    const [pet] = pets.splice(petIndex, 1)
    showToast(`${pet.name} wurde aus dem Kundenprofil entfernt.`)
    return true
  }

  function createCustomer(input: NewCustomer): boolean {
    const customer = createCustomerProfile(
      nextEntityId(customers, 'c'),
      input,
      customers.map((item) => item.phone),
      customers.map((item) => item.email)
    )
    if (!customer) return false

    customers.push(customer)
    showToast(`${customer.firstName} ${customer.lastName} wurde im Kundenverzeichnis angelegt.`)
    return true
  }

  /**
   * Customer records may be removed only while they do not own any animal
   * profiles. This keeps all booking and check-in/out references intact.
   */
  function removeCustomer(customerId: string): boolean {
    const customerIndex = customers.findIndex((item) => item.id === customerId)
    if (customerIndex < 0 || pets.some((pet) => pet.customerId === customerId)) return false

    const [customer] = customers.splice(customerIndex, 1)
    showToast(`${customer.firstName} ${customer.lastName} wurde aus dem Kundenverzeichnis entfernt.`)
    return true
  }

  function updateCustomer(customerId: string, input: CustomerUpdate): boolean {
    const customer = customers.find((item) => item.id === customerId)
    if (!customer) return false

    const otherCustomers = customers.filter((item) => item.id !== customerId)
    const updated = updateCustomerProfile(
      customer,
      input,
      otherCustomers.map((item) => item.phone),
      otherCustomers.map((item) => item.email)
    )
    if (!updated) return false

    Object.assign(customer, updated)
    showToast(`${customer.firstName} ${customer.lastName} wurde im Kundenprofil aktualisiert.`)
    return true
  }

  function checkOut(bookingId: string): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    if (!booking || !pet || booking.status !== 'checked-in') return false

    const price = calculateStayPrice({ ...booking, pet }, settings.dailyPetRates)
    booking.status = 'checked-out'
    // Keep the completed invoice independent from future rate changes.
    booking.checkoutPrice = price ? { ...price } : undefined
    recordCheckInOutEvent(booking.id, 'check-out')
    showToast(`${pet.name} wurde ausgecheckt. Das Zimmer ist wieder frei.`)
    return true
  }

  function updateSettings(input: PensionSettingsUpdate): boolean {
    if (!isValidPensionSettingsUpdate(input)) return false

    Object.assign(settings, {
      ...input,
      dailyPetRates: input.dailyPetRates.map((rate) => ({ ...rate }))
    })
    showToast('Die Einstellungen wurden gespeichert.')
    return true
  }

  function roomNameIsUnique(name: string, exceptRoomId?: string): boolean {
    const normalizedName = name.trim().toLocaleLowerCase('de')
    return !rooms.some((room) => room.id !== exceptRoomId
      && room.name.trim().toLocaleLowerCase('de') === normalizedName)
  }

  function capacitySupportsExistingStays(roomId: string, capacity: number): boolean {
    const activeBookings = bookings.filter((booking) => booking.roomId === roomId && booking.status !== 'checked-out')
    const occupiedByDate = new Map<string, number>()
    for (const booking of activeBookings) {
      for (const date of enumerateStayDates(booking.arrivalDate, booking.departure)) {
        occupiedByDate.set(date, (occupiedByDate.get(date) ?? 0) + 1)
      }
    }
    return [...occupiedByDate.values()].every((occupied) => occupied <= capacity)
  }

  function createRoom(input: RoomInput): boolean {
    if (!isValidRoomInput(input) || !roomNameIsUnique(input.name)) return false

    const room = {
      id: nextEntityId(rooms, 'r'),
      name: input.name.trim(),
      category: input.category,
      capacity: input.capacity
    }
    rooms.push(room)
    roomOperationalStates.push({
      id: nextEntityId(roomOperationalStates, 'room-state'),
      roomId: room.id,
      status: 'ready',
      updatedAt: dependencies.now().toISOString()
    })
    showToast(`${room.name} wurde angelegt.`)
    return true
  }

  function updateRoom(roomId: string, input: RoomInput): boolean {
    const room = rooms.find((item) => item.id === roomId)
    if (!room || !isValidRoomInput(input) || !roomNameIsUnique(input.name, roomId)
      || !capacitySupportsExistingStays(roomId, input.capacity)) return false

    // Changing the species category would invalidate the historical booking relation.
    if (room.category !== input.category && bookings.some((booking) => booking.roomId === roomId)) return false

    room.name = input.name.trim()
    room.category = input.category
    room.capacity = input.capacity
    showToast(`${room.name} wurde aktualisiert.`)
    return true
  }

  function deleteRoom(roomId: string): boolean {
    const roomIndex = rooms.findIndex((room) => room.id === roomId)
    if (roomIndex < 0 || bookings.some((booking) => booking.roomId === roomId)) return false

    const [room] = rooms.splice(roomIndex, 1)
    const stateIndex = roomOperationalStates.findIndex((state) => state.roomId === roomId)
    if (stateIndex >= 0) roomOperationalStates.splice(stateIndex, 1)
    showToast(`${room.name} wurde entfernt.`)
    return true
  }

  function updateAccount(input: AccountUpdate): boolean {
    if (!isValidAccountUpdate(input)) return false

    account.firstName = input.firstName.trim()
    account.lastName = input.lastName.trim()
    account.email = input.email.trim()
    showToast('Deine Kontodaten wurden gespeichert.')
    return true
  }

  function cancelAccount(): boolean {
    if (account.role !== 'root' || account.cancelledAt) return false

    account.cancelledAt = dependencies.now().toISOString()
    showToast('Die Pension wurde zum Ende der Vertragslaufzeit gekündigt.')
    return true
  }

  function reactivateAccount(): boolean {
    if (!account.cancelledAt) return false

    account.cancelledAt = undefined
    showToast('Die Kündigung wurde zurückgenommen.')
    return true
  }

  function setRoomOperationalStatus(roomId: string, status: RoomOperationalStatus, note?: string): boolean {
    const state = roomOperationalStates.find((item) => item.roomId === roomId)
    const room = rooms.find((item) => item.id === roomId)
    const hasGuest = bookings.some((item) => item.roomId === roomId && item.status === 'checked-in')
    if (!state || !room || (status === 'maintenance' && hasGuest)) return false

    state.status = status
    state.updatedAt = dependencies.now().toISOString()
    state.note = status === 'maintenance' && note?.trim() ? note.trim() : undefined
    showToast(status === 'ready'
      ? `${room.name} ist wieder verfügbar.`
      : `${room.name} wurde vorübergehend gesperrt.`)
    return true
  }

  function createPensionClosure(input: NewPensionClosure): boolean {
    if (!isValidPensionClosure(input)) return false

    const reason = input.reason?.trim()
    pensionClosures.push({
      id: nextEntityId(pensionClosures, 'closure'),
      startDate: input.startDate,
      endDate: input.endDate,
      reason: reason || undefined,
      createdAt: dependencies.now().toISOString()
    })
    showToast('Die Schließzeit wurde hinterlegt.')
    return true
  }

  function updatePensionClosure(closureId: string, input: PensionClosureUpdate): boolean {
    const closure = pensionClosures.find((item) => item.id === closureId)
    if (!closure || !isValidPensionClosure(input)) return false

    closure.startDate = input.startDate
    closure.endDate = input.endDate
    closure.reason = input.reason?.trim() || undefined
    showToast('Die Schließzeit wurde aktualisiert.')
    return true
  }

  function deletePensionClosure(closureId: string): boolean {
    const index = pensionClosures.findIndex((closure) => closure.id === closureId)
    if (index < 0) return false

    pensionClosures.splice(index, 1)
    showToast('Die Schließzeit wurde entfernt.')
    return true
  }

  function setOccupancyRangeDays(days: OccupancyRangeDays): void {
    occupancyRangeDays.value = days
  }

  function setOccupancyStartDate(date: string): boolean {
    if (!isValidIsoDate(date)) return false

    occupancyStartDate.value = date
    return true
  }

  function shiftOccupancyStartDate(days: number): void {
    occupancyStartDate.value = addDaysToIsoDate(occupancyStartDate.value, days)
  }

  function jumpOccupancyToToday(): void {
    occupancyStartDate.value = businessDate.value
  }

  function resetDemo() {
    const initialState = createDemoState()
    replaceArrayContents(customers, initialState.customers)
    replaceArrayContents(pets, initialState.pets)
    replaceArrayContents(rooms, initialState.rooms)
    replaceArrayContents(roomOperationalStates, initialState.roomOperationalStates)
    replaceArrayContents(pensionClosures, initialState.pensionClosures)
    replaceArrayContents(bookings, initialState.bookings)
    replaceArrayContents(bookingReservations, initialState.bookingReservations)
    replaceArrayContents(bookingRequests, initialState.bookingRequests)
    replaceArrayContents(checkInOutEvents, initialState.checkInOutEvents)
    Object.assign(settings, initialState.settings)
    Object.assign(account, initialState.account)
    delete account.cancelledAt
    Object.assign(demoSession, initialState.demoSession)
    Object.assign(registrationRequest, initialState.registrationRequest)
    delete registrationRequest.verificationCode
    delete registrationRequest.requestedAt
    delete registrationRequest.verifiedAt
    delete registrationRequest.profile
    delete registrationRequest.completedAt
    occupancyRangeDays.value = 14
    occupancyStartDate.value = businessDate.value
    demoEnvironment.resetCount += 1
    demoEnvironment.lastResetAt = dependencies.now().toISOString()
    toastNotifications.splice(0, toastNotifications.length)
    showToast('Die Demo-Daten wurden zurückgesetzt.')
  }

  return {
    bookingViews,
    customerViews,
    announcement,
    isAuthenticated,
    toastNotifications,
    businessDate,
    arrivals,
    checkedIn,
    departures,
    totalCapacity,
    occupancyRate,
    occupancyByCategory,
    occupancyRangeDays,
    occupancyStartDate,
    occupancyDates,
    roomTimelines,
    dailyOccupancy,
    pendingRequests,
    requestHistory,
    checkInOutHistory,
    roomViews,
    customers,
    pets,
    rooms,
    roomOperationalStates,
    pensionClosures,
    bookingReservations,
    settings,
    account,
    demoSession,
    registrationRequest,
    demoEnvironment,
    createBooking,
    createBookingReservation,
    updateBooking,
    changeCheckedInBookingRoom,
    canDeleteBooking,
    deleteBooking,
    createCustomer,
    removeCustomer,
    updateCustomer,
    createPet,
    updatePet,
    removePet,
    checkIn,
    canUndoCheckIn,
    undoCheckIn,
    checkOut,
    acceptRequest,
    declineRequest,
    updateSettings,
    createRoom,
    updateRoom,
    deleteRoom,
    updateAccount,
    cancelAccount,
    reactivateAccount,
    setRoomOperationalStatus,
    createPensionClosure,
    updatePensionClosure,
    deletePensionClosure,
    setOccupancyRangeDays,
    setOccupancyStartDate,
    shiftOccupancyStartDate,
    jumpOccupancyToToday,
    dismissToast,
    logIn,
    logOut,
    startRegistration,
    verifyRegistrationCode,
    completeRegistration,
    resetDemo
  }
}

export type PensionStore = ReturnType<typeof createPensionStore>

const pensionStore = createPensionStore()

export function usePensionStore(): PensionStore {
  return pensionStore
}
