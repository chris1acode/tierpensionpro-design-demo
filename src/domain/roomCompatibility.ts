import type { PetSpecies, Room, RoomCategory } from '../domain'

const roomCategoryBySpecies: Record<PetSpecies, RoomCategory> = {
  dog: 'Hundezimmer',
  cat: 'Katzenzimmer'
}

export function roomCategoryForSpecies(species: PetSpecies): RoomCategory {
  return roomCategoryBySpecies[species]
}

export function isRoomCompatibleWithSpecies(room: Room, species: PetSpecies): boolean {
  return room.category === roomCategoryForSpecies(species)
}
