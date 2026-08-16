import type {
  Account,
  Booking,
  BookingRequest,
  BookingReservation,
  CheckInOutEvent,
  Customer,
  DemoSession,
  DemoEnvironment,
  PensionClosure,
  PensionSettings,
  Pet,
  Room,
  RoomOperationalState
} from '../domain'
import {
  customers as initialCustomers,
  initialAccount,
  initialBookingReservations,
  initialBookingRequests,
  initialBookings,
  initialCheckInOutEvents,
  initialDemoEnvironment,
  initialDemoSession,
  initialPensionClosures,
  initialPensionSettings,
  initialRoomOperationalStates,
  pets as initialPets,
  rooms as initialRooms
} from '../mockData'

export interface DemoState {
  account: Account
  demoSession: DemoSession
  bookingRequests: BookingRequest[]
  bookingReservations: BookingReservation[]
  bookings: Booking[]
  checkInOutEvents: CheckInOutEvent[]
  customers: Customer[]
  demoEnvironment: DemoEnvironment
  pensionClosures: PensionClosure[]
  pets: Pet[]
  roomOperationalStates: RoomOperationalState[]
  rooms: Room[]
  settings: PensionSettings
}

/**
 * Creates an isolated mutable snapshot of the demo fixtures.
 *
 * Both a fresh store and `resetDemo` use this single policy, so adding a new
 * fixture collection only requires one explicit update here.
 */
export function createDemoState(): DemoState {
  return {
    account: { ...initialAccount },
    demoSession: { ...initialDemoSession },
    bookingRequests: initialBookingRequests.map((request) => ({
      ...request,
      declineNotification: request.declineNotification && { ...request.declineNotification }
    })),
    bookingReservations: initialBookingReservations.map((reservation) => ({
      ...reservation,
      petIds: [...reservation.petIds]
    })),
    bookings: initialBookings.map((booking) => ({ ...booking })),
    checkInOutEvents: initialCheckInOutEvents.map((event) => ({ ...event })),
    customers: initialCustomers.map((customer) => ({ ...customer })),
    demoEnvironment: { ...initialDemoEnvironment },
    pensionClosures: initialPensionClosures.map((closure) => ({ ...closure })),
    pets: initialPets.map((pet) => ({ ...pet })),
    roomOperationalStates: initialRoomOperationalStates.map((state) => ({ ...state })),
    rooms: initialRooms.map((room) => ({ ...room })),
    settings: {
      ...initialPensionSettings,
      dailyPetRates: initialPensionSettings.dailyPetRates.map((rate) => ({ ...rate }))
    }
  }
}
