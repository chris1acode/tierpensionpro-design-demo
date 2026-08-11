import type { NewPet, Pet, PetUpdate } from '../domain'

const PET_AVATAR_COLORS = ['#DCE9E5', '#F3E3D7', '#E8E1F0', '#E5E9D8', '#DCE7F0'] as const
export const MAX_PET_NOTE_LENGTH = 1000

export function createPetProfile(id: Pet['id'], input: NewPet): Pet | undefined {
  const name = input.name.trim()
  if (!name || (input.species !== 'dog' && input.species !== 'cat')) return undefined

  const numericId = Number(id.split('-').at(-1))
  const colorIndex = Number.isInteger(numericId) && numericId > 0
    ? (numericId - 1) % PET_AVATAR_COLORS.length
    : 0
  const note = input.note?.trim()
  if (note && note.length > MAX_PET_NOTE_LENGTH) return undefined

  return {
    id,
    customerId: input.customerId,
    name,
    species: input.species,
    initials: name.slice(0, 2).toLocaleUpperCase('de-DE'),
    color: PET_AVATAR_COLORS[colorIndex],
    ...(note ? { note } : {}),
    ...(input.specialFood ? { specialFood: true } : {})
  }
}

/** Normalizes editable animal master data while preserving stable references. */
export function updatePetProfile(pet: Pet, input: PetUpdate): Pet | undefined {
  const normalized = createPetProfile(pet.id, {
    customerId: pet.customerId,
    species: pet.species,
    ...input
  })
  if (!normalized) return undefined

  return { ...normalized, color: pet.color }
}
