import { describe, expect, it } from 'vitest'
import type { PensionSettingsUpdate } from '../domain'
import { isValidPensionSettingsUpdate } from './pensionSettings'

const validSettings: PensionSettingsUpdate = {
  businessName: 'Tierpension Pro',
  contactEmail: 'hallo@tierpension-pro.de',
  contactPhone: '+49 30 123456',
  checkInFrom: '08:00',
  checkInUntil: '12:00',
  checkOutUntil: '18:00',
  requestsEnabled: true,
  dailyPetRates: [
    { id: 'rate-dog', species: 'dog', amountCents: 3500 },
    { id: 'rate-cat', species: 'cat', amountCents: 2400 }
  ]
}

describe('isValidPensionSettingsUpdate', () => {
  it('accepts complete contact data and ordered handover times', () => {
    expect(isValidPensionSettingsUpdate(validSettings)).toBe(true)
  })

  it.each([
    ['an empty field', { businessName: '   ' }],
    ['an invalid email address', { contactEmail: 'tierpension-pro.de' }],
    ['an email address without a domain', { contactEmail: 'hallo@' }],
    ['an email address without a top-level domain', { contactEmail: 'hallo@tierpension-pro' }],
    ['a phone number that is too short', { contactPhone: '12345' }],
    ['an inverted check-in window', { checkInFrom: '12:00', checkInUntil: '08:00' }],
    ['a checkout before the end of check-in', { checkInUntil: '18:01', checkOutUntil: '18:00' }]
  ])('rejects %s', (_case, change) => {
    expect(isValidPensionSettingsUpdate({ ...validSettings, ...change })).toBe(false)
  })

  it('accepts either value of the requestsEnabled toggle without affecting the other checks', () => {
    expect(isValidPensionSettingsUpdate({ ...validSettings, requestsEnabled: false })).toBe(true)
  })

  it.each([
    ['a missing animal type', [{ id: 'rate-dog', species: 'dog', amountCents: 3500 }] as PensionSettingsUpdate['dailyPetRates']],
    ['a duplicated animal type', [{ id: 'rate-dog', species: 'dog', amountCents: 3500 }, { id: 'rate-dog-2', species: 'dog', amountCents: 2400 }] as PensionSettingsUpdate['dailyPetRates']],
    ['a non-positive amount', [{ id: 'rate-dog', species: 'dog', amountCents: 0 }, { id: 'rate-cat', species: 'cat', amountCents: 2400 }] as PensionSettingsUpdate['dailyPetRates']],
    ['a fractional cent amount', [{ id: 'rate-dog', species: 'dog', amountCents: 3500.5 }, { id: 'rate-cat', species: 'cat', amountCents: 2400 }] as PensionSettingsUpdate['dailyPetRates']]
  ])('rejects %s in the daily price list', (_case, dailyPetRates) => {
    expect(isValidPensionSettingsUpdate({ ...validSettings, dailyPetRates })).toBe(false)
  })
})
