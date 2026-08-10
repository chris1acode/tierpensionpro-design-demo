import { describe, expect, it } from 'vitest'
import type { Room } from '../domain'
import { isRoomCompatibleWithSpecies, roomCategoryForSpecies } from './roomCompatibility'

const dogRoom: Room = { id: 'dog-room', name: 'Hundezimmer', category: 'Hundezimmer', capacity: 2 }
const catRoom: Room = { id: 'cat-room', name: 'Katzenzimmer', category: 'Katzenzimmer', capacity: 2 }

describe('room compatibility', () => {
  it.each([
    ['dog', 'Hundezimmer'],
    ['cat', 'Katzenzimmer']
  ] as const)('maps %s to %s', (species, category) => {
    expect(roomCategoryForSpecies(species)).toBe(category)
  })

  it('accepts only rooms intended for the species', () => {
    expect(isRoomCompatibleWithSpecies(dogRoom, 'dog')).toBe(true)
    expect(isRoomCompatibleWithSpecies(catRoom, 'dog')).toBe(false)
    expect(isRoomCompatibleWithSpecies(catRoom, 'cat')).toBe(true)
    expect(isRoomCompatibleWithSpecies(dogRoom, 'cat')).toBe(false)
  })
})
