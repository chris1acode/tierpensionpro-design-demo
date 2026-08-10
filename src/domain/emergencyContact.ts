import type { EmergencyContact } from '../domain'
import { isValidPhoneNumber } from './customerPhone'

export function normalizeEmergencyContact(input: EmergencyContact): EmergencyContact | undefined {
  const name = input.name.trim()
  const phone = input.phone.trim()
  if (!name || !isValidPhoneNumber(phone)) return undefined

  return { name, phone }
}
