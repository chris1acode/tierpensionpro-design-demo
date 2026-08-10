import { describe, expect, it } from 'vitest'
import type { AccountUpdate } from '../domain'
import { accountInitials, areAccountUpdatesEqual, isValidAccountUpdate } from './account'

const validUpdate: AccountUpdate = {
  firstName: 'Robin',
  lastName: 'Muster',
  email: 'robin@tierpension-pro.de'
}

describe('isValidAccountUpdate', () => {
  it('accepts a complete update', () => {
    expect(isValidAccountUpdate(validUpdate)).toBe(true)
  })

  it.each([
    ['an empty first name', { firstName: '   ' }],
    ['an empty last name', { lastName: '' }],
    ['an email address without an @', { email: 'robin-tierpension-pro.de' }],
    ['an email address without a domain', { email: 'robin@' }],
    ['an email address without a top-level domain', { email: 'robin@tierpension-pro' }]
  ])('rejects %s', (_case, change) => {
    expect(isValidAccountUpdate({ ...validUpdate, ...change })).toBe(false)
  })
})

describe('accountInitials', () => {
  it('combines the first letters of first and last name in upper case', () => {
    expect(accountInitials({ firstName: 'robin', lastName: 'muster' })).toBe('RM')
  })
})

describe('areAccountUpdatesEqual', () => {
  it('recognizes unchanged editable account data', () => {
    expect(areAccountUpdatesEqual(validUpdate, { ...validUpdate })).toBe(true)
  })

  it.each([
    ['first name', { firstName: 'Alex' }],
    ['last name', { lastName: 'Beispiel' }],
    ['email address', { email: 'alex@tierpension-pro.de' }]
  ])('recognizes a changed %s', (_field, change) => {
    expect(areAccountUpdatesEqual(validUpdate, { ...validUpdate, ...change })).toBe(false)
  })
})
