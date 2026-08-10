import { describe, expect, it } from 'vitest'
import { normalizeEmergencyContact } from './emergencyContact'

describe('normalizeEmergencyContact', () => {
  it('normalizes a complete emergency contact', () => {
    expect(normalizeEmergencyContact({ name: '  Alex Berger ', phone: ' 0176 123 45 67 ' })).toEqual({
      name: 'Alex Berger',
      phone: '0176 123 45 67'
    })
  })

  it.each([
    { name: '', phone: '0176 123 45 67' },
    { name: 'Alex Berger', phone: 'not a phone number' }
  ])('rejects incomplete or invalid data', (input) => {
    expect(normalizeEmergencyContact(input)).toBeUndefined()
  })
})
