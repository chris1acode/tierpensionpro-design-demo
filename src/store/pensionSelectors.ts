import type {
  Booking,
  BookingView,
  CheckoutHandover,
  Customer,
  CustomerView,
  DailyOccupancy,
  DepartureView,
  OccupancySummary,
  Pet,
  Room,
  RoomOperationalState,
  RoomTimeline,
  RoomView
} from '../domain'
import { isDateWithinStay } from '../domain/bookingPeriod'

function indexById<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

function groupBy<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>()
  for (const item of items) {
    const key = keyOf(item)
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }
  return groups
}

export function selectBookingViews(
  bookings: readonly Booking[],
  pets: readonly Pet[],
  customers: readonly Customer[],
  rooms: readonly Room[]
): BookingView[] {
  const petsById = indexById(pets)
  const customersById = indexById(customers)
  const roomsById = indexById(rooms)

  return bookings.map((booking) => {
    const pet = petsById.get(booking.petId)
    const room = roomsById.get(booking.roomId)
    const customer = pet && customersById.get(pet.customerId)
    if (!pet || !room || !customer) throw new Error(`Ungültige Referenz in Buchung ${booking.id}`)
    return { ...booking, pet, room, customer }
  })
}

export function selectCustomerViews(
  customers: readonly Customer[],
  pets: readonly Pet[],
  bookingViews: readonly BookingView[]
): CustomerView[] {
  const petsByCustomer = groupBy(pets, (pet) => pet.customerId)
  const bookingsByCustomer = groupBy(bookingViews, (booking) => booking.customer.id)

  return customers.map((customer) => ({
    ...customer,
    pets: petsByCustomer.get(customer.id) ?? [],
    bookings: bookingsByCustomer.get(customer.id) ?? []
  })).sort((first, second) => first.lastName.localeCompare(second.lastName, 'de'))
}

export function selectDepartures(
  handovers: readonly CheckoutHandover[],
  bookingViews: readonly BookingView[]
): DepartureView[] {
  const bookingsById = indexById(bookingViews)

  return handovers.map((handover) => {
    const booking = bookingsById.get(handover.bookingId)
    if (!booking) throw new Error(`Ungültige Referenz in Übergabe ${handover.id}`)
    return { ...booking, handover }
  }).filter((departure) => departure.status === 'checked-in')
}

export function selectRoomViews(
  rooms: readonly Room[],
  checkedIn: readonly BookingView[],
  operationalStates: readonly RoomOperationalState[]
): RoomView[] {
  const guestsByRoom = groupBy(checkedIn, (booking) => booking.roomId)
  const statesByRoom = new Map(operationalStates.map((state) => [state.roomId, state]))

  return rooms.map((room) => {
    const guests = guestsByRoom.get(room.id) ?? []
    const operationalState = statesByRoom.get(room.id)
    if (!operationalState) throw new Error(`Fehlender Betriebsstatus für Zimmer ${room.id}`)
    return {
      ...room,
      operationalState,
      guests,
      availablePlaces: operationalState.status === 'ready' ? Math.max(0, room.capacity - guests.length) : 0
    }
  })
}

export function selectOccupancyByCategory(
  rooms: readonly Room[],
  checkedIn: readonly BookingView[]
): OccupancySummary[] {
  const roomsByCategory = groupBy(rooms, (room) => room.category)
  const guestsByCategory = groupBy(checkedIn, (booking) => booking.room.category)

  return [...roomsByCategory].map(([category, categoryRooms]) => ({
    category,
    occupied: guestsByCategory.get(category)?.length ?? 0,
    capacity: categoryRooms.reduce((sum, room) => sum + room.capacity, 0)
  }))
}

function selectActiveStayBookings(bookingViews: readonly BookingView[]): BookingView[] {
  return bookingViews.filter((booking) => booking.status !== 'checked-out')
}

export function selectRoomTimelines(
  rooms: readonly Room[],
  operationalStates: readonly RoomOperationalState[],
  bookingViews: readonly BookingView[],
  dates: readonly string[]
): RoomTimeline[] {
  const statesByRoom = new Map(operationalStates.map((state) => [state.roomId, state]))
  const bookingsByRoom = groupBy(selectActiveStayBookings(bookingViews), (booking) => booking.roomId)

  return rooms.map((room) => {
    const operationalState = statesByRoom.get(room.id)
    if (!operationalState) throw new Error(`Fehlender Betriebsstatus für Zimmer ${room.id}`)

    const roomBookings = bookingsByRoom.get(room.id) ?? []
    const segments = dates.map((date) => ({
      date,
      bookings: roomBookings.filter((booking) => isDateWithinStay(date, booking.arrivalDate, booking.departure))
    }))
    return { ...room, operationalState, segments }
  })
}

export function selectDailyOccupancy(
  rooms: readonly Room[],
  operationalStates: readonly RoomOperationalState[],
  bookingViews: readonly BookingView[],
  dates: readonly string[]
): DailyOccupancy[] {
  const readyRoomIds = new Set(operationalStates
    .filter((state) => state.status === 'ready')
    .map((state) => state.roomId))
  const capacity = rooms
    .filter((room) => readyRoomIds.has(room.id))
    .reduce((sum, room) => sum + room.capacity, 0)
  const activeBookings = selectActiveStayBookings(bookingViews)

  return dates.map((date) => {
    const occupied = activeBookings.filter((booking) => isDateWithinStay(date, booking.arrivalDate, booking.departure)).length
    return { date, occupied, capacity, rate: capacity === 0 ? 0 : Math.round((occupied / capacity) * 100) }
  })
}
