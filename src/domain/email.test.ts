import { describe, expect, it } from 'vitest'
import { isValidEmail } from './email'

describe('isValidEmail', () => {
  it.each([
    'robin@tierpension-pro.de',
    'hallo@tierpension-pro.de',
    '  padded@example.com  '
  ])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  it.each([
    ['no @ at all', 'tierpension-pro.de'],
    ['just an @', '@'],
    ['no domain', 'a@'],
    ['no local part', '@b.com'],
    ['no top-level domain', 'a@b'],
    ['contains whitespace', 'a b@c.de'],
    ['empty string', '']
  ])('rejects %s', (_case, email) => {
    expect(isValidEmail(email)).toBe(false)
  })
})
