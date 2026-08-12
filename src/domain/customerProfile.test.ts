import { describe, expect, it } from 'vitest'
import { createCustomerProfile, getCustomerRequestMatch, updateCustomerProfile } from './customerProfile'

describe('createCustomerProfile', () => {
  it('normalizes a complete customer profile', () => {
    expect(createCustomerProfile('c-3', {
      firstName: '  Ada ',
      lastName: ' Lovelace  ',
      email: ' ADA@EXAMPLE.DE ',
      phone: ' +49 151 2345678 '
    }, [], [])).toEqual({
      id: 'c-3',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.de',
      phone: '+49 151 2345678'
    })
  })

  it.each([
    ['missing first name', { firstName: ' ', lastName: 'Lovelace', email: 'ada@example.de', phone: '+49 151 2345678' }, [], []],
    ['missing last name', { firstName: 'Ada', lastName: ' ', email: 'ada@example.de', phone: '+49 151 2345678' }, [], []],
    ['invalid email', { firstName: 'Ada', lastName: 'Lovelace', email: 'not-an-email', phone: '+49 151 2345678' }, [], []],
    ['duplicate email', { firstName: 'Ada', lastName: 'Lovelace', email: 'ADA@example.de', phone: '+49 151 2345678' }, [], ['ada@example.de']],
    ['invalid phone', { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.de', phone: 'call me' }, [], []],
    ['formatted duplicate phone', { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.de', phone: '+49 (151) 234-56-78' }, ['+49 151 2345678'], []]
  ])('rejects %s', (_case, input, existingPhones, existingEmails) => {
    expect(createCustomerProfile('c-3', input, existingPhones, existingEmails)).toBeUndefined()
  })
})

describe('updateCustomerProfile', () => {
  it('keeps identity while normalizing changed contact data', () => {
    expect(updateCustomerProfile({
      id: 'c-1', firstName: 'Sofia', lastName: 'Berger', email: 'sofia@example.de', phone: '0176 445 21 90'
    }, {
      firstName: '  Sophie ', lastName: ' Berger ', email: ' SOPHIE@EXAMPLE.DE ', phone: ' 0176 445 21 92 '
    }, [], [])).toEqual({
      id: 'c-1', firstName: 'Sophie', lastName: 'Berger', email: 'sophie@example.de', phone: '0176 445 21 92'
    })
  })

  it('rejects duplicate details from another customer', () => {
    const customer = { id: 'c-1', firstName: 'Sofia', lastName: 'Berger', email: 'sofia@example.de', phone: '0176 445 21 90' }
    expect(updateCustomerProfile(customer, { ...customer, email: 'other@example.de' }, [], ['other@example.de'])).toBeUndefined()
    expect(updateCustomerProfile(customer, { ...customer, phone: '0176 445 21 91' }, ['0176 445 21 91'], [])).toBeUndefined()
  })
})

describe('getCustomerRequestMatch', () => {
  const customer = {
    id: 'c-1', firstName: 'Sofia', lastName: 'Berger', email: 'sofia@example.de', phone: '+49 176 445 21 90'
  }
  const request = {
    id: 'r-1', customerFirstName: 'Sofia', customerLastName: 'Berger', contactEmail: 'other@example.de', phone: '+49 (176) 445-21-90',
    petName: 'Milo', species: 'dog' as const, arrivalDate: '2026-08-12', arrival: '10:00', departure: '2026-08-15',
    status: 'pending' as const, submittedAt: '2026-08-10T08:00:00.000Z'
  }

  it('matches normalized contact channels before a name-only match', () => {
    expect(getCustomerRequestMatch(customer, { ...request, contactEmail: ' SOFIA@EXAMPLE.DE ' })).toBe('email')
    expect(getCustomerRequestMatch(customer, request)).toBe('phone')
  })

  it('falls back to a case-insensitive full-name match and rejects unrelated requests', () => {
    expect(getCustomerRequestMatch(customer, { ...request, phone: '+49 176 445 21 99', customerFirstName: ' sofia ', customerLastName: 'BERGER' })).toBe('name')
    expect(getCustomerRequestMatch(customer, { ...request, phone: '+49 176 445 21 99', customerLastName: 'Becker' })).toBeUndefined()
  })
})
