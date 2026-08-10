import { describe, expect, it } from 'vitest'
import { createCustomerProfile } from './customerProfile'

describe('createCustomerProfile', () => {
  it('normalizes a complete customer profile', () => {
    expect(createCustomerProfile('c-3', {
      firstName: '  Ada ',
      lastName: ' Lovelace  ',
      phone: ' +49 151 2345678 '
    }, [])).toEqual({
      id: 'c-3',
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '+49 151 2345678'
    })
  })

  it.each([
    ['missing first name', { firstName: ' ', lastName: 'Lovelace', phone: '+49 151 2345678' }, []],
    ['missing last name', { firstName: 'Ada', lastName: ' ', phone: '+49 151 2345678' }, []],
    ['invalid phone', { firstName: 'Ada', lastName: 'Lovelace', phone: 'call me' }, []],
    ['formatted duplicate phone', { firstName: 'Ada', lastName: 'Lovelace', phone: '+49 (151) 234-56-78' }, ['+49 151 2345678']]
  ])('rejects %s', (_case, input, existingPhones) => {
    expect(createCustomerProfile('c-3', input, existingPhones)).toBeUndefined()
  })
})
