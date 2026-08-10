import type { VeterinaryContact } from '../domain'
import { isValidPhoneNumber } from './customerPhone'

/** Normalizes the optional practice contact stored with an individual animal. */
export function normalizeVeterinaryContact(input: VeterinaryContact): VeterinaryContact | undefined {
  const practiceName = input.practiceName.trim()
  const phone = input.phone.trim()
  if (!practiceName || !isValidPhoneNumber(phone)) return undefined

  return { practiceName, phone }
}
