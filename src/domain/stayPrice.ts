import type { BookingView, DailyPetRate, Pet, PetSpecies, ReservationPrice, StayPrice } from '../domain'
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
  booking: Pick<BookingView, 'id' | 'arrivalDate' | 'arrival' | 'departure'> & { pet: Pick<Pet, 'species'> },
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

/**
 * Calculates a non-binding total for the animals selected in one reservation.
 * A missing rate or invalid period deliberately produces no invented amount.
 */
export function calculateReservationPrice(
  stay: Pick<BookingView, 'arrivalDate' | 'arrival' | 'departure'>,
  pets: readonly Pick<Pet, 'id' | 'species'>[],
  rates: readonly DailyPetRate[]
): ReservationPrice | null {
  if (!pets.length) return null

  const stays = pets.map((pet) => calculateStayPrice({ ...stay, id: `preview-${pet.id}`, pet }, rates))
  if (stays.some((price) => price === null)) return null

  const resolvedStays = stays as StayPrice[]
  return {
    stays: resolvedStays,
    totalCents: resolvedStays.reduce((total, price) => total + price.totalCents, 0)
  }
}
