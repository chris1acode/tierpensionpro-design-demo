import type { NewBookingRequest } from '../domain'
import { isValidEmail } from './email'
import { isValidBookingPeriod } from './bookingPeriod'

/** Validation policy shared by the public form and the local demo store. */
export function isValidNewBookingRequest(request: NewBookingRequest): boolean {
  const animals = request.animals?.length
    ? request.animals
    : [{ name: request.petName, species: request.species }]
  return [request.customerFirstName, request.customerLastName, request.phone, request.petName]
    .every((value) => value.trim().length > 0)
    && isValidEmail(request.contactEmail.trim())
    && request.phone.trim().length >= 6
    && animals.length > 0
    && animals.every((animal) => animal.name.trim().length > 0 && ['dog', 'cat'].includes(animal.species))
    && new Set(animals.map((animal) => animal.name.trim().toLocaleLowerCase('de'))).size === animals.length
    && isValidBookingPeriod(request.arrivalDate, request.arrival, request.departure)
    && (request.note === undefined || request.note.trim().length <= 1000)
}
