import type { Account, Booking, BookingRequest, BookingReservation, CheckInOutEvent, Customer, DemoEnvironment, PensionClosure, PensionSettings, Pet, Room, RoomOperationalState } from './domain'

export const initialAccount: Account = {
  id: 'acc-1',
  firstName: 'Robin',
  lastName: 'Muster',
  email: 'robin@tierpension-pro.de',
  role: 'root'
}

export const initialPensionSettings: PensionSettings = {
  id: 'settings-1',
  businessName: 'Tierpension Pro',
  contactEmail: 'hallo@tierpension-pro.de',
  contactPhone: '030 555 01 820',
  checkInFrom: '08:00',
  checkInUntil: '12:00',
  checkOutUntil: '18:00',
  requestsEnabled: true,
  dailyPetRates: [
    { id: 'rate-dog', species: 'dog', amountCents: 3500 },
    { id: 'rate-cat', species: 'cat', amountCents: 2400 }
  ]
}

const coreCustomers: Customer[] = [
  { id: 'c-1', firstName: 'Sofia', lastName: 'Berger', email: 'sofia.berger@example.de', phone: '0176 445 21 90', emergencyContact: { name: 'Tobias Berger', phone: '0176 445 21 91' } },
  { id: 'c-2', firstName: 'Jonas', lastName: 'Klein', email: 'jonas.klein@example.de', phone: '0151 820 44 13' },
  { id: 'c-3', firstName: 'Mara', lastName: 'Hoffmann', email: 'mara.hoffmann@example.de', phone: '0172 339 80 02' },
  { id: 'c-4', firstName: 'Nina', lastName: 'Schulz', email: 'nina.schulz@example.de', phone: '0160 791 62 18' },
  { id: 'c-5', firstName: 'David', lastName: 'Koch', email: 'david.koch@example.de', phone: '0178 220 65 74' },
  { id: 'c-6', firstName: 'Lea', lastName: 'Albrecht', email: 'lea.albrecht@example.de', phone: '0157 312 48 06' },
  { id: 'c-7', firstName: 'Tobias', lastName: 'Bauer', email: 'tobias.bauer@example.de', phone: '0176 908 17 42' },
  { id: 'c-8', firstName: 'Emilia', lastName: 'Fischer', email: 'emilia.fischer@example.test', phone: '0151 654 39 21' },
  { id: 'c-9', firstName: 'Felix', lastName: 'Krüger', email: 'felix.krueger@example.de', phone: '0172 483 70 15' },
  { id: 'c-10', firstName: 'Johanna', lastName: 'Neumann', email: 'johanna.neumann@example.de', phone: '0160 225 84 63' },
  { id: 'c-11', firstName: 'Paul', lastName: 'Richter', email: 'paul.richter@example.de', phone: '0178 761 02 49' },
  { id: 'c-12', firstName: 'Clara', lastName: 'Vogel', email: 'clara.vogel@example.de', phone: '0152 396 18 57' }
]

const corePets: Pet[] = [
  { id: 'p-1', customerId: 'c-1', name: 'Balu', species: 'dog', breed: 'Golden Retriever', initials: 'BA', color: '#DCE9E5', note: 'Bitte mit dem gewohnten Futter füttern.', feedingPlan: 'Morgens und abends je 180 g des mitgebrachten Trockenfutters; kein Rind.', medicationPlan: 'Schilddrüsenmedikament: 1 Tablette täglich um 18 Uhr mit dem Abendfutter.', allergyNote: 'Unverträglichkeit gegen Rind; keine Rinderleckerlis geben.', vaccinationStatus: 'Impfpass geprüft: Staupe, Hepatitis, Parvovirose und Tollwut gültig bis März 2027.', veterinaryContact: { practiceName: 'Tierarztpraxis am Park', phone: '030 554 82 19' } },
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
  { id: 'p-12', customerId: 'c-12', name: 'Minou', species: 'cat', breed: 'Heilige Birma', initials: 'MN', color: '#E5E1EF' },
  { id: 'p-13', customerId: 'c-6', name: 'Willi', species: 'dog', breed: 'Havaneser', initials: 'WI', color: '#E7E0D4', note: 'Reist gemeinsam mit Frieda an.' }
]

/**
 * The directory intentionally contains a realistic amount of data.  The
 * generated fixtures are still complete domain entities (rather than rows
 * invented by the UI), which makes pagination, search and CSV export useful
 * in the click dummy.
 */
