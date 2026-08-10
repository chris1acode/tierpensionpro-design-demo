import type { Customer, NewCustomer } from '../domain'
import { isPhoneNumberAvailable, isValidPhoneNumber } from './customerPhone'

export function createCustomerProfile(
  id: Customer['id'],
  input: NewCustomer,
  existingPhones: readonly string[]
): Customer | undefined {
  const firstName = input.firstName.trim()
  const lastName = input.lastName.trim()
  const phone = input.phone.trim()

  if (!firstName || !lastName || !isValidPhoneNumber(phone) || !isPhoneNumberAvailable(phone, existingPhones)) {
    return undefined
  }

  return { id, firstName, lastName, phone }
}
