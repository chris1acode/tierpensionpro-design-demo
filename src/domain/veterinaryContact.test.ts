import { describe, expect, it } from 'vitest'
import { normalizeVeterinaryContact } from './veterinaryContact'

describe('normalizeVeterinaryContact', () => {
  it('trims a complete, callable veterinary practice contact', () => {
    expect(normalizeVeterinaryContact({ practiceName: '  Tierarztpraxis am Park ', phone: ' 030 / 123 45 67 ' })).toEqual({
      practiceName: 'Tierarztpraxis am Park',
      phone: '030 / 123 45 67'
    })
  })

  it.each([
    { practiceName: '', phone: '030 1234567' },
    { practiceName: 'Tierarztpraxis am Park', phone: 'nicht erreichbar' }
  ])('rejects incomplete contacts', (input) => {
    expect(normalizeVeterinaryContact(input)).toBeUndefined()
  })
})