const additionalCustomerNames = [
  ['Anna', 'Becker'], ['Ben', 'Hartmann'], ['Carla', 'Jäger'], ['Daniel', 'König'],
  ['Eva', 'Lang'], ['Finn', 'Meyer'], ['Greta', 'Otto'], ['Henrik', 'Peters'],
  ['Ida', 'Reuter'], ['Jan', 'Schmitt'], ['Kira', 'Seidel'], ['Lars', 'Thiele'],
  ['Mia', 'Ulrich'], ['Noah', 'Winter'], ['Olivia', 'Ziegler'], ['Philipp', 'Arnold'],
  ['Romy', 'Bender'], ['Sven', 'Dietrich'], ['Tanja', 'Engel'], ['Uwe', 'Franke'],
  ['Vera', 'Graf'], ['Wiebke', 'Hein'], ['Yannik', 'Kaiser'], ['Zoe', 'Lenz'],
  ['Amir', 'Müller'], ['Bianca', 'Noll'], ['Cem', 'Opitz'], ['Daria', 'Prüfer'],
  ['Enno', 'Reinhardt'], ['Frida', 'Sander'], ['Gero', 'Theis'], ['Helena', 'Urban'],
  ['Ibrahim', 'Voigt'], ['Jule', 'Wendt'], ['Konrad', 'Zander'], ['Lina', 'Ahrens'],
  ['Moritz', 'Bach'], ['Nele', 'Dorn'], ['Ole', 'Ebert'], ['Pia', 'Falk'],
  ['Quinn', 'Götz'], ['Rike', 'Hahn'], ['Sami', 'Ihle'], ['Thea', 'Jansen'],
  ['Ulf', 'Kern'], ['Viola', 'Lorenz'], ['Willi', 'Maas'], ['Xenia', 'Niemann'],
  ['Yara', 'Ostermann'], ['Zita', 'Pohl'], ['Anton', 'Riedel'], ['Britta', 'Saal'],
  ['Cora', 'Tesch'], ['Dieter', 'Unger'], ['Elena', 'Voss'], ['Fabian', 'Weber'],
  ['Gina', 'Zorn'], ['Hugo', 'Aumann'], ['Ines', 'Birk'], ['Joris', 'Claßen'],
  ['Karla', 'Damm'], ['Lennart', 'Ernst'], ['Mona', 'Fink'], ['Nico', 'Grau'],
  ['Orla', 'Held'], ['Peer', 'Imhof'], ['Rita', 'Johannsen'], ['Sascha', 'Kühn'],
  ['Tilda', 'Lohmann'], ['Udo', 'Mertens'], ['Valerie', 'Nau'], ['Wolfram', 'Otte'],
  ['Yvonne', 'Rasch'], ['Zeno', 'Schade'], ['Alma', 'Timm'], ['Bela', 'Uhl'],
  ['Cleo', 'Veit'], ['Dirk', 'Wolter'], ['Edda', 'Zabel'], ['Florian', 'Abel'],
  ['Gesa', 'Böhm'], ['Hannes', 'Döring'], ['Ilse', 'Ehlers'], ['Jannis', 'Faber'],
  ['Karla', 'Gerlach'], ['Lukas', 'Heller'], ['Mette', 'Isler'], ['Nora', 'Jung']
] as const

const additionalCustomers: Customer[] = additionalCustomerNames.map(([firstName, lastName], index) => ({
  id: `c-${index + 13}`,
  firstName,
  lastName,
  email: `${firstName.toLocaleLowerCase('de')}.${lastName.toLocaleLowerCase('de').replaceAll('ä', 'ae').replaceAll('ö', 'oe').replaceAll('ü', 'ue').replaceAll('ß', 'ss')}@example.de`,
  phone: `0176 ${String(31000000 + index * 791).padStart(8, '0').replace(/(\\d{4})(\\d{4})/, '$1 $2')}`
}))

const additionalPetNames = [
  'Amy', 'Bruno', 'Coco', 'Dino', 'Emma', 'Flocke', 'Gismo', 'Holly', 'Ivy', 'Jack', 'Kalle', 'Lotti',
  'Momo', 'Nero', 'Olaf', 'Paula', 'Quincy', 'Rudi', 'Sally', 'Toni', 'Umi', 'Vito', 'Wanda', 'Yuki'
]
const petColors = ['#DCE9E5', '#F3E3D7', '#E8E1F0', '#E5E9D8', '#DCE7F0', '#F1E1D5']

