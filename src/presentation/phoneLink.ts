import { normalizePhoneNumber } from '../domain/customerPhone'

/** Builds a dialable telephone link while preserving the formatted number for display. */
export function toTelephoneHref(phone: string): string {
  return `tel:${normalizePhoneNumber(phone)}`
}
