import { describe, expect, it } from 'vitest'
import { isValidRoomInput } from './roomConfiguration'

describe('isValidRoomInput', () => {
  it('accepts a named dog or cat room with a practical integer capacity', () => {
    expect(isValidRoomInput({ name: 'Waldzimmer 3', category: 'Hundezimmer', capacity: 3 })).toBe(true)
    expect(isValidRoomInput({ name: 'Katzenloft 3', category: 'Katzenzimmer', capacity: 1 })).toBe(true)
  })

  it.each([
    { name: ' ', category: 'Hundezimmer', capacity: 2 },
    { name: 'A', category: 'Hundezimmer', capacity: 2 },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 0 },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 2.5 },
    { name: 'Waldzimmer', category: 'Hundezimmer', capacity: 21 }
  ] as const)('rejects invalid room master data: %#', (room) => {
    expect(isValidRoomInput(room)).toBe(false)
  })
})
