<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NewBookingReservation } from '../domain'
import { addDaysToIsoDate, isValidBookingPeriod } from '../domain/bookingPeriod'
import { useReservationDraft } from '../composables/useReservationDraft'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import BaseModal from './BaseModal.vue'
import CustomerAutocomplete from './CustomerAutocomplete.vue'

const props = defineProps<{ startDate: string }>()
const emit = defineEmits<{ close: [] }>()
const store = usePensionStore()
const error = ref('')
const createDraft = (): NewBookingReservation => ({
  customerId: '',
  petIds: [],
  roomId: '',
  arrivalDate: props.startDate,
  arrival: '09:00',
  departure: addDaysToIsoDate(props.startDate, 1),
  pickupTime: ''
})
const {
  draft, availableCustomers, customerPets, roomAvailability,
  selectedRoomAvailability, selectCustomer
} = useReservationDraft({
  customers: store.customers,
  pets: store.pets,
  roomViews: () => store.roomViews.value,
  bookingViews: () => store.bookingViews.value,
  pensionClosures: store.pensionClosures
}, createDraft)
const availabilityHint = computed(() => {
  if (!draft.value.petIds.length || !draft.value.arrivalDate || !draft.value.departure) return 'Wähle mindestens ein Tier und den Zeitraum, um freie Zimmer zu prüfen.'
  if (!isValidBookingPeriod(draft.value.arrivalDate, draft.value.arrival, draft.value.departure)) return 'Die Abreise muss nach der Anreise liegen.'
  if (!roomAvailability.value.length) return 'Für diesen Zeitraum ist kein passendes Zimmer verfügbar.'
  const freeRoomCount = roomAvailability.value.filter((item) => !item.wouldOverbook).length
  if (!freeRoomCount) return 'Kein Zimmer ist im gesamten Zeitraum frei. Du kannst eine Überbuchung bewusst anlegen.'
  return `${freeRoomCount} ${freeRoomCount === 1 ? 'passendes Zimmer ist' : 'passende Zimmer sind'} im gesamten Zeitraum frei.`
})

function submit(): void {
  error.value = ''
  if (!store.createBookingReservation(draft.value)) {
    error.value = 'Die Reservierung konnte nicht angelegt werden. Prüfe bitte alle Angaben und die Verfügbarkeit.'
    return
  }
  emit('close')
}
</script>

<template>
  <BaseModal labelled-by="occupancy-reservation-heading" modal-class="occupancy-reservation-modal max-w-[620px]" @close="$emit('close')">
    <p class="eyebrow">Kapazität prüfen</p>
    <h2 id="occupancy-reservation-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Reservierung anlegen</h2>
    <p>Die Verfügbarkeit wird für jede Nacht des Aufenthalts geprüft.</p>
    <form class="occupancy-reservation-form" @submit.prevent="submit">
      <label>Kunde
        <CustomerAutocomplete v-model="draft.customerId" input-id="occupancy-reservation-customer" label="Kunde" :customers="availableCustomers" @selected="selectCustomer" @cleared="selectCustomer" />
      </label>
      <fieldset class="pet-selection" :disabled="!draft.customerId"><legend>Tiere</legend><p>{{ draft.customerId ? 'Ein oder mehrere Tiere gemeinsam reservieren.' : 'Zuerst Kunde wählen' }}</p><label v-for="pet in customerPets" :key="pet.id" class="pet-choice"><input v-model="draft.petIds" type="checkbox" :value="pet.id" /><span>{{ pet.name }}</span></label></fieldset>
      <div class="occupancy-reservation-period">
        <label>Anreise<input v-model="draft.arrivalDate" aria-label="Anreise" type="date" required /></label>
        <label>Uhrzeit<input v-model="draft.arrival" aria-label="Uhrzeit" type="time" required /></label>
        <label>Abreise<input v-model="draft.departure" aria-label="Abreise" type="date" :min="draft.arrivalDate" required /></label>
        <label>Abholzeit <small>optional</small><input v-model="draft.pickupTime" aria-label="Abholzeit" type="time" /></label>
      </div>
      <p class="occupancy-availability-hint" :class="{ unavailable: draft.petIds.length && !roomAvailability.length }" aria-live="polite">{{ availabilityHint }}</p>
      <label>Zimmer
        <select v-model="draft.roomId" aria-label="Zimmer" :disabled="!draft.petIds.length || !roomAvailability.length" required>
          <option value="" disabled>Zimmer auswählen</option>
          <option v-for="availability in roomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} Plätze{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option>
        </select>
      </label>
      <label v-if="selectedRoomAvailability?.wouldOverbook" class="overbooking-warning"><input v-model="draft.allowOverbooking" type="checkbox" /> <span><strong>Überbuchung bewusst anlegen</strong> · Im gewählten Zeitraum fehlen mindestens {{ Math.max(1, draft.petIds.length - selectedRoomAvailability.availablePlaces) }} Plätze.</span></label>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton type="submit" variant="primary" :disabled="!draft.roomId || Boolean(selectedRoomAvailability?.wouldOverbook && !draft.allowOverbooking)">Reservieren</AppButton></div>
    </form>
  </BaseModal>
</template>
