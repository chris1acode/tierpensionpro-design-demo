import type { NewPet, Pet } from '../domain'

const PET_AVATAR_COLORS = ['#DCE9E5', '#F3E3D7', '#E8E1F0', '#E5E9D8', '#DCE7F0'] as const

export function createPetProfile(id: Pet['id'], input: NewPet): Pet | undefined {
  const name = input.name.trim()
  const breed = input.breed.trim()
  if (!name || !breed || (input.species !== 'dog' && input.species !== 'cat')) return undefined

  const numericId = Number(id.split('-').at(-1))
  const colorIndex = Number.isInteger(numericId) && numericId > 0
    ? (numericId - 1) % PET_AVATAR_COLORS.length
    : 0
  const note = input.note?.trim()

  return {
    id,
    customerId: input.customerId,
    name,
    species: input.species,
    breed,
    initials: name.slice(0, 2).toLocaleUpperCase('de-DE'),
    color: PET_AVATAR_COLORS[colorIndex],
    ...(note ? { note } : {})
  }
}
