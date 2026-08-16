import { describe, expect, it } from 'vitest'
import type { PriceTierTariff } from '../domain'
import { calculateTierTariffNightlyPrice, calculateTierTariffTotal } from './tariffPrice'

const standard: PriceTierTariff = {
  id: 'standard', name: 'Standardzimmer', type: 'price-tier',
  tiers: [{ id: 'one', startsAtAnimal: 1, amountCents: 3000 }, { id: 'two', startsAtAnimal: 2, amountCents: 2500 }, { id: 'four', startsAtAnimal: 4, amountCents: 2000 }]
}

describe('price tier tariffs', () => {
  it('keeps earlier animal prices when a later tier begins', () => {
    expect(calculateTierTariffNightlyPrice(standard, 1)).toBe(3000)
    expect(calculateTierTariffNightlyPrice(standard, 3)).toBe(8000)
    expect(calculateTierTariffNightlyPrice(standard, 5)).toBe(12000)
  })

  it('multiplies the nightly total by the number of nights', () => {
    expect(calculateTierTariffTotal(standard, 3, 5)).toBe(40000)
  })
})
