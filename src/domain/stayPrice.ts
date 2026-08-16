import type { BookingView, DailyPetRate, Pet, PetSpecies, PriceTierTariff, ReservationPrice, StayPrice } from '../domain'
import { enumerateStayDates, isValidBookingPeriod } from './bookingPeriod'
import { calculateTierTariffNightlyPrice } from './tariffPrice'

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
