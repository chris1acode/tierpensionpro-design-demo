import type { PriceTierTariff } from '../domain'

/** Returns the accommodation cost per night for all animals in one reservation. */
export function calculateTierTariffNightlyPrice(tariff: PriceTierTariff, animalCount: number): number | null {
  if (!Number.isInteger(animalCount) || animalCount < 1 || tariff.tiers[0]?.startsAtAnimal !== 1) return null
  let total = 0
  for (let position = 1; position <= animalCount; position += 1) {
    const tier = [...tariff.tiers].reverse().find((item) => item.startsAtAnimal <= position)
    if (!tier || !Number.isInteger(tier.amountCents) || tier.amountCents <= 0) return null
    total += tier.amountCents
  }
  return total
}

export function calculateTierTariffTotal(tariff: PriceTierTariff, animalCount: number, nights: number): number | null {
  const nightlyPrice = calculateTierTariffNightlyPrice(tariff, animalCount)
  return nightlyPrice === null || !Number.isInteger(nights) || nights < 1 ? null : nightlyPrice * nights
}
