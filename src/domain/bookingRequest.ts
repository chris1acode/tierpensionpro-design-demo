import type { NewBookingRequest } from '../domain'
import { isValidEmail } from './email'
import { isValidBookingPeriod } from './bookingPeriod'

/** Validation policy shared by the public form and the local demo store. */
export function isValidNewBookingRequest(request: NewBookingRequest): boolean {
  return [request.customerFirstName, request.customerLastName, request.phone, request.petName]
    .every((value) => value.trim().length > 0)
    && isValidEmail(request.contactEmail.trim())
    && request.phone.trim().length >= 6
    && ['dog', 'cat'].includes(request.species)
    && isValidBookingPeriod(request.arrivalDate, request.arrival, request.departure)
    && (request.note === undefined || request.note.trim().length <= 1000)
}
