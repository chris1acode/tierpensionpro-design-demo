import type { PensionSettingsUpdate } from '../domain'

export function isValidPensionSettingsUpdate(settings: PensionSettingsUpdate): boolean {
  const allFieldsAreFilled = Object.values(settings).every((value) => value.trim().length > 0)
  const contactIsValid = settings.contactEmail.includes('@') && settings.contactPhone.trim().length >= 6
  const handoverTimesAreOrdered = settings.checkInFrom < settings.checkInUntil
    && settings.checkInUntil <= settings.checkOutUntil

  return allFieldsAreFilled && contactIsValid && handoverTimesAreOrdered
}