const additionalPets: Pet[] = additionalCustomers.map((customer, index) => {
  const species = index % 3 === 0 ? 'cat' : 'dog' as const
  const name = `${additionalPetNames[index % additionalPetNames.length]}${index >= additionalPetNames.length ? ` ${Math.floor(index / additionalPetNames.length) + 1}` : ''}`
  return {
    id: `p-${index + 14}`,
    customerId: customer.id,
    name,
    species,
    breed: species === 'dog' ? ['Mischling', 'Pudel', 'Labrador'][index % 3] : ['Hauskatze', 'Ragdoll'][index % 2],
    initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    color: petColors[index % petColors.length]
  }
})

export const customers: Customer[] = [...coreCustomers, ...additionalCustomers]
export const pets: Pet[] = [...corePets, ...additionalPets]

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

export const initialPensionClosures: PensionClosure[] = []

// Starts empty so new group reservations can be exercised without changing the
// established dashboard scenario. It is reset together with the demo data.
export const initialBookingReservations: BookingReservation[] = []

export const initialDemoEnvironment: DemoEnvironment = {
  id: 'demo-standard',
  label: 'Demodaten',
  scenario: 'Tierpension Sonnenhof',
  businessDate: '2026-08-09',
  resetCount: 0
}

const coreBookings: Booking[] = [
  { id: 'b-1', petId: 'p-1', roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '08:30', departure: '2026-08-12', bookingNote: 'Futterportion liegt beschriftet im Kühlschrank.', status: 'confirmed' },
  { id: 'b-2', petId: 'p-2', roomId: 'r-3', arrivalDate: '2026-08-09', arrival: '09:15', departure: '2026-08-11', status: 'confirmed' },
  { id: 'b-3', petId: 'p-3', roomId: 'r-2', arrivalDate: '2026-08-08', arrival: '07:45', departure: '2026-08-10', pickupTime: '10:30', status: 'checked-in' },
  { id: 'b-4', petId: 'p-4', roomId: 'r-4', arrivalDate: '2026-08-10', arrival: '10:30', departure: '2026-08-14', status: 'confirmed' },
  { id: 'b-5', petId: 'p-5', roomId: 'r-1', arrivalDate: '2026-08-07', arrival: '11:00', departure: '2026-08-09', pickupTime: '14:00', status: 'checked-in' },
  { id: 'b-6', petId: 'p-6', roomId: 'r-2', arrivalDate: '2026-07-14', arrival: '09:00', departure: '2026-07-18', status: 'checked-out' },
  { id: 'b-7', petId: 'p-7', roomId: 'r-3', arrivalDate: '2026-07-19', arrival: '10:15', departure: '2026-07-22', status: 'checked-out' },
  { id: 'b-8', petId: 'p-8', roomId: 'r-1', arrivalDate: '2026-06-10', arrival: '08:45', departure: '2026-06-14', status: 'checked-out' },
  { id: 'b-9', petId: 'p-9', roomId: 'r-4', arrivalDate: '2026-06-25', arrival: '11:30', departure: '2026-06-29', status: 'checked-out' },
  { id: 'b-10', petId: 'p-10', roomId: 'r-2', arrivalDate: '2026-05-07', arrival: '07:30', departure: '2026-05-11', status: 'checked-out' },
  { id: 'b-11', petId: 'p-11', roomId: 'r-1', arrivalDate: '2026-04-23', arrival: '09:45', departure: '2026-04-26', status: 'checked-out' },
  { id: 'b-12', petId: 'p-12', roomId: 'r-3', arrivalDate: '2026-04-04', arrival: '10:00', departure: '2026-04-08', status: 'checked-out' }
]

