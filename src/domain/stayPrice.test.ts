import { describe, expect, it } from 'vitest'
import type { BookingView, PriceTierTariff } from '../domain'
import { calculateTariffReservationPrice } from './stayPrice'

const standard: PriceTierTariff = {
  id: 'standard', name: 'Standardzimmer', type: 'price-tier',
  tiers: [{ id: 'one', startsAtAnimal: 1, amountCents: 3000 }, { id: 'two', startsAtAnimal: 2, amountCents: 2500 }]
}

const stay = {
  arrivalDate: '2026-08-07',
  arrival: '10:30',
  departure: '2026-08-10'
} as Pick<BookingView, 'arrivalDate' | 'arrival' | 'departure'>

describe('calculateTariffReservationPrice', () => {
  it('calculates occupied calendar days and does not charge the departure day', () => {
    expect(calculateTariffReservationPrice(stay, [{ id: 'p-1' }], standard)).toEqual({
      stays: [{ bookingId: 'preview-p-1', dailyRateCents: 3000, billableDays: 3, totalCents: 9000 }],
      totalCents: 9000
    })
  })

  it('prices each additional animal at the tier that applies to its position', () => {
    expect(calculateTariffReservationPrice(stay, [{ id: 'p-1' }, { id: 'p-2' }], standard)).toMatchObject({
      totalCents: 16500,
      stays: [
        { bookingId: 'preview-p-1', billableDays: 3, totalCents: 9000 },
        { bookingId: 'preview-p-2', billableDays: 3, totalCents: 7500 }
      ]
    })
  })

  it('does not invent an amount when the tariff is missing or the stay period is invalid', () => {
    expect(calculateTariffReservationPrice(stay, [{ id: 'p-1' }], undefined)).toBeNull()
    expect(calculateTariffReservationPrice({ ...stay, departure: '2026-08-06' }, [{ id: 'p-1' }], standard)).toBeNull()
    expect(calculateTariffReservationPrice(stay, [], standard)).toBeNull()
  })
})
