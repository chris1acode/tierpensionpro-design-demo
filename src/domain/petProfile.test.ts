import { describe, expect, it } from 'vitest'
import { createPetProfile, MAX_ALLERGY_NOTE_LENGTH, MAX_FEEDING_PLAN_LENGTH, MAX_MEDICATION_PLAN_LENGTH, MAX_PET_NOTE_LENGTH, MAX_VACCINATION_STATUS_LENGTH, updatePetProfile } from './petProfile'

describe('createPetProfile', () => {
  it('normalizes input and derives stable avatar metadata from the entity id', () => {
    expect(createPetProfile('p-7', {
      customerId: 'c-1',
      name: '  kiwi ',
      species: 'cat',
      breed: ' Hauskatze ',
      note: '  Schreckhaft  ', feedingPlan: '  Zweimal täglich  ', medicationPlan: '  Tablette um 18 Uhr  ', allergyNote: '  Kein Geflügel  ', vaccinationStatus: '  Impfpass geprüft  ', veterinaryContact: { practiceName: '  Tierarztpraxis am Park  ', phone: ' 030 1234567 ' }
    })).toEqual({
      id: 'p-7',
      customerId: 'c-1',
      name: 'kiwi',
      species: 'cat',
      breed: 'Hauskatze',
      initials: 'KI',
      color: '#F3E3D7',
      note: 'Schreckhaft', feedingPlan: 'Zweimal täglich', medicationPlan: 'Tablette um 18 Uhr', allergyNote: 'Kein Geflügel', vaccinationStatus: 'Impfpass geprüft', veterinaryContact: { practiceName: 'Tierarztpraxis am Park', phone: '030 1234567' }
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

  it('rejects notes that exceed the operational handover limit', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', note: 'x'.repeat(MAX_PET_NOTE_LENGTH + 1)
    })).toBeUndefined()
  })

  it('rejects medication plans that exceed the operational handover limit', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', medicationPlan: 'x'.repeat(MAX_MEDICATION_PLAN_LENGTH + 1)
    })).toBeUndefined()
  })

  it('rejects feeding plans that exceed the operational handover limit', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', feedingPlan: 'x'.repeat(MAX_FEEDING_PLAN_LENGTH + 1)
    })).toBeUndefined()
  })

  it('rejects allergy notes that exceed the operational handover limit', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', allergyNote: 'x'.repeat(MAX_ALLERGY_NOTE_LENGTH + 1)
    })).toBeUndefined()
  })

  it('rejects vaccination statuses that exceed the operational handover limit', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', vaccinationStatus: 'x'.repeat(MAX_VACCINATION_STATUS_LENGTH + 1)
    })).toBeUndefined()
  })

  it('rejects an incomplete veterinary contact', () => {
    expect(createPetProfile('p-1', {
      customerId: 'c-1', name: 'Momo', species: 'dog', breed: 'Pudel', veterinaryContact: { practiceName: 'Tierarztpraxis am Park', phone: 'unbekannt' }
    })).toBeUndefined()
  })

  it('updates only editable master data while retaining stable profile references', () => {
    const pet = createPetProfile('p-7', {
      customerId: 'c-1', name: 'Kiwi', species: 'cat', breed: 'Hauskatze', note: 'Schreckhaft', feedingPlan: 'Zweimal täglich', medicationPlan: 'Tablette um 18 Uhr', allergyNote: 'Kein Geflügel', vaccinationStatus: 'Impfpass geprüft', veterinaryContact: { practiceName: 'Tierarztpraxis am Park', phone: '030 1234567' }
    })!

    expect(updatePetProfile(pet, { name: '  Kiki ', breed: ' Europäisch Kurzhaar ', note: '  Mag Ruhe  ', feedingPlan: '  Eine Portion abends  ', medicationPlan: '  Zwei Tropfen morgens  ', allergyNote: '  Keine Milcheiweiße  ', vaccinationStatus: '  Tollwut gültig  ', veterinaryContact: { practiceName: '  Praxis Mitte ', phone: '030 7654321' } })).toEqual({
      ...pet, name: 'Kiki', initials: 'KI', breed: 'Europäisch Kurzhaar', note: 'Mag Ruhe', feedingPlan: 'Eine Portion abends', medicationPlan: 'Zwei Tropfen morgens', allergyNote: 'Keine Milcheiweiße', vaccinationStatus: 'Tollwut gültig', veterinaryContact: { practiceName: 'Praxis Mitte', phone: '030 7654321' }
    })
    expect(updatePetProfile(pet, { name: '', breed: 'Hauskatze' })).toBeUndefined()
  })
})
