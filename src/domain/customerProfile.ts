import type { BookingRequest, Customer, CustomerUpdate, NewCustomer } from '../domain'
import { isValidEmail } from './email'
import { isPhoneNumberAvailable, isValidPhoneNumber, normalizePhoneNumber } from './customerPhone'
import { normalizeEmergencyContact } from './emergencyContact'

export type CustomerRequestMatch = 'email' | 'phone' | 'name'

export function createCustomerProfile(
  id: Customer['id'],
  input: NewCustomer,
  existingPhones: readonly string[],
  existingEmails: readonly string[]
): Customer | undefined {
  const firstName = input.firstName.trim()
  const lastName = input.lastName.trim()
  const email = input.email.trim().toLocaleLowerCase('de')
  const phone = input.phone.trim()

  if (!firstName || !lastName || !isValidEmail(email) || existingEmails.some((item) => item.trim().toLocaleLowerCase('de') === email)
    || !isValidPhoneNumber(phone) || !isPhoneNumberAvailable(phone, existingPhones)) {
    return undefined
  }

  const emergencyContact = input.emergencyContact && normalizeEmergencyContact(input.emergencyContact)
  if (input.emergencyContact && !emergencyContact) return undefined

  return { id, firstName, lastName, email, phone, ...(emergencyContact ? { emergencyContact } : {}) }
}

/** Normalizes editable contact fields while preserving the stable customer identity. */
export function updateCustomerProfile(
  customer: Customer,
  input: CustomerUpdate,
  existingPhones: readonly string[],
  existingEmails: readonly string[]
): Customer | undefined {
  const updated = createCustomerProfile(customer.id, input, existingPhones, existingEmails)
  return updated && { ...customer, ...updated }
}

/**
 * Identifies why a booking request can be assigned to an existing customer.
 * Contact channels take precedence over a name-only match because they are
 * more reliable identifiers for a deliberate assignment.
 */
export function getCustomerRequestMatch(customer: Customer, request: BookingRequest): CustomerRequestMatch | undefined {
  if (customer.email.trim().localeCompare(request.contactEmail.trim(), 'de', { sensitivity: 'accent' }) === 0) return 'email'
  if (normalizePhoneNumber(customer.phone) === normalizePhoneNumber(request.phone)) return 'phone'
  if (customer.firstName.trim().localeCompare(request.customerFirstName.trim(), 'de', { sensitivity: 'base' }) === 0
    && customer.lastName.trim().localeCompare(request.customerLastName.trim(), 'de', { sensitivity: 'base' }) === 0) return 'name'
  return undefined
}
