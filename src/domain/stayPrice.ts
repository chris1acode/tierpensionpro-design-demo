import type { BookingView, DailyPetRate, PetSpecies, StayPrice } from '../domain'
import { enumerateStayDates, isValidBookingPeriod } from './bookingPeriod'

function dailyRateFor(species: PetSpecies, rates: readonly DailyPetRate[]): number | null {
  const rate = rates.find((item) => item.species === species)
  return rate && Number.isInteger(rate.amountCents) && rate.amountCents > 0 ? rate.amountCents : null
}

/**
 * Calculates the accommodation charge from the configured rate and the
 * occupied calendar days. The departure day itself is not charged.
 */
export function calculateStayPrice(
  booking: Pick<BookingView, 'id' | 'arrivalDate' | 'arrival' | 'departure' | 'pet'>,
  rates: readonly DailyPetRate[]
): StayPrice | null {
  if (!isValidBookingPeriod(booking.arrivalDate, booking.arrival, booking.departure)) return null

  const dailyRateCents = dailyRateFor(booking.pet.species, rates)
  if (dailyRateCents === null) return null

  const billableDays = enumerateStayDates(booking.arrivalDate, booking.departure).length
  return {
    bookingId: booking.id,
    dailyRateCents,
    billableDays,
    totalCents: billableDays * dailyRateCents
  }
}
