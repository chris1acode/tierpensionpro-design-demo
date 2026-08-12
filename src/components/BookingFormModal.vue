<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pencil } from '@lucide/vue'
import type { BookingUpdate, BookingView, NewBookingReservation } from '../domain'
import { useReservationDraft } from '../composables/useReservationDraft'
import { usePensionStore } from '../usePensionStore'
import { selectRoomBookingAvailability } from '../domain/roomAvailability'
import { calculateReservationPrice, calculateStayPrice } from '../domain/stayPrice'
import { formatEuroCents } from '../presentation/currencyFormat'
import BaseModal from './BaseModal.vue'
import CustomerAutocomplete from './CustomerAutocomplete.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  booking?: BookingView
  presetCustomerId?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const store = usePensionStore()
const error = ref('')

function createDraft(): NewBookingReservation {
  return {
    customerId: props.presetCustomerId ?? '',
    petIds: [],
    roomId: '',
    arrivalDate: store.businessDate.value,
    arrival: '09:00',
    departure: store.businessDate.value,
    pickupTime: '',
    bookingNote: ''
  }
}

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

if (props.mode === 'create' && props.presetCustomerId) selectCustomer()

const bookingCustomerChoices = computed(() => {
  const selectedCustomer = store.customers.find((customer) => customer.id === draft.value.customerId)
  return selectedCustomer && !availableCustomers.value.some((customer) => customer.id === selectedCustomer.id)
    ? [selectedCustomer, ...availableCustomers.value]
    : availableCustomers.value
})

const reservationPricePreview = computed(() => calculateReservationPrice({
  arrivalDate: draft.value.arrivalDate,
  arrival: draft.value.arrival,
  departure: draft.value.departure
}, store.pets.filter((pet) => draft.value.petIds.includes(pet.id)), store.settings.dailyPetRates))

function selectPets() {
  draft.value.roomId = roomAvailability.value.find((item) => !item.wouldOverbook)?.room.id ?? roomAvailability.value[0]?.room.id ?? ''
}

const editDraft = ref<BookingUpdate>(props.booking
  ? {
      roomId: props.booking.roomId,
      arrivalDate: props.booking.arrivalDate,
      arrival: props.booking.arrival,
      departure: props.booking.departure,
      pickupTime: props.booking.pickupTime ?? '',
      bookingNote: props.booking.bookingNote ?? '',
      allowOverbooking: props.booking.overbooked
    }
  : { roomId: '', arrivalDate: '', arrival: '', departure: '', pickupTime: '', bookingNote: '' })

const editRoomAvailability = computed(() => {
  if (!props.booking) return []
  return selectRoomBookingAvailability(
    store.roomViews.value,
    store.bookingViews.value.filter((item) => item.id !== props.booking!.id),
    props.booking.pet,
    editDraft.value.arrivalDate,
    editDraft.value.arrival,
    editDraft.value.departure,
    store.pensionClosures
  )
})
const selectedEditRoomAvailability = computed(() => editRoomAvailability.value.find((item) => item.room.id === editDraft.value.roomId))
const editPricePreview = computed(() => props.booking
  ? calculateStayPrice({ ...editDraft.value, id: props.booking.id, pet: props.booking.pet }, store.settings.dailyPetRates)
  : null)

watch([() => editDraft.value.arrivalDate, () => editDraft.value.arrival, () => editDraft.value.departure, editRoomAvailability], () => {
  if (!editRoomAvailability.value.some((item) => item.room.id === editDraft.value.roomId)) editDraft.value.roomId = ''
  if (!selectedEditRoomAvailability.value?.wouldOverbook) editDraft.value.allowOverbooking = false
})

function submit() {
  error.value = ''
  if (props.mode === 'edit' && props.booking) {
    if (!store.updateBooking(props.booking.id, editDraft.value)) {
      error.value = 'Bitte prüfe Zimmer, Zeitraum und die Kapazität.'
      return
    }
    emit('close')
    return
  }

  if (!store.createBookingReservation(draft.value)) {
    error.value = 'Bitte prüfe Kunde, Tiere, Zimmer und den vollständigen Aufenthaltszeitraum.'
    return
  }
  emit('close')
}
</script>

