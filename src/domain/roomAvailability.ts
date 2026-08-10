import type { Booking, BookingView, PensionClosure, Pet, RequestAvailability, RoomView } from '../domain'
import { enumerateStayDates, isDateWithinStay, isValidBookingPeriod, isValidIsoDate } from './bookingPeriod'
import { doesStayOverlapClosure } from './pensionClosure'
import { isRoomCompatibleWithSpecies } from './roomCompatibility'

type BookingOccupancy = Pick<Booking, 'roomId' | 'arrivalDate' | 'departure' | 'status'>
type ReservablePet = Pick<Pet, 'species'>

export interface RoomBookingAvailability {
  room: RoomView
  availablePlaces: number
  peakOccupied: number
  peakDate: string | null
  wouldOverbook: boolean
}

export interface RequestRoomOptions {
  availability: RequestAvailability
  rooms: RoomView[]
}

/**
 * Determines whether every occupied night of a proposed stay still has a free place.
 * Checked-out bookings no longer consume capacity.
 */
export function hasRoomCapacityForStay(
  bookings: readonly BookingOccupancy[],
  roomId: string,
  capacity: number,
  arrivalDate: string,
  departureDate: string,
  requiredPlaces = 1
): boolean {
  if (capacity < 1 || requiredPlaces < 1 || !Number.isInteger(requiredPlaces)
    || !isValidIsoDate(arrivalDate) || !isValidIsoDate(departureDate) || departureDate < arrivalDate) return false

  const roomBookings = bookings.filter((booking) =>
    booking.roomId === roomId && booking.status !== 'checked-out')

  return enumerateStayDates(arrivalDate, departureDate).every((date) =>
    roomBookings.filter((booking) =>
      isDateWithinStay(date, booking.arrivalDate, booking.departure)).length + requiredPlaces <= capacity)
}

/**
 * Returns rooms that can host a pet for a complete, valid booking period.
 * Keeping this policy in the domain layer ensures all booking entry points
 * apply operational status, species compatibility, and capacity identically.
 */
export function selectAvailableRoomsForBooking(
  rooms: readonly RoomView[],
  bookings: readonly BookingView[],
  pet: ReservablePet | readonly ReservablePet[] | undefined,
  arrivalDate: string,
  arrivalTime: string,
  departureDate: string,
  closures: readonly PensionClosure[] = []
): RoomView[] {
  return selectRoomBookingAvailability(rooms, bookings, pet, arrivalDate, arrivalTime, departureDate, closures)
    .filter((availability) => !availability.wouldOverbook)
    .map((availability) => availability.room)
}

/**
 * Provides the decision-ready availability status shown on an incoming enquiry.
 * It deliberately uses the same period, closure, operational, species and capacity
 * rules as the actual booking workflow, so a green status always means the request
 * can be accepted into at least one room without overbooking.
 */
export function getRequestAvailability(
  rooms: readonly RoomView[],
  bookings: readonly BookingView[],
  pet: ReservablePet,
  arrivalDate: string,
  arrivalTime: string,
  departureDate: string,
  closures: readonly PensionClosure[] = []
): RequestAvailability {
  return getRequestRoomOptions(rooms, bookings, pet, arrivalDate, arrivalTime, departureDate, closures).availability
}

/**
 * Resolves the complete room decision for an incoming enquiry in one pass.
 * Consumers can render both the status and the selectable rooms from the
 * same policy result instead of reapplying availability rules independently.
 */
export function getRequestRoomOptions(
  rooms: readonly RoomView[],
  bookings: readonly BookingView[],
  pet: ReservablePet,
  arrivalDate: string,
  arrivalTime: string,
  departureDate: string,
  closures: readonly PensionClosure[] = []
): RequestRoomOptions {
  const compatibleRoomCount = rooms.filter((room) =>
    room.operationalState.status === 'ready' && isRoomCompatibleWithSpecies(room, pet.species)).length

  if (doesStayOverlapClosure(arrivalDate, departureDate, closures)) {
    return {
      availability: { status: 'closed', availableRoomCount: 0, compatibleRoomCount },
      rooms: []
    }
  }

  const availableRooms = selectAvailableRoomsForBooking(
    rooms, bookings, pet, arrivalDate, arrivalTime, departureDate, closures
  )
  return {
    availability: {
      status: availableRooms.length > 0 ? 'available' : 'unavailable',
      availableRoomCount: availableRooms.length,
      compatibleRoomCount
    },
    rooms: availableRooms
  }
}

/**
 * Supplies every operational and compatible room for a valid stay, including
 * rooms that need an explicit overbooking acknowledgement. Keeping that fact
 * in the domain model prevents UI-specific capacity calculations.
 */
export function selectRoomBookingAvailability(
  rooms: readonly RoomView[],
  bookings: readonly BookingView[],
  pet: ReservablePet | readonly ReservablePet[] | undefined,
  arrivalDate: string,
  arrivalTime: string,
  departureDate: string,
  closures: readonly PensionClosure[] = []
): RoomBookingAvailability[] {
  const pets = !pet ? [] : Array.isArray(pet) ? pet : [pet]
  if (!pets.length || !isValidBookingPeriod(arrivalDate, arrivalTime, departureDate)
    || doesStayOverlapClosure(arrivalDate, departureDate, closures)) return []

  const stayDates = enumerateStayDates(arrivalDate, departureDate)
  return rooms
    .filter((room) => room.operationalState.status === 'ready'
      && pets.every((item) => isRoomCompatibleWithSpecies(room, item.species)))
    .map((room) => {
      const roomBookings = bookings.filter((booking) => booking.roomId === room.id && booking.status !== 'checked-out')
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
        room,
        peakOccupied,
        peakDate,
        availablePlaces: Math.max(0, room.capacity - peakOccupied),
        wouldOverbook: peakOccupied + pets.length > room.capacity
      }
    })
}
