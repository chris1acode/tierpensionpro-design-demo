import { describe, expect, it } from 'vitest'
import { formatEuroCents } from './currencyFormat'

describe('currency presentation', () => {
  it('formats cent amounts as German euro values', () => {
    expect(formatEuroCents(0)).toBe('0,00 €')
    expect(formatEuroCents(1299)).toBe('12,99 €')
  })

  it('preserves cent precision for negative amounts', () => {
    expect(formatEuroCents(-105)).toBe('-1,05 €')
  })
})
