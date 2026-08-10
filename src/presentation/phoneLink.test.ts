import { describe, expect, it } from 'vitest'
import { toTelephoneHref } from './phoneLink'

describe('telephone link presentation', () => {
  it('uses the canonical phone number in dial links', () => {
    expect(toTelephoneHref(' +49 (151) 234-56/78 ')).toBe('tel:+491512345678')
  })
})