<template>
  <BaseModal labelled-by="booking-form-heading" modal-class="booking-form-modal" @close="$emit('close')">
    <p class="eyebrow">Aufenthaltsplanung</p>
    <h2 id="booking-form-heading">{{ mode === 'edit' ? 'Buchung bearbeiten' : 'Neue Buchung' }}</h2>
    <p v-if="mode === 'edit' && booking">{{ booking.customer.firstName }} {{ booking.customer.lastName }} · {{ booking.pet.name }}. Kunde und Tier bleiben dieser Buchung zugeordnet.</p>
    <p v-else>Wähle zuerst die Kundin oder den Kunden und anschließend ein oder mehrere verfügbare zugehörige Tiere.</p>

    <form v-if="mode === 'create'" class="occupancy-reservation-form" @submit.prevent="submit">
      <label>Kunde
        <CustomerAutocomplete v-model="draft.customerId" input-id="booking-form-customer" label="Kunde" :customers="bookingCustomerChoices" :min-query-length="2" @selected="selectCustomer" @cleared="selectCustomer" />
      </label>
      <fieldset class="pet-selection" :disabled="!draft.customerId"><legend>Tiere</legend><p>{{ draft.customerId ? 'Mehrere Tiere können gemeinsam reserviert werden.' : 'Zuerst Kunde wählen' }}</p><label v-for="pet in customerPets" :key="pet.id" class="pet-choice"><input v-model="draft.petIds" type="checkbox" :value="pet.id" @change="selectPets" /><span>{{ pet.name }}</span></label></fieldset>
      <div class="occupancy-reservation-period">
        <label>Anreise<input v-model="draft.arrivalDate" aria-label="Anreisedatum" type="date" required /></label>
        <label>Uhrzeit<input v-model="draft.arrival" aria-label="Ankunftszeit" type="time" required /></label>
        <label>Abreise<input v-model="draft.departure" aria-label="Abreise" type="date" :min="draft.arrivalDate" required /></label>
        <label>Abholzeit <small>optional</small><input v-model="draft.pickupTime" aria-label="Abholzeit" type="time" /></label>
      </div>
      <label>Zimmer
        <select v-model="draft.roomId" aria-label="Zimmer" :disabled="!draft.petIds.length" required>
          <option value="" disabled>Zimmer auswählen</option>
          <option v-for="availability in roomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option>
        </select>
      </label>
      <label v-if="selectedRoomAvailability?.wouldOverbook" class="overbooking-warning"><input v-model="draft.allowOverbooking" type="checkbox" /> <span><strong>Überbuchung bewusst anlegen</strong> · Im gewählten Zeitraum fehlen mindestens {{ Math.max(1, draft.petIds.length - selectedRoomAvailability.availablePlaces) }} Plätze.</span></label>
      <label>Hinweis <small>optional, max. 300 Zeichen</small><textarea v-model="draft.bookingNote" maxlength="300" placeholder="z. B. Medikament mittags geben" /></label>
      <p v-if="reservationPricePreview" class="booking-price-preview"><strong>Preisvorschau</strong><span>{{ reservationPricePreview.stays[0]?.billableDays }} Betreuungstage · {{ draft.petIds.length }} {{ draft.petIds.length === 1 ? 'Tier' : 'Tiere' }}</span><b>{{ formatEuroCents(reservationPricePreview.totalCents) }}</b><small>unverbindlich, Abrechnung beim Check-out</small></p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="$emit('close')">Abbrechen</button><button type="submit" class="primary-button">Buchung anlegen</button></div>
    </form>

    <form v-else class="occupancy-reservation-form" @submit.prevent="submit">
      <label>Zimmer
        <select v-model="editDraft.roomId" aria-label="Zimmer" required>
          <option value="" disabled>Zimmer auswählen</option>
          <option v-for="availability in editRoomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option>
        </select>
      </label>
      <div class="occupancy-reservation-period">
        <label>Anreise<input v-model="editDraft.arrivalDate" aria-label="Anreisedatum" type="date" required /></label>
        <label>Uhrzeit<input v-model="editDraft.arrival" aria-label="Ankunftszeit" type="time" required /></label>
        <label>Abreise<input v-model="editDraft.departure" aria-label="Abreise" type="date" :min="editDraft.arrivalDate" required /></label>
        <label>Abholzeit <small>optional</small><input v-model="editDraft.pickupTime" aria-label="Abholzeit" type="time" /></label>
      </div>
      <label>Hinweis <small>optional, max. 300 Zeichen</small><textarea v-model="editDraft.bookingNote" maxlength="300" placeholder="z. B. Medikament mittags geben" /></label>
      <p v-if="editPricePreview" class="booking-price-preview"><strong>Preisvorschau</strong><span>{{ editPricePreview.billableDays }} Betreuungstage</span><b>{{ formatEuroCents(editPricePreview.totalCents) }}</b><small>unverbindlich, Abrechnung beim Check-out</small></p>
      <label v-if="selectedEditRoomAvailability?.wouldOverbook" class="overbooking-warning"><input v-model="editDraft.allowOverbooking" type="checkbox" /> <span><strong>Überbuchung bewusst übernehmen</strong> · Im gewählten Zeitraum fehlen Plätze.</span></label>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="$emit('close')">Abbrechen</button><button type="submit" class="primary-button"><Pencil :size="16" /> Änderungen speichern</button></div>
    </form>
  </BaseModal>
</template>
