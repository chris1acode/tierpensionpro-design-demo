import type { RoomInput } from '../domain'

const validCategories = new Set(['Hundezimmer', 'Katzenzimmer'])

/** Basic invariant for a room master-data record, independent from the UI. */
export function isValidRoomInput(room: RoomInput): boolean {
  return room.name.trim().length >= 2
    && validCategories.has(room.category)
    && Number.isInteger(room.capacity)
    && room.capacity >= 1
    && room.capacity <= 20
}
