import type {
  Booking,
  BookingRequest,
  BookingView,
  CheckInOutEvent,
  CheckInOutEventView,
  Customer,
  CustomerView,
  DailyOccupancy,
  DepartureView,
  OccupancyLevel,
  OccupancySummary,
  PensionClosure,
  Pet,
  Room,
  RoomOperationalState,
  RoomPeriodOccupancy,
  RoomTimeline,
  RoomView
} from '../domain'
import { enumerateStayDates, isDateWithinStay } from '../domain/bookingPeriod'
import { isDateWithinClosure } from '../domain/pensionClosure'

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
  bookingViews: readonly BookingView[],
  today: string
): DepartureView[] {
  return bookingViews.filter((booking) => booking.status === 'checked-in' && booking.departure === today)
}

/** Open arrivals for one operational calendar day. Kept next to departures so
 * every day-based check-in/out view applies the same booking status policy. */
export function selectArrivals(
  bookingViews: readonly BookingView[],
  date: string
): BookingView[] {
  return bookingViews.filter((booking) => booking.status === 'confirmed' && booking.arrivalDate === date)
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

export interface ReservationCandidates {
  pets: Pet[]
  customers: Customer[]
}

/**
 * Returns the customers and pets that may be selected for a new reservation.
 * A pet with an ongoing or upcoming stay cannot be reserved a second time.
 */
export function selectReservationCandidates(
  customers: readonly Customer[],
  pets: readonly Pet[],
  bookings: readonly Pick<Booking, 'petId' | 'status'>[]
): ReservationCandidates {
  const reservedPetIds = new Set(bookings
    .filter((booking) => booking.status !== 'checked-out')
    .map((booking) => booking.petId))
  const availablePets = pets.filter((pet) => !reservedPetIds.has(pet.id))
  const customerIdsWithAvailablePets = new Set(availablePets.map((pet) => pet.customerId))

  return {
    pets: availablePets,
    customers: customers.filter((customer) => customerIdsWithAvailablePets.has(customer.id))
  }
}

export function occupancyLevelFor(capacity: number, occupied: number): OccupancyLevel {
  if (capacity === 0) return 'unavailable'
  const rate = (occupied / capacity) * 100
  if (rate > 100) return 'overbooked'
  if (rate >= 100) return 'full'
  if (rate >= 80) return 'high'
  if (rate >= 50) return 'medium'
  return 'low'
}

export function selectRoomTimelines(
  rooms: readonly Room[],
  operationalStates: readonly RoomOperationalState[],
  bookingViews: readonly BookingView[],
  dates: readonly string[],
  closures: readonly PensionClosure[] = []
): RoomTimeline[] {
  const statesByRoom = new Map(operationalStates.map((state) => [state.roomId, state]))
  const bookingsByRoom = groupBy(selectActiveStayBookings(bookingViews), (booking) => booking.roomId)

  return rooms.map((room) => {
    const operationalState = statesByRoom.get(room.id)
    if (!operationalState) throw new Error(`Fehlender Betriebsstatus für Zimmer ${room.id}`)

    const roomBookings = bookingsByRoom.get(room.id) ?? []
    const segments = dates.map((date) => {
      const bookings = roomBookings.filter((booking) => isDateWithinStay(date, booking.arrivalDate, booking.departure))
      const isClosed = closures.some((closure) => isDateWithinClosure(date, closure))
      return {
        date,
        bookings,
        level: isClosed ? 'unavailable' : occupancyLevelFor(room.capacity, bookings.length),
        isClosed
      }
    })
    return { ...room, operationalState, segments }
  })
}

export function selectDailyOccupancy(
  rooms: readonly Room[],
  operationalStates: readonly RoomOperationalState[],
  bookingViews: readonly BookingView[],
  dates: readonly string[],
  closures: readonly PensionClosure[] = []
): DailyOccupancy[] {
  const readyRoomIds = new Set(operationalStates
    .filter((state) => state.status === 'ready')
    .map((state) => state.roomId))
  const capacity = rooms
    .filter((room) => readyRoomIds.has(room.id))
    .reduce((sum, room) => sum + room.capacity, 0)
  const activeBookings = selectActiveStayBookings(bookingViews)

  return dates.map((date) => {
    const isClosed = closures.some((closure) => isDateWithinClosure(date, closure))
    const occupied = activeBookings.filter((booking) => isDateWithinStay(date, booking.arrivalDate, booking.departure)).length
    const availableCapacity = isClosed ? 0 : capacity
    return {
      date,
      occupied,
      capacity: availableCapacity,
      availablePlaces: Math.max(0, availableCapacity - occupied),
      rate: availableCapacity === 0 ? 0 : Math.round((occupied / availableCapacity) * 100),
      level: occupancyLevelFor(availableCapacity, occupied),
      isClosed
    }
  })
}

export function selectRoomOccupancyForPeriod(
  room: Room,
  bookingViews: readonly BookingView[],
  arrivalDate: string,
  departureDate: string
): RoomPeriodOccupancy {
  const stayDates = enumerateStayDates(arrivalDate, departureDate)
  const roomBookings = selectActiveStayBookings(bookingViews).filter((booking) => booking.roomId === room.id)

  let peakOccupied = 0
  let peakDate: string | null = null
  for (const date of stayDates) {
    const occupied = roomBookings.filter((booking) => isDateWithinStay(date, booking.arrivalDate, booking.departure)).length
    if (occupied > peakOccupied) {
      peakOccupied = occupied
      peakDate = date
    }
  }

  return {
    roomId: room.id,
    capacity: room.capacity,
    peakOccupied,
    peakDate,
    availablePlaces: Math.max(0, room.capacity - peakOccupied)
  }
}

export function selectPendingRequests(requests: readonly BookingRequest[]): BookingRequest[] {
  return requests
    .filter((request) => request.status === 'pending')
    .sort((first, second) => first.submittedAt.localeCompare(second.submittedAt))
}

export function selectRequestHistory(requests: readonly BookingRequest[]): BookingRequest[] {
  return requests
    .filter((request) => request.status !== 'pending')
    .sort((first, second) => second.submittedAt.localeCompare(first.submittedAt))
}

export function selectCheckInOutHistory(
  events: readonly CheckInOutEvent[],
  bookingViews: readonly BookingView[]
): CheckInOutEventView[] {
  const bookingsById = indexById(bookingViews)

  return events
    .map((event) => ({ ...event, booking: bookingsById.get(event.bookingId) }))
    .filter((event): event is CheckInOutEventView => Boolean(event.booking))
    .sort((first, second) => second.occurredAt.localeCompare(first.occurredAt)
      || second.id.localeCompare(first.id, undefined, { numeric: true }))
}
