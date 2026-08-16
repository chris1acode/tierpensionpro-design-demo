import type { PensionSettingsUpdate } from '../domain'
import { isValidEmail } from './email'

function areTariffsEqual(first: PensionSettingsUpdate['tariffs'], second: PensionSettingsUpdate['tariffs']): boolean {
  return first.length === second.length && first.every((tariff, index) => {
    const other = second[index]
    return tariff.id === other?.id && tariff.name === other.name && tariff.type === other.type
      && tariff.tiers.length === other.tiers.length
      && tariff.tiers.every((tier, tierIndex) => {
        const otherTier = other.tiers[tierIndex]
        return tier.id === otherTier?.id && tier.startsAtAnimal === otherTier.startsAtAnimal && tier.amountCents === otherTier.amountCents
      })
  })
}

export function isValidPriceTierTariff(tariff: PensionSettingsUpdate['tariffs'][number]): boolean {
  return tariff.id.trim().length > 0 && tariff.name.trim().length > 0 && tariff.type === 'price-tier'
    && tariff.tiers.length > 0 && tariff.tiers[0]?.startsAtAnimal === 1
    && tariff.tiers.every((tier, index) => tier.id.trim().length > 0
      && Number.isInteger(tier.startsAtAnimal) && tier.startsAtAnimal > 0
      && Number.isInteger(tier.amountCents) && tier.amountCents > 0
      && (index === 0 || tier.startsAtAnimal > tariff.tiers[index - 1].startsAtAnimal))
}

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
    && areTariffsEqual(first.tariffs, second.tariffs)
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
  const tariffsAreValid = settings.tariffs.length > 0
    && new Set(settings.tariffs.map((tariff) => tariff.id)).size === settings.tariffs.length
    && settings.tariffs.every(isValidPriceTierTariff)

  return allFieldsAreFilled && contactIsValid && handoverTimesAreOrdered && dailyRatesAreValid && tariffsAreValid
}
