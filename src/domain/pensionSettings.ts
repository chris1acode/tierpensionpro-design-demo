import type { PensionSettingsUpdate } from '../domain'
import { isValidEmail } from './email'

/**
 * Compares the editable pension profile including its price-list entities.
 * Keeping this policy outside the form prevents UI-only "dirty" state from
 * drifting away from the data that is actually persisted by the store.
 */
export function arePensionSettingsEqual(
  first: PensionSettingsUpdate,
  second: PensionSettingsUpdate
): boolean {
  return first.businessName === second.businessName
    && first.contactEmail === second.contactEmail
    && first.contactPhone === second.contactPhone
    && first.checkInFrom === second.checkInFrom
    && first.checkInUntil === second.checkInUntil
    && first.checkOutUntil === second.checkOutUntil
    && first.requestsEnabled === second.requestsEnabled
    && first.dailyPetRates.length === second.dailyPetRates.length
    && first.dailyPetRates.every((rate, index) => {
      const otherRate = second.dailyPetRates[index]
      return rate.id === otherRate?.id
        && rate.species === otherRate.species
        && rate.amountCents === otherRate.amountCents
    })
}

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
