import { computed, reactive, ref } from 'vue'
import type { Booking, CheckoutChecklist, CheckoutHandover, NewBooking, NewCustomer, NewPet, OccupancyRangeDays, PensionSettingsUpdate, RoomOperationalStatus } from './domain'
import { buildDateRange, isValidBookingPeriod, toLocalIsoDate } from './domain/bookingPeriod'
import { createCustomerProfile } from './domain/customerProfile'
import { createPetProfile } from './domain/petProfile'
import { isValidPensionSettingsUpdate } from './domain/pensionSettings'
import { isRoomCompatibleWithSpecies } from './domain/roomCompatibility'
import {
  customers as initialCustomers,
  initialBookings,
  initialCheckoutHandovers,
  initialPensionSettings,
  initialRoomOperationalStates,
  pets as initialPets,
  rooms as initialRooms
} from './mockData'
import {
  selectBookingViews,
  selectCustomerViews,
  selectDailyOccupancy,
  selectDepartures,
  selectOccupancyByCategory,
  selectRoomTimelines,
  selectRoomViews
} from './store/pensionSelectors'
import { nextEntityId } from './store/nextEntityId'

export interface PensionStoreDependencies {
  now: () => Date
}

const defaultDependencies: PensionStoreDependencies = {
  now: () => new Date()
}

