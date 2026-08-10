import { describe, expect, it } from 'vitest'
import { createPetProfile } from './petProfile'

describe('createPetProfile', () => {
  it('normalizes input and derives stable avatar metadata from the entity id', () => {
    expect(createPetProfile('p-7', {
      customerId: 'c-1',
      name: '  kiwi ',
      species: 'cat',
      breed: ' Hauskatze ',
      note: '  Schreckhaft  '
    })).toEqual({
      id: 'p-7',
      customerId: 'c-1',
      name: 'kiwi',
      species: 'cat',
      breed: 'Hauskatze',
      initials: 'KI',
      color: '#F3E3D7',
      note: 'Schreckhaft'
    })
  })

  it.each([
    { name: '', species: 'dog' as const, breed: 'Pudel' },
    { name: 'Momo', species: 'dog' as const, breed: '  ' }
  ])('rejects incomplete profiles', (invalidInput) => {
    expect(createPetProfile('p-1', { customerId: 'c-1', ...invalidInput })).toBeUndefined()
  })

  it('uses the first palette color for ids without a positive numeric suffix', () => {
    expect(createPetProfile('pet-new', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel'
    })?.color).toBe('#DCE9E5')
  })
})
