export type PetSpecies = 'dog' | 'cat'
export type BookingStatus = 'confirmed' | 'checked-in' | 'checked-out'
export type RoomCategory = 'Hundezimmer' | 'Katzenzimmer'

export interface Customer {
  id: string
  firstName: string
  lastName: string
  phone: string
}

export type NewCustomer = Omit<Customer, 'id'>

export interface Pet {
  id: string
  customerId: Customer['id']
  name: string
  species: PetSpecies
  breed: string
  initials: string
  color: string
  note?: string
}

export type NewPet = Pick<Pet, 'customerId' | 'name' | 'species' | 'breed' | 'note'>

export interface Room {
  id: string
  name: string
  category: RoomCategory
  capacity: number
}

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
}

export interface RoomTimeline extends Room {
  operationalState: RoomOperationalState
  segments: RoomTimelineSegment[]
}

export interface DailyOccupancy {
  date: string
  occupied: number
  capacity: number
  rate: number
}

export interface Booking {
  id: string
  petId: Pet['id']
  roomId: Room['id']
  arrivalDate: string
  arrival: string
  departure: string
  status: BookingStatus
}

export type NewBooking = Pick<Booking, 'petId' | 'roomId' | 'arrivalDate' | 'arrival' | 'departure'> & {
  customerId: Customer['id']
}

export interface BookingView extends Booking {
  pet: Pet
  customer: Customer
  room: Room
}

export interface CheckoutHandover {
  id: string
  bookingId: Booking['id']
  belongingsReturned: boolean
  medicationReturned: boolean
  roomChecked: boolean
  completedAt?: string
}

export type CheckoutChecklist = Pick<
  CheckoutHandover,
  'belongingsReturned' | 'medicationReturned' | 'roomChecked'
>

export interface DepartureView extends BookingView {
  handover: CheckoutHandover
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
}

export type PensionSettingsUpdate = Omit<PensionSettings, 'id'>
