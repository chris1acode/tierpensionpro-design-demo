import type { BookingView, Pet, PriceTierTariff, ReservationPrice, StayPrice } from '../domain'
import { enumerateStayDates, isValidBookingPeriod } from './bookingPeriod'
import { calculateTierTariffNightlyPrice } from './tariffPrice'

/** Calculates the selected price-tier tariff for all animals in a reservation. */
export function calculateTariffReservationPrice(
  stay: Pick<BookingView, 'arrivalDate' | 'arrival' | 'departure'>,
  pets: readonly Pick<Pet, 'id'>[],
  tariff: PriceTierTariff | undefined
): ReservationPrice | null {
  if (!tariff || !pets.length || !isValidBookingPeriod(stay.arrivalDate, stay.arrival, stay.departure)) return null
  const billableDays = enumerateStayDates(stay.arrivalDate, stay.departure).length
  const stays = pets.map((pet, index) => {
    const groupPrice = calculateTierTariffNightlyPrice(tariff, index + 1)
    const previousPrice = index ? calculateTierTariffNightlyPrice(tariff, index) : 0
    if (groupPrice === null || previousPrice === null) return null
    const dailyRateCents = groupPrice - previousPrice
    return { bookingId: `preview-${pet.id}`, dailyRateCents, billableDays, totalCents: dailyRateCents * billableDays }
  })
  if (stays.some((price) => price === null)) return null
  const resolvedStays = stays as StayPrice[]
  return { stays: resolvedStays, totalCents: resolvedStays.reduce((total, price) => total + price.totalCents, 0) }
}
