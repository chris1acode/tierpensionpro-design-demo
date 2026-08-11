<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleAlert, CircleCheck, ThumbsUp } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import { getCustomerRequestMatch } from '../domain/customerProfile'
import { getRequestRoomOptions } from '../domain/roomAvailability'
import { selectRoomOccupancyForPeriod } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  request: BookingRequest
}>()

const emit = defineEmits<{
  close: []
  accepted: []
}>()

const store = usePensionStore()
const customerId = ref('')
const roomId = ref('')
const error = ref(false)

const roomOptions = computed(() => getRequestRoomOptions(
  store.roomViews.value,
  store.bookingViews.value,
  props.request,
  props.request.arrivalDate,
  props.request.arrival,
  props.request.departure,
  store.pensionClosures
))

const matchingCustomers = computed(() => store.customers.flatMap((customer) => {
  const match = getCustomerRequestMatch(customer, props.request)
  return match ? [{ customer, match }] : []
}))

const selectedRoomOccupancy = computed(() => {
  const selectedRoom = store.rooms.find((room) => room.id === roomId.value)
  return selectedRoom
    ? selectRoomOccupancyForPeriod(selectedRoom, store.bookingViews.value, props.request.arrivalDate, props.request.departure)
    : null
})

function confirm() {
  if (!roomId.value || !customerId.value || !store.acceptRequest(props.request.id, roomId.value, customerId.value === 'new' ? 'new' : customerId.value)) {
    error.value = true
    return
  }
  emit('accepted')
}
</script>

<template>
  <BaseModal labelled-by="request-assign-title" modal-class="request-assign-modal" @close="emit('close')">
    <p class="eyebrow">Anfrage zuordnen</p>
    <h2 id="request-assign-title">Anfrage von {{ request.customerFirstName }} {{ request.customerLastName }} annehmen</h2>
    <p>{{ request.petName }} · {{ request.breed }} · {{ request.arrivalDate }} bis {{ request.departure }}</p>
    <p
      class="request-availability"
      :class="roomOptions.availability.status"
      :aria-label="`Verfügbarkeit: ${roomOptions.availability.status === 'available' ? 'frei' : 'nicht frei'}`"
    >
      <CircleCheck v-if="roomOptions.availability.status === 'available'" :size="15" />
      <CircleAlert v-else :size="15" />
      <template v-if="roomOptions.availability.status === 'available'">
        Zeitraum frei · {{ roomOptions.availability.availableRoomCount }} passende {{ roomOptions.availability.availableRoomCount === 1 ? 'Option' : 'Optionen' }}
      </template>
      <template v-else-if="roomOptions.availability.status === 'closed'">Zeitraum wegen Schließzeit nicht frei</template>
      <template v-else>Zeitraum derzeit nicht frei</template>
    </p>
    <form class="request-assign-form" @submit.prevent="confirm">
      <label for="request-assign-customer">Kunde zuordnen</label>
      <select id="request-assign-customer" v-model="customerId">
        <option value="" disabled>Kunde zuordnen</option>
        <option value="new">Als neuen Kunden anlegen</option>
        <optgroup v-if="matchingCustomers.length" label="Passende bestehende Kunden">
          <option v-for="{ customer } in matchingCustomers" :key="customer.id" :value="customer.id">{{ customer.firstName }} {{ customer.lastName }} · {{ customer.email }}</option>
        </optgroup>
      </select>
      <p v-if="matchingCustomers.length" class="customer-match-hint">
        Passender Kunde: {{ matchingCustomers.map(({ customer }) => `${customer.firstName} ${customer.lastName}`).join(', ') }}
        <template v-if="matchingCustomers.some(({ match }) => match === 'email')"> · gleiche E-Mail-Adresse</template><template v-else-if="matchingCustomers.some(({ match }) => match === 'phone')"> · gleiche Telefonnummer</template>.
        Mit der Auswahl wird die Anfrage diesem Kunden zugeordnet.
      </p>
      <label for="request-assign-room">Zimmer wählen</label>
      <select id="request-assign-room" v-model="roomId">
        <option value="" disabled>Zimmer wählen</option>
        <option v-for="room in roomOptions.rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
      </select>
      <p
        v-if="selectedRoomOccupancy"
        class="room-occupancy-hint"
        :class="{ full: selectedRoomOccupancy.availablePlaces === 0 }"
      >
        Auslastung im Zeitraum: {{ selectedRoomOccupancy.peakOccupied }}/{{ selectedRoomOccupancy.capacity }} Plätze
        <template v-if="selectedRoomOccupancy.peakDate"> · engster Tag {{ selectedRoomOccupancy.peakDate }}</template>
        <template v-if="selectedRoomOccupancy.availablePlaces === 0"> · bereits ausgebucht</template>
      </p>
      <p v-if="error" class="form-error" role="alert">Bitte ordne einen Kunden zu und wähle ein verfügbares Zimmer.</p>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="emit('close')">Abbrechen</button>
        <button class="primary-button" type="submit" :disabled="!roomId || !customerId"><ThumbsUp :size="16" /> Anfrage annehmen</button>
      </div>
    </form>
  </BaseModal>
</template>
