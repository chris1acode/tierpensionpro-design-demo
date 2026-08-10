import { describe, expect, it } from 'vitest'
import { isPhoneNumberAvailable, isValidPhoneNumber, normalizePhoneNumber } from './customerPhone'

describe('customer phone policy', () => {
  it('normalizes supported visual separators', () => {
    expect(normalizePhoneNumber(' +49 (151) 234-56/78 ')).toBe('+491512345678')
  })

  it.each([
    ['international number', '+49 151 2345678', true],
    ['local number', '0151 2345678', true],
    ['letters', '0151 call-me', false],
    ['too few digits', '123456', false],
    ['too many digits', '+1234567890123456', false],
    ['plus sign inside number', '0151+2345678', false]
  ])('validates %s', (_case, phone, expected) => {
    expect(isValidPhoneNumber(phone)).toBe(expected)
  })

  it('detects an existing number independently of its formatting', () => {
    const existingPhones = ['0176 445 21 90', '+49 151 2345678']

    expect(isPhoneNumberAvailable('+49 (151) 234-56-78', existingPhones)).toBe(false)
    expect(isPhoneNumberAvailable('0151 9999999', existingPhones)).toBe(true)
  })
})
