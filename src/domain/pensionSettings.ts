import type { PensionSettingsUpdate } from '../domain'
import { isValidEmail } from './email'

export function isValidPensionSettingsUpdate(settings: PensionSettingsUpdate): boolean {
  const allFieldsAreFilled = [
    settings.businessName,
    settings.contactEmail,
    settings.contactPhone,
    settings.checkInFrom,
    settings.checkInUntil,
    settings.checkOutUntil
  ].every((value) => value.trim().length > 0)
  const contactIsValid = isValidEmail(settings.contactEmail) && settings.contactPhone.trim().length >= 6
  const handoverTimesAreOrdered = settings.checkInFrom < settings.checkInUntil
    && settings.checkInUntil <= settings.checkOutUntil
  const dailyRatesAreValid = settings.dailyPetRates.length === 2
    && new Set(settings.dailyPetRates.map((rate) => rate.species)).size === 2
    && settings.dailyPetRates.every((rate) => rate.id.trim().length > 0
      && Number.isInteger(rate.amountCents) && rate.amountCents > 0)

  return allFieldsAreFilled && contactIsValid && handoverTimesAreOrdered && dailyRatesAreValid
}
