import { computed, ref, watch } from 'vue'
import type { BookingView, Customer, NewBookingReservation, PensionClosure, Pet, RoomView } from '../domain'
import { selectRoomBookingAvailability } from '../domain/roomAvailability'
import { selectReservationCandidates } from '../store/pensionSelectors'

interface ReservationDraftSource {
  customers: readonly Customer[]
  pets: readonly Pet[]
  roomViews: () => readonly RoomView[]
  bookingViews: () => readonly BookingView[]
  pensionClosures: readonly PensionClosure[]
}

/**
 * Provides the shared selection and availability policy of every reservation form.
 * The caller owns form-specific defaults, validation copy and submission effects.
 */
export function useReservationDraft(
  source: ReservationDraftSource,
  createDraft: () => NewBookingReservation
) {
  const draft = ref<NewBookingReservation>(createDraft())
  const reservationCandidates = computed(() => selectReservationCandidates(
    source.customers, source.pets, source.bookingViews()
  ))
  const availablePets = computed(() => reservationCandidates.value.pets)
  const availableCustomers = computed(() => reservationCandidates.value.customers)
  const customerPets = computed(() => availablePets.value.filter((pet) => pet.customerId === draft.value.customerId))
  const roomAvailability = computed(() => {
    const pets = source.pets.filter((pet) => draft.value.petIds.includes(pet.id))
    return selectRoomBookingAvailability(
      source.roomViews(), source.bookingViews(), pets,
      draft.value.arrivalDate, draft.value.arrival, draft.value.departure, source.pensionClosures
    )
  })
  const selectedRoomAvailability = computed(() => roomAvailability.value.find((item) => item.room.id === draft.value.roomId))

  watch([() => draft.value.customerId, () => draft.value.petIds.join(','), () => draft.value.arrivalDate, () => draft.value.arrival, () => draft.value.departure], () => {
    if (!roomAvailability.value.some((item) => item.room.id === draft.value.roomId)) draft.value.roomId = ''
    if (!selectedRoomAvailability.value?.wouldOverbook) draft.value.allowOverbooking = false
  })

  function selectCustomer(): void {
    draft.value.petIds = []
    draft.value.roomId = ''
    draft.value.allowOverbooking = false
  }

  function resetDraft(): void {
    draft.value = createDraft()
  }

  return {
    draft,
    availablePets,
    availableCustomers,
    customerPets,
    roomAvailability,
    selectedRoomAvailability,
    selectCustomer,
    resetDraft
  }
}
