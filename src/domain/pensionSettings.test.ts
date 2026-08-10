import { describe, expect, it } from 'vitest'
import type { PensionSettingsUpdate } from '../domain'
import { isValidPensionSettingsUpdate } from './pensionSettings'

const validSettings: PensionSettingsUpdate = {
  businessName: 'Tierpension Pro',
  contactEmail: 'hallo@tierpension-pro.de',
  contactPhone: '+49 30 123456',
  checkInFrom: '08:00',
  checkInUntil: '12:00',
  checkOutUntil: '18:00'
}

describe('isValidPensionSettingsUpdate', () => {
  it('accepts complete contact data and ordered handover times', () => {
    expect(isValidPensionSettingsUpdate(validSettings)).toBe(true)
  })

  it.each([
    ['an empty field', { businessName: '   ' }],
    ['an invalid email address', { contactEmail: 'tierpension-pro.de' }],
    ['a phone number that is too short', { contactPhone: '12345' }],
    ['an inverted check-in window', { checkInFrom: '12:00', checkInUntil: '08:00' }],
    ['a checkout before the end of check-in', { checkInUntil: '18:01', checkOutUntil: '18:00' }]
  ])('rejects %s', (_case, change) => {
    expect(isValidPensionSettingsUpdate({ ...validSettings, ...change })).toBe(false)
  })
})
