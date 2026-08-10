import { describe, expect, it } from 'vitest'
import type { Room } from '../domain'
import { areRoomConfigurationsEqual, isValidRoomInput } from './roomConfiguration'

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

describe('areRoomConfigurationsEqual', () => {
  const rooms: Room[] = [
    { id: 'r1', name: 'Waldzimmer 3', category: 'Hundezimmer', capacity: 3 },
    { id: 'r2', name: 'Katzenloft 3', category: 'Katzenzimmer', capacity: 1 }
  ]

  it('accepts an unchanged room configuration', () => {
    expect(areRoomConfigurationsEqual(rooms.map((room) => ({ ...room })), rooms)).toBe(true)
  })

  const changedConfigurations: Room[][] = [
    [{ ...rooms[0], name: 'Waldzimmer 4' }, rooms[1]],
    [{ ...rooms[0], category: 'Katzenzimmer' }, rooms[1]],
    [{ ...rooms[0], capacity: 4 }, rooms[1]],
    [rooms[1], rooms[0]],
    [rooms[0]]
  ]

  it.each(changedConfigurations.map((draft) => ({ draft })))('detects a changed room configuration: %#', ({ draft }) => {
    expect(areRoomConfigurationsEqual(draft, rooms)).toBe(false)
  })
})
