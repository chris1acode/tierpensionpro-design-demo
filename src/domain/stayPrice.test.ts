import { describe, expect, it } from 'vitest'
import type { BookingView, DailyPetRate } from '../domain'
import { calculateStayPrice } from './stayPrice'

const rates: DailyPetRate[] = [
  { id: 'rate-dog', species: 'dog', amountCents: 3500 },
  { id: 'rate-cat', species: 'cat', amountCents: 2400 }
]

const dogStay = {
  id: 'b-1',
  arrivalDate: '2026-08-07',
  arrival: '10:30',
  departure: '2026-08-10',
  pet: { species: 'dog' }
} as Pick<BookingView, 'id' | 'arrivalDate' | 'arrival' | 'departure' | 'pet'>

describe('calculateStayPrice', () => {
  it('calculates occupied calendar days and does not charge the departure day', () => {
    expect(calculateStayPrice(dogStay, rates)).toEqual({
      bookingId: 'b-1',
      dailyRateCents: 3500,
      billableDays: 3,
      totalCents: 10500
    })
  })

  it('uses the rate configured for the animal species', () => {
    expect(calculateStayPrice({ ...dogStay, pet: { ...dogStay.pet, species: 'cat' } }, rates)?.totalCents).toBe(7200)
  })

  it('does not invent an amount when the matching rate or stay period is invalid', () => {
    expect(calculateStayPrice(dogStay, rates.filter((rate) => rate.species !== 'dog'))).toBeNull()
    expect(calculateStayPrice({ ...dogStay, departure: '2026-08-06' }, rates)).toBeNull()
  })
})