// Ten stays touch the business date: five arrivals and five departures. Three
// departures are already completed, so the initial room occupancy remains a
// manageable starting point for the live check-in/out workflow.
const businessDateBookings: Booking[] = [
  { id: 'b-13', petId: 'p-14', roomId: 'r-3', arrivalDate: '2026-08-09', arrival: '08:45', departure: '2026-08-13', status: 'confirmed' },
  { id: 'b-14', petId: 'p-15', roomId: 'r-1', arrivalDate: '2026-08-09', arrival: '09:45', departure: '2026-08-12', status: 'confirmed' },
  { id: 'b-15', petId: 'p-16', roomId: 'r-2', arrivalDate: '2026-08-09', arrival: '11:15', departure: '2026-08-11', status: 'confirmed' },
  { id: 'b-16', petId: 'p-17', roomId: 'r-4', arrivalDate: '2026-08-05', arrival: '09:30', departure: '2026-08-09', status: 'checked-out' },
  { id: 'b-17', petId: 'p-18', roomId: 'r-2', arrivalDate: '2026-08-06', arrival: '10:15', departure: '2026-08-09', status: 'checked-out' },
  { id: 'b-18', petId: 'p-19', roomId: 'r-1', arrivalDate: '2026-08-07', arrival: '08:00', departure: '2026-08-09', status: 'checked-out' },
  { id: 'b-19', petId: 'p-20', roomId: 'r-4', arrivalDate: '2026-08-08', arrival: '11:00', departure: '2026-08-09', status: 'checked-out' }
]

const historicalBookings: Booking[] = additionalPets.slice(7, -14).map((pet, index) => {
  const arrivalDay = String((index % 27) + 1).padStart(2, '0')
  const month = String((index % 6) + 1).padStart(2, '0')
  return {
    id: `b-${index + 20}`,
    petId: pet.id,
    roomId: pet.species === 'dog' ? (index % 2 === 0 ? 'r-1' : 'r-2') : (index % 2 === 0 ? 'r-3' : 'r-4'),
    arrivalDate: `2026-${month}-${arrivalDay}`,
    arrival: `${String(8 + (index % 4)).padStart(2, '0')}:00`,
    departure: `2026-${month}-${String(Math.min((index % 27) + 4, 28)).padStart(2, '0')}`,
    status: 'checked-out'
  }
})

// A compact, deterministic planning scenario: the first five days expose
// full, partial and deliberately overbooked capacity states in the occupancy
// view. The final stay is explicitly marked as an acknowledged overbooking.
const occupancyScenarioPets = additionalPets.slice(-14)
const occupancyScenarioBookings: Booking[] = [
  { pet: 0, roomId: 'r-2', arrivalDate: '2026-08-10', departure: '2026-08-11' },
  { pet: 1, roomId: 'r-2', arrivalDate: '2026-08-11', departure: '2026-08-12' },
  { pet: 2, roomId: 'r-1', arrivalDate: '2026-08-12', departure: '2026-08-14' },
  { pet: 3, roomId: 'r-2', arrivalDate: '2026-08-12', departure: '2026-08-14' },
  { pet: 4, roomId: 'r-2', arrivalDate: '2026-08-12', departure: '2026-08-14' },
  { pet: 5, roomId: 'r-3', arrivalDate: '2026-08-12', departure: '2026-08-14' },
  { pet: 6, roomId: 'r-1', arrivalDate: '2026-08-14', departure: '2026-08-15' },
  { pet: 7, roomId: 'r-1', arrivalDate: '2026-08-14', departure: '2026-08-15' },
  { pet: 8, roomId: 'r-1', arrivalDate: '2026-08-14', departure: '2026-08-15', overbooked: true },
  { pet: 9, roomId: 'r-2', arrivalDate: '2026-08-14', departure: '2026-08-15' },
  { pet: 10, roomId: 'r-2', arrivalDate: '2026-08-14', departure: '2026-08-15' },
  { pet: 11, roomId: 'r-3', arrivalDate: '2026-08-14', departure: '2026-08-15' },
  { pet: 12, roomId: 'r-3', arrivalDate: '2026-08-14', departure: '2026-08-15' },
  { pet: 13, roomId: 'r-4', arrivalDate: '2026-08-14', departure: '2026-08-15' }
].map((booking, index) => ({
  id: `b-${historicalBookings.length + 20 + index}`,
  petId: occupancyScenarioPets[booking.pet]!.id,
  roomId: booking.roomId,
  arrivalDate: booking.arrivalDate,
  arrival: '10:00',
  departure: booking.departure,
  status: 'confirmed' as const,
  ...(booking.overbooked ? { overbooked: true } : {})
}))

export const initialBookings: Booking[] = [...coreBookings, ...businessDateBookings, ...historicalBookings, ...occupancyScenarioBookings]

