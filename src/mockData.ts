import type { Booking, CheckoutHandover, Customer, PensionSettings, Pet, Room, RoomOperationalState } from './domain'

export const initialPensionSettings: PensionSettings = {
  id: 'settings-1',
  businessName: 'Tierpension Pro',
  contactEmail: 'hallo@tierpension-pro.de',
  contactPhone: '030 555 01 820',
  checkInFrom: '08:00',
  checkInUntil: '12:00',
  checkOutUntil: '18:00'
}

export const customers: Customer[] = [
  { id: 'c-1', firstName: 'Sofia', lastName: 'Berger', phone: '0176 445 21 90' },
  { id: 'c-2', firstName: 'Jonas', lastName: 'Klein', phone: '0151 820 44 13' },
  { id: 'c-3', firstName: 'Mara', lastName: 'Hoffmann', phone: '0172 339 80 02' },
  { id: 'c-4', firstName: 'Nina', lastName: 'Schulz', phone: '0160 791 62 18' },
  { id: 'c-5', firstName: 'David', lastName: 'Koch', phone: '0178 220 65 74' },
  { id: 'c-6', firstName: 'Lea', lastName: 'Albrecht', phone: '0157 312 48 06' },
  { id: 'c-7', firstName: 'Tobias', lastName: 'Bauer', phone: '0176 908 17 42' },
  { id: 'c-8', firstName: 'Emilia', lastName: 'Fischer', phone: '0151 654 39 21' },
  { id: 'c-9', firstName: 'Felix', lastName: 'Krüger', phone: '0172 483 70 15' },
  { id: 'c-10', firstName: 'Johanna', lastName: 'Neumann', phone: '0160 225 84 63' },
  { id: 'c-11', firstName: 'Paul', lastName: 'Richter', phone: '0178 761 02 49' },
  { id: 'c-12', firstName: 'Clara', lastName: 'Vogel', phone: '0152 396 18 57' }
]

export const pets: Pet[] = [
  { id: 'p-1', customerId: 'c-1', name: 'Balu', species: 'dog', breed: 'Golden Retriever', initials: 'BA', color: '#DCE9E5', note: 'Benötigt sein Schilddrüsenmedikament um 18 Uhr.' },
  { id: 'p-2', customerId: 'c-2', name: 'Milo', species: 'cat', breed: 'Britisch Kurzhaar', initials: 'MI', color: '#F3E3D7' },
  { id: 'p-3', customerId: 'c-3', name: 'Luna', species: 'dog', breed: 'Labrador', initials: 'LU', color: '#E8E1F0' },
  { id: 'p-4', customerId: 'c-4', name: 'Nala', species: 'cat', breed: 'Europäisch Kurzhaar', initials: 'NA', color: '#E5E9D8', note: 'Bitte nur das mitgebrachte Futter verwenden.' },
  { id: 'p-5', customerId: 'c-5', name: 'Rocky', species: 'dog', breed: 'Beagle', initials: 'RO', color: '#DCE7F0' },
  { id: 'p-6', customerId: 'c-6', name: 'Frieda', species: 'dog', breed: 'Havaneser', initials: 'FR', color: '#F1E1D5' },
  { id: 'p-7', customerId: 'c-7', name: 'Simba', species: 'cat', breed: 'Maine Coon', initials: 'SI', color: '#E2E8D8' },
  { id: 'p-8', customerId: 'c-8', name: 'Oskar', species: 'dog', breed: 'Dackel', initials: 'OS', color: '#E9DDE8' },
  { id: 'p-9', customerId: 'c-9', name: 'Loki', species: 'cat', breed: 'Siamkatze', initials: 'LO', color: '#DCE8ED' },
  { id: 'p-10', customerId: 'c-10', name: 'Maja', species: 'dog', breed: 'Border Collie', initials: 'MA', color: '#EEE5D6' },
  { id: 'p-11', customerId: 'c-11', name: 'Pepe', species: 'dog', breed: 'Mops', initials: 'PE', color: '#DFE7DC' },
  { id: 'p-12', customerId: 'c-12', name: 'Minou', species: 'cat', breed: 'Heilige Birma', initials: 'MN', color: '#E5E1EF' }
]

export const rooms: Room[] = [
  { id: 'r-1', name: 'Waldzimmer 1', category: 'Hundezimmer', capacity: 2 },
  { id: 'r-2', name: 'Gartenzimmer 2', category: 'Hundezimmer', capacity: 2 },
  { id: 'r-3', name: 'Katzenloft 1', category: 'Katzenzimmer', capacity: 2 },
  { id: 'r-4', name: 'Katzenloft 2', category: 'Katzenzimmer', capacity: 1 }
]

export const initialRoomOperationalStates: RoomOperationalState[] = rooms.map((room, index) => ({
  id: `room-state-${index + 1}`,
  roomId: room.id,
  status: 'ready',
  updatedAt: '2026-08-09T06:00:00.000Z'
}))

export const initialBookings: Booking[] = [
  { id: 'b-1', petId: 'p-1', roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '08:30', departure: '2026-08-12', status: 'confirmed' },
  { id: 'b-2', petId: 'p-2', roomId: 'r-3', arrivalDate: '2026-08-09', arrival: '09:15', departure: '2026-08-11', status: 'confirmed' },
  { id: 'b-3', petId: 'p-3', roomId: 'r-2', arrivalDate: '2026-08-08', arrival: '07:45', departure: '2026-08-10', status: 'checked-in' },
  { id: 'b-4', petId: 'p-4', roomId: 'r-4', arrivalDate: '2026-08-10', arrival: '10:30', departure: '2026-08-14', status: 'confirmed' },
  { id: 'b-5', petId: 'p-5', roomId: 'r-1', arrivalDate: '2026-08-07', arrival: '11:00', departure: '2026-08-09', status: 'checked-in' },
  { id: 'b-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-07-14', arrival: '09:00', departure: '2026-07-18', status: 'checked-out' },
  { id: 'b-7', petId: 'p-7', roomId: 'r-3', arrivalDate: '2026-07-19', arrival: '10:15', departure: '2026-07-22', status: 'checked-out' },
  { id: 'b-8', petId: 'p-8', roomId: 'r-1', arrivalDate: '2026-06-10', arrival: '08:45', departure: '2026-06-14', status: 'checked-out' },
  { id: 'b-9', petId: 'p-9', roomId: 'r-4', arrivalDate: '2026-06-25', arrival: '11:30', departure: '2026-06-29', status: 'checked-out' },
  { id: 'b-10', petId: 'p-10', roomId: 'r-2', arrivalDate: '2026-05-07', arrival: '07:30', departure: '2026-05-11', status: 'checked-out' },
  { id: 'b-11', petId: 'p-11', roomId: 'r-1', arrivalDate: '2026-04-23', arrival: '09:45', departure: '2026-04-26', status: 'checked-out' },
  { id: 'b-12', petId: 'p-12', roomId: 'r-3', arrivalDate: '2026-04-04', arrival: '10:00', departure: '2026-04-08', status: 'checked-out' }
]

export const initialCheckoutHandovers: CheckoutHandover[] = [
  {
    id: 'handover-1',
    bookingId: 'b-5',
    belongingsReturned: false,
    medicationReturned: false,
    roomChecked: false
  }
]
