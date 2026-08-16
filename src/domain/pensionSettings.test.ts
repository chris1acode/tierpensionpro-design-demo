import { describe, expect, it } from 'vitest'
import type { PensionSettingsUpdate } from '../domain'
import { arePensionSettingsEqual, isValidPensionSettingsUpdate } from './pensionSettings'

const validSettings: PensionSettingsUpdate = {
  businessName: 'Tierpension Pro',
  contactEmail: 'hallo@tierpension-pro.de',
  contactPhone: '+49 30 123456',
  checkInFrom: '08:00',
  checkInUntil: '12:00',
  checkOutUntil: '18:00',
  requestsEnabled: true,
  tariffs: [{ id: 'tariff-standard', name: 'Standardzimmer', type: 'price-tier', tiers: [{ id: 'tier-1', startsAtAnimal: 1, amountCents: 3000 }, { id: 'tier-2', startsAtAnimal: 2, amountCents: 2500 }] }]
}

const invalidTariffs: PensionSettingsUpdate['tariffs'][] = [
  [{ id: 'tariff-standard', name: 'Standardzimmer', type: 'price-tier', tiers: [{ id: 'tier-2', startsAtAnimal: 2, amountCents: 3000 }] }],
  [{ id: 'tariff-standard', name: 'Standardzimmer', type: 'price-tier', tiers: [{ id: 'tier-1', startsAtAnimal: 1, amountCents: 3000 }, { id: 'tier-duplicate', startsAtAnimal: 1, amountCents: 2500 }] }]
]

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

  it.each(invalidTariffs.map((tariffs) => [tariffs]))('rejects an invalid price tier tariff', (tariffs) => {
    expect(isValidPensionSettingsUpdate({ ...validSettings, tariffs })).toBe(false)
  })
})

describe('arePensionSettingsEqual', () => {
  it('recognizes an unchanged editable settings model', () => {
    expect(arePensionSettingsEqual(validSettings, {
      ...validSettings,
      tariffs: validSettings.tariffs.map((tariff) => ({ ...tariff, tiers: tariff.tiers.map((tier) => ({ ...tier })) }))
    })).toBe(true)
  })

  it.each([
    ['business name', { businessName: 'Tierpension am See' }],
    ['request setting', { requestsEnabled: false }]
  ])('recognizes a changed %s', (_case, change) => {
    expect(arePensionSettingsEqual(validSettings, { ...validSettings, ...change })).toBe(false)
  })
})