export const initialCheckInOutEvents: CheckInOutEvent[] = [
  { id: 'cio-1', bookingId: 'b-6', type: 'check-in', occurredAt: '2026-07-14T07:03:00.000Z' },
  { id: 'cio-2', bookingId: 'b-6', type: 'check-out', occurredAt: '2026-07-18T15:42:00.000Z' },
  { id: 'cio-3', bookingId: 'b-7', type: 'check-in', occurredAt: '2026-07-19T08:18:00.000Z' },
  { id: 'cio-4', bookingId: 'b-7', type: 'check-out', occurredAt: '2026-07-22T14:06:00.000Z' },
  { id: 'cio-5', bookingId: 'b-5', type: 'check-in', occurredAt: '2026-08-07T09:05:00.000Z' },
  { id: 'cio-6', bookingId: 'b-16', type: 'check-in', occurredAt: '2026-08-05T09:38:00.000Z' },
  { id: 'cio-7', bookingId: 'b-16', type: 'check-out', occurredAt: '2026-08-09T06:16:00.000Z' },
  { id: 'cio-8', bookingId: 'b-17', type: 'check-in', occurredAt: '2026-08-06T10:24:00.000Z' },
  { id: 'cio-9', bookingId: 'b-17', type: 'check-out', occurredAt: '2026-08-09T06:42:00.000Z' },
  { id: 'cio-10', bookingId: 'b-18', type: 'check-in', occurredAt: '2026-08-07T08:11:00.000Z' },
  { id: 'cio-11', bookingId: 'b-18', type: 'check-out', occurredAt: '2026-08-09T07:06:00.000Z' },
  { id: 'cio-12', bookingId: 'b-19', type: 'check-in', occurredAt: '2026-08-08T11:07:00.000Z' },
  { id: 'cio-13', bookingId: 'b-19', type: 'check-out', occurredAt: '2026-08-09T07:28:00.000Z' }
]

export const initialBookingRequests: BookingRequest[] = [
  {
    id: 'req-1',
    customerFirstName: 'Hannah',
    customerLastName: 'Wolf',
    contactEmail: 'hannah.wolf@example.test',
    phone: '0176 220 93 44',
    petName: 'Charlie',
    species: 'dog',
    breed: 'Australian Shepherd',
    arrivalDate: '2026-08-17',
    arrival: '09:00',
    departure: '2026-08-21',
    note: 'Verträgt sich gut mit anderen Hunden.',
    status: 'pending',
    submittedAt: '2026-08-08T14:12:00.000Z'
  },
  {
    id: 'req-2',
    customerFirstName: 'Emilia',
    customerLastName: 'Fischer',
    contactEmail: 'emilia.fischer@example.test',
    phone: '0151 654 39 21',
    petName: 'Oskar',
    species: 'dog',
    breed: 'Dackel',
    arrivalDate: '2026-08-24',
    arrival: '13:30',
    departure: '2026-08-27',
    status: 'pending',
    submittedAt: '2026-08-09T08:47:00.000Z'
  },
  {
    id: 'req-3',
    customerFirstName: 'Elias',
    customerLastName: 'Brandt',
    contactEmail: 'elias.brandt@example.test',
    phone: '0151 660 27 38',
    petName: 'Mimi',
    species: 'cat',
    breed: 'Norwegische Waldkatze',
    arrivalDate: '2026-08-19',
    arrival: '11:00',
    departure: '2026-08-23',
    note: 'Braucht zweimal täglich Insulin.',
    status: 'pending',
    submittedAt: '2026-08-09T17:03:00.000Z'
  },
  {
    id: 'req-4',
    customerFirstName: 'Marlene',
    customerLastName: 'Sommer',
    contactEmail: 'marlene.sommer@example.test',
    phone: '0172 558 90 21',
    petName: 'Bruno',
    species: 'dog',
    breed: 'Cocker Spaniel',
    arrivalDate: '2026-07-28',
    arrival: '10:00',
    departure: '2026-07-31',
    status: 'accepted',
    submittedAt: '2026-07-20T09:30:00.000Z'
  },
  {
    id: 'req-5',
    customerFirstName: 'Jonas',
    customerLastName: 'Wagner',
    contactEmail: 'jonas.wagner@example.test',
    phone: '0160 774 32 18',
    petName: 'Zorro',
    species: 'cat',
    breed: 'Perserkatze',
    arrivalDate: '2026-08-05',
    arrival: '09:30',
    departure: '2026-08-06',
    status: 'declined',
    submittedAt: '2026-07-25T16:15:00.000Z'
  }
]
