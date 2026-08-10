const PHONE_NUMBER_PATTERN = /^\+?\d{7,15}$/
const PHONE_NUMBER_SEPARATORS = /[\s/()-]/g

export function normalizePhoneNumber(phone: string): string {
  return phone.trim().replace(PHONE_NUMBER_SEPARATORS, '')
}

export function isValidPhoneNumber(phone: string): boolean {
  return PHONE_NUMBER_PATTERN.test(normalizePhoneNumber(phone))
}

export function isPhoneNumberAvailable(phone: string, existingPhones: readonly string[]): boolean {
  const normalizedPhone = normalizePhoneNumber(phone)
  return !existingPhones.some((existingPhone) => normalizePhoneNumber(existingPhone) === normalizedPhone)
}