export function createPensionStore(dependencies: PensionStoreDependencies = defaultDependencies) {
  const customers = reactive(initialCustomers.map((customer) => ({ ...customer })))
  const pets = reactive(initialPets.map((pet) => ({ ...pet })))
  const rooms = reactive(initialRooms.map((room) => ({ ...room })))
  const roomOperationalStates = reactive(initialRoomOperationalStates.map((state) => ({ ...state })))
  const bookings = reactive<Booking[]>(initialBookings.map((booking) => ({ ...booking })))
  const checkoutHandovers = reactive<CheckoutHandover[]>(initialCheckoutHandovers.map((handover) => ({ ...handover })))
  const settings = reactive({ ...initialPensionSettings })
  const announcement = ref('')
  const occupancyRangeDays = ref<OccupancyRangeDays>(14)

  const bookingViews = computed(() => selectBookingViews(bookings, pets, customers, rooms))

  const arrivals = computed(() => {
    const today = toLocalIsoDate(dependencies.now())
    return bookingViews.value.filter((item) => item.status === 'confirmed' && item.arrivalDate === today)
  })
  const customerViews = computed(() => selectCustomerViews(customers, pets, bookingViews.value))
  const checkedIn = computed(() => bookingViews.value.filter((item) => item.status === 'checked-in'))
  const departures = computed(() => selectDepartures(checkoutHandovers, bookingViews.value))
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
  const occupancyDates = computed(() => buildDateRange(dependencies.now(), occupancyRangeDays.value))
  const roomTimelines = computed(() => selectRoomTimelines(rooms, roomOperationalStates, bookingViews.value, occupancyDates.value))
  const dailyOccupancy = computed(() => selectDailyOccupancy(rooms, roomOperationalStates, bookingViews.value, occupancyDates.value))

  function checkIn(bookingId: string): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    const room = booking && rooms.find((item) => item.id === booking.roomId)
    const roomState = roomOperationalStates.find((item) => item.roomId === booking?.roomId)
    if (!booking || !pet || !room || roomState?.status !== 'ready' || booking.status !== 'confirmed') return false

    const occupiedPlaces = bookings.filter((item) => item.roomId === room.id && item.status === 'checked-in').length
    if (occupiedPlaces >= room.capacity) return false

    booking.status = 'checked-in'
    announcement.value = `${pet.name} ist jetzt eingecheckt.`
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
    if (!petBelongsToCustomer || !room || !speciesMatchesRoom || !roomIsReady || hasActiveBooking
      || !isValidBookingPeriod(input.arrivalDate, input.arrival, input.departure)) return false

    bookings.push({
      id: nextEntityId(bookings, 'b'),
      petId: input.petId,
      roomId: input.roomId,
      arrivalDate: input.arrivalDate,
      arrival: input.arrival,
      departure: input.departure,
      status: 'confirmed'
    })
    announcement.value = `Die Buchung für ${pet.name} wurde angelegt.`
    return true
  }

  function createPet(input: NewPet): boolean {
    const customer = customers.find((item) => item.id === input.customerId)
    const id = nextEntityId(pets, 'p')
    const pet = createPetProfile(id, input)
    if (!customer || !pet) return false

    pets.push(pet)
    announcement.value = `${pet.name} wurde im Kundenprofil angelegt.`
    return true
  }

  function createCustomer(input: NewCustomer): boolean {
    const customer = createCustomerProfile(
      nextEntityId(customers, 'c'),
      input,
      customers.map((item) => item.phone)
    )
    if (!customer) return false

    customers.push(customer)
    announcement.value = `${customer.firstName} ${customer.lastName} wurde im Kundenverzeichnis angelegt.`
    return true
  }

  function completeCheckout(bookingId: string, checklist: CheckoutChecklist): boolean {
    const booking = bookings.find((item) => item.id === bookingId)
    const handover = checkoutHandovers.find((item) => item.bookingId === bookingId)
    const pet = booking && pets.find((item) => item.id === booking.petId)
    if (!booking || !handover || !pet || booking.status !== 'checked-in') return false
    if (!checklist.belongingsReturned || !checklist.medicationReturned || !checklist.roomChecked) return false
    Object.assign(handover, checklist)
    booking.status = 'checked-out'
    handover.completedAt = dependencies.now().toISOString()
    announcement.value = `${pet.name} wurde ausgecheckt. Das Zimmer ist wieder frei.`
    return true
  }

  function updateSettings(input: PensionSettingsUpdate): boolean {
    if (!isValidPensionSettingsUpdate(input)) return false

    Object.assign(settings, input)
    announcement.value = 'Die Einstellungen wurden gespeichert.'
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
    announcement.value = status === 'ready'
      ? `${room.name} ist wieder verfügbar.`
      : `${room.name} wurde vorübergehend gesperrt.`
    return true
  }

  function setOccupancyRangeDays(days: OccupancyRangeDays): void {
    occupancyRangeDays.value = days
  }

  function resetDemo() {
    customers.splice(0, customers.length, ...initialCustomers.map((customer) => ({ ...customer })))
    pets.splice(0, pets.length, ...initialPets.map((pet) => ({ ...pet })))
    rooms.splice(0, rooms.length, ...initialRooms.map((room) => ({ ...room })))
    roomOperationalStates.splice(0, roomOperationalStates.length, ...initialRoomOperationalStates.map((state) => ({ ...state })))
    bookings.splice(0, bookings.length, ...initialBookings.map((booking) => ({ ...booking })))
    checkoutHandovers.splice(0, checkoutHandovers.length, ...initialCheckoutHandovers.map((handover) => ({ ...handover })))
    Object.assign(settings, initialPensionSettings)
    occupancyRangeDays.value = 14
    announcement.value = 'Die Demo-Daten wurden zurückgesetzt.'
  }

  return {
    bookingViews,
    customerViews,
    announcement,
    arrivals,
    checkedIn,
    departures,
    totalCapacity,
    occupancyRate,
    occupancyByCategory,
    occupancyRangeDays,
    occupancyDates,
    roomTimelines,
    dailyOccupancy,
    roomViews,
    customers,
    pets,
    rooms,
    roomOperationalStates,
    settings,
    createBooking,
    createCustomer,
    createPet,
    checkIn,
    completeCheckout,
    updateSettings,
    setRoomOperationalStatus,
    setOccupancyRangeDays,
    resetDemo
  }
}

export type PensionStore = ReturnType<typeof createPensionStore>

const pensionStore = createPensionStore()

export function usePensionStore(): PensionStore {
  return pensionStore
}
