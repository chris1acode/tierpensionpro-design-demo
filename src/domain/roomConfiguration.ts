import type { Room, RoomInput } from '../domain'

const validCategories = new Set(['Hundezimmer', 'Katzenzimmer'])

/** Basic invariant for a room master-data record, independent from the UI. */
export function isValidRoomInput(room: RoomInput): boolean {
  return room.name.trim().length >= 2
    && validCategories.has(room.category)
    && Number.isInteger(room.capacity)
    && room.capacity >= 1
    && room.capacity <= 20
}

/**
 * Compares editable room configuration while retaining the room identity and
 * order that the settings form uses to address individual save actions.
 */
export function areRoomConfigurationsEqual(
  draft: readonly Room[],
  stored: readonly Room[]
): boolean {
  return draft.length === stored.length
    && draft.every((room, index) => {
      const existingRoom = stored[index]
      return room.id === existingRoom?.id
        && room.name === existingRoom.name
        && room.category === existingRoom.category
        && room.capacity === existingRoom.capacity
    })
}
