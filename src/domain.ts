export type PetSpecies = 'dog' | 'cat'
export type BookingStatus = 'confirmed' | 'checked-in' | 'checked-out'
export type RoomCategory = 'Hundezimmer' | 'Katzenzimmer'

export interface Customer {
  id: string
  firstName: string
  lastName: string
  /** Primary contact channel, also used to identify existing requesters. */
  email: string
  phone: string
}

export type NewCustomer = Omit<Customer, 'id'>

/** Editable contact data of an existing customer. The ID remains stable because
 * bookings and operational contact details refer to the same customer record. */
export type CustomerUpdate = Pick<Customer, 'firstName' | 'lastName' | 'email' | 'phone'>

export interface Pet {
  id: string
  customerId: Customer['id']
  name: string
  species: PetSpecies
  breed: string
  initials: string
  color: string
  note?: string
  /** Optional, structured operational handover instruction for medication. */
  medicationPlan?: string
  /** Optional feeding routine that accompanies the animal during a stay. */
  feedingPlan?: string
  /** Flags that the animal requires food brought by its owner rather than house food. */
  specialFood?: boolean
  /** Optional allergy and intolerance information needed during a stay. */
  allergyNote?: string
  /** Optional documented vaccination status for the operational handover. */
  vaccinationStatus?: string
  /** Optional veterinary practice to contact for this animal in an emergency. */
  veterinaryContact?: VeterinaryContact
}

export type NewPet = Pick<Pet, 'customerId' | 'name' | 'species' | 'breed' | 'note' | 'medicationPlan' | 'feedingPlan' | 'specialFood' | 'allergyNote' | 'vaccinationStatus' | 'veterinaryContact'>

/** Editable master data of an existing animal. Owner and species stay stable so
 * historical bookings keep their valid customer and room references. */
export type PetUpdate = Pick<Pet, 'name' | 'breed' | 'note' | 'medicationPlan' | 'feedingPlan' | 'specialFood' | 'allergyNote' | 'vaccinationStatus' | 'veterinaryContact'>

export interface VeterinaryContact {
  practiceName: string
  phone: string
}

export interface Room {
  id: string
  name: string
  category: RoomCategory
  capacity: number
}

/** Editable room master data. Rooms remain separate from pension settings because
 * bookings reference them directly. */
export type RoomInput = Pick<Room, 'name' | 'category' | 'capacity'>

export type RoomOperationalStatus = 'ready' | 'maintenance'

export interface RoomOperationalState {
  id: string
  roomId: Room['id']
  status: RoomOperationalStatus
  note?: string
  updatedAt: string
}

export interface RoomView extends Room {
  operationalState: RoomOperationalState
  guests: BookingView[]
  availablePlaces: number
}

export interface OccupancySummary {
  category: RoomCategory
  occupied: number
  capacity: number
}

export type OccupancyRangeDays = 7 | 14 | 30

export interface RoomTimelineSegment {
  date: string
  bookings: BookingView[]
  /** Fachlich abgeleiteter Füllstand des einzelnen Zimmers an diesem Tag. */
  level: OccupancyLevel
  isClosed: boolean
}

export interface RoomTimeline extends Room {
  operationalState: RoomOperationalState
  segments: RoomTimelineSegment[]
}

export interface DailyOccupancy {
  date: string
  occupied: number
  capacity: number
  availablePlaces: number
  rate: number
  level: OccupancyLevel
  isClosed: boolean
}

export type OccupancyLevel = 'low' | 'medium' | 'high' | 'full' | 'overbooked' | 'unavailable'

/** A transient user-facing confirmation, kept independently from any page. */
export interface ToastNotification {
  id: string
  message: string
  createdAt: string
}

export interface PensionClosure {
  id: string
  startDate: string
  endDate: string
  reason?: string
  createdAt: string
}

export type NewPensionClosure = Pick<PensionClosure, 'startDate' | 'endDate' | 'reason'>
export type PensionClosureUpdate = Pick<PensionClosure, 'startDate' | 'endDate' | 'reason'>

export interface RoomPeriodOccupancy {
  roomId: Room['id']
  capacity: number
  peakOccupied: number
  peakDate: string | null
  availablePlaces: number
}

/** Availability derived for a booking enquiry before a room is selected. */
export type RequestAvailabilityStatus = 'available' | 'unavailable' | 'closed'

export interface RequestAvailability {
  status: RequestAvailabilityStatus
  /** Operational, species-compatible rooms that can host the entire stay. */
  availableRoomCount: number
  /** Operational, species-compatible rooms considered for the request. */
  compatibleRoomCount: number
}

