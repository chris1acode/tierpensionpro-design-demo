import type { NewPet, Pet, PetUpdate } from '../domain'
import { normalizeVeterinaryContact } from './veterinaryContact'

const PET_AVATAR_COLORS = ['#DCE9E5', '#F3E3D7', '#E8E1F0', '#E5E9D8', '#DCE7F0'] as const
export const MAX_PET_NOTE_LENGTH = 300
export const MAX_MEDICATION_PLAN_LENGTH = 300
export const MAX_FEEDING_PLAN_LENGTH = 300
export const MAX_ALLERGY_NOTE_LENGTH = 300
export const MAX_VACCINATION_STATUS_LENGTH = 300

export function createPetProfile(id: Pet['id'], input: NewPet): Pet | undefined {
  const name = input.name.trim()
  const breed = input.breed.trim()
  if (!name || !breed || (input.species !== 'dog' && input.species !== 'cat')) return undefined

  const numericId = Number(id.split('-').at(-1))
  const colorIndex = Number.isInteger(numericId) && numericId > 0
    ? (numericId - 1) % PET_AVATAR_COLORS.length
    : 0
  const note = input.note?.trim()
  if (note && note.length > MAX_PET_NOTE_LENGTH) return undefined
  const medicationPlan = input.medicationPlan?.trim()
  if (medicationPlan && medicationPlan.length > MAX_MEDICATION_PLAN_LENGTH) return undefined
  const feedingPlan = input.feedingPlan?.trim()
  if (feedingPlan && feedingPlan.length > MAX_FEEDING_PLAN_LENGTH) return undefined
  const allergyNote = input.allergyNote?.trim()
  if (allergyNote && allergyNote.length > MAX_ALLERGY_NOTE_LENGTH) return undefined
  const vaccinationStatus = input.vaccinationStatus?.trim()
  if (vaccinationStatus && vaccinationStatus.length > MAX_VACCINATION_STATUS_LENGTH) return undefined
  const veterinaryContact = input.veterinaryContact
    ? normalizeVeterinaryContact(input.veterinaryContact)
    : undefined
  if (input.veterinaryContact && !veterinaryContact) return undefined

  return {
    id,
    customerId: input.customerId,
    name,
    species: input.species,
    breed,
    initials: name.slice(0, 2).toLocaleUpperCase('de-DE'),
    color: PET_AVATAR_COLORS[colorIndex],
    ...(note ? { note } : {}),
    ...(medicationPlan ? { medicationPlan } : {}),
    ...(feedingPlan ? { feedingPlan } : {}),
    ...(input.specialFood ? { specialFood: true } : {}),
    ...(allergyNote ? { allergyNote } : {}),
    ...(vaccinationStatus ? { vaccinationStatus } : {}),
    ...(veterinaryContact ? { veterinaryContact } : {})
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
