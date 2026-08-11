import { describe, expect, it } from 'vitest'
import { createPetProfile, MAX_PET_NOTE_LENGTH, updatePetProfile } from './petProfile'

describe('createPetProfile', () => {
  it('normalizes input and derives stable avatar metadata from the entity id', () => {
    expect(createPetProfile('p-7', {
      customerId: 'c-1',
      name: '  kiwi ',
      species: 'cat',
      note: '  Schreckhaft  '
    })).toEqual({
      id: 'p-7',
      customerId: 'c-1',
      name: 'kiwi',
      species: 'cat',
      initials: 'KI',
      color: '#F3E3D7',
      note: 'Schreckhaft'
    })
  })

  it('rejects incomplete profiles', () => {
    expect(createPetProfile('p-1', { customerId: 'c-1', name: '  ', species: 'dog' })).toBeUndefined()
  })

  it('carries the special food flag when set and omits it when falsy', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', specialFood: true
    })).toMatchObject({ specialFood: true })
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', specialFood: false
    })).not.toHaveProperty('specialFood')
  })

  it('uses the first palette color for ids without a positive numeric suffix', () => {
    expect(createPetProfile('pet-new', {
      customerId: 'c-1', name: 'Momo', species: 'dog'
    })?.color).toBe('#DCE9E5')
  })

  it('rejects notes that exceed the operational handover limit', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', note: 'x'.repeat(MAX_PET_NOTE_LENGTH + 1)
    })).toBeUndefined()
  })

  it('updates only editable master data while retaining stable profile references', () => {
    const pet = createPetProfile('p-7', {
      customerId: 'c-1', name: 'Kiwi', species: 'cat', note: 'Schreckhaft'
    })!

    expect(updatePetProfile(pet, { name: '  Kiki ', note: '  Mag Ruhe  ' })).toEqual({
      ...pet, name: 'Kiki', initials: 'KI', note: 'Mag Ruhe'
    })
    expect(updatePetProfile(pet, { name: '' })).toBeUndefined()
  })
})
