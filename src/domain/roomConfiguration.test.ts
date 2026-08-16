import { describe, expect, it } from 'vitest'
import { isValidRoomInput } from './roomConfiguration'

describe('isValidRoomInput', () => {
  it('accepts a named dog or cat room with a practical integer capacity', () => {
    expect(isValidRoomInput({ name: 'Waldzimmer 3', category: 'Hundezimmer', capacity: 3, tariffId: 'tariff-standard' })).toBe(true)
    expect(isValidRoomInput({ name: 'Katzenloft 3', category: 'Katzenzimmer', capacity: 1, tariffId: 'tariff-single' })).toBe(true)
  })

  it.each([
    { name: ' ', category: 'Hundezimmer', capacity: 2, tariffId: 'tariff-standard' },
    { name: 'A', category: 'Hundezimmer', capacity: 2, tariffId: 'tariff-standard' },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 0, tariffId: 'tariff-standard' },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 2.5, tariffId: 'tariff-standard' },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 21, tariffId: 'tariff-standard' },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 2, tariffId: ' ' }
  ] as const)('rejects invalid room master data: %#', (room) => {
    expect(isValidRoomInput(room)).toBe(false)
  })
})