export interface Booking {
  id: string
  /** Links individual animal stays that were created together as one reservation. */
  reservationId?: string
  petId: Pet['id']
  roomId: Room['id']
  arrivalDate: string
  arrival: string
  departure: string
  createdAt: string
  /** Optional agreed collection time on the departure date (HH:mm). */
  pickupTime?: string
  /** Short operational note for this individual animal stay. */
  bookingNote?: string
  status: BookingStatus
  /** True when this stay was deliberately accepted beyond the room capacity. */
  overbooked?: boolean
  /** Immutable invoice snapshot created when the stay is checked out. */
  checkoutPrice?: StayPrice
}

export type NewBooking = Pick<Booking, 'petId' | 'roomId' | 'arrivalDate' | 'arrival' | 'departure' | 'pickupTime' | 'bookingNote'> & {
  customerId: Customer['id']
  allowOverbooking?: boolean
}

/** Editable planning fields of an arrival that has not been checked in yet. */
export type BookingUpdate = Pick<Booking, 'roomId' | 'arrivalDate' | 'arrival' | 'departure' | 'pickupTime' | 'bookingNote'> & {
  /** Requires an explicit acknowledgement when the changed stay exceeds capacity. */
  allowOverbooking?: boolean
}

/** A shared reservation may contain several animals from the same customer. */
export interface BookingReservation {
  id: string
  customerId: Customer['id']
  petIds: Pet['id'][]
  roomId: Room['id']
  arrivalDate: string
  arrival: string
  departure: string
  /** Optional common collection time for all animal stays in this reservation. */
  pickupTime?: string
  /** Optional common operational note, copied to each animal stay. */
  bookingNote?: string
  createdAt: string
}

export type NewBookingReservation = Omit<BookingReservation, 'id' | 'createdAt'> & {
  /** Requires an explicit acknowledgement in the booking UI. */
  allowOverbooking?: boolean
}

export interface BookingView extends Booking {
  pet: Pet
  customer: Customer
  room: Room
}

/** One continuous bar in the room-based booking timeline. */
export interface BookingTimelineBar {
  booking: BookingView
  startDay: number
  duration: number
}

/** A room (or the fallback slot for unassigned stays) with collision-free bar lanes. */
export interface BookingTimelineRow {
  id: string
  label: string
  room?: Room
  lanes: BookingTimelineBar[][]
}

export type DepartureView = BookingView

export type CheckInOutEventType = 'check-in' | 'check-in-reverted' | 'check-out'

export interface CheckInOutEvent {
  id: string
  bookingId: Booking['id']
  type: CheckInOutEventType
  occurredAt: string
}

export interface CheckInOutEventView extends CheckInOutEvent {
  booking: BookingView
}

export interface CustomerView extends Customer {
  pets: Pet[]
  bookings: BookingView[]
}

export interface PensionSettings {
  id: string
  businessName: string
  contactEmail: string
  contactPhone: string
  checkInFrom: string
  checkInUntil: string
  checkOutUntil: string
  requestsEnabled: boolean
  /** Simple base rate per accommodated animal and calendar day, in euro cents. */
  dailyPetRates: DailyPetRate[]
}

export type PensionSettingsUpdate = Omit<PensionSettings, 'id'>

export interface DailyPetRate {
  id: string
  species: PetSpecies
  amountCents: number
}

/** A transparent, derived checkout amount for one animal stay. */
export interface StayPrice {
  bookingId: Booking['id']
  dailyRateCents: number
  billableDays: number
  totalCents: number
}

/** A transparent planning total for one or several animals in a reservation. */
export interface ReservationPrice {
  stays: StayPrice[]
  totalCents: number
}

export type AccountRole = 'root' | 'staff'

export interface Account {
  id: string
  firstName: string
  lastName: string
  email: string
  role: AccountRole
  cancelledAt?: string
}

export type AccountUpdate = Pick<Account, 'firstName' | 'lastName' | 'email'>

export interface DemoEnvironment {
  id: string
  label: string
  scenario: string
  businessDate: string
  resetCount: number
  lastResetAt?: string
}

export type BookingRequestStatus = 'pending' | 'accepted' | 'declined'

/** A traceable, demo-local notification that belongs to a request decision. */
export interface BookingRequestNotification {
  channel: 'email'
  recipient: string
  status: 'scheduled'
  createdAt: string
}

export interface BookingRequest {
  id: string
  /** Set after an accepted request was assigned to a customer profile. */
  customerId?: Customer['id']
  customerFirstName: string
  customerLastName: string
  contactEmail: string
  phone: string
  petName: string
  species: PetSpecies
  breed: string
  arrivalDate: string
  arrival: string
  departure: string
  note?: string
  status: BookingRequestStatus
  submittedAt: string
  declineReason?: string
  declineNotification?: BookingRequestNotification
}
