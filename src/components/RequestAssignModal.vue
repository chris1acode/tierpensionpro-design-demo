<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleAlert, CircleCheck, ThumbsUp } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import { getCustomerRequestMatch } from '../domain/customerProfile'
import { getRequestRoomOptions } from '../domain/roomAvailability'
import { selectRoomOccupancyForPeriod } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
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
  <BaseModal labelled-by="request-assign-title" modal-class="request-assign-modal max-w-[480px]" @close="emit('close')">
    <AppEyebrow>Anfrage zuordnen</AppEyebrow>
    <h2 id="request-assign-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Anfrage von {{ request.customerFirstName }} {{ request.customerLastName }} annehmen</h2>
    <p>{{ request.petName }} · {{ request.arrivalDate }} bis {{ request.departure }}</p>
    <p
      class="request-availability my-4 flex items-center gap-[5px] rounded-[7px] px-[9px] py-[7px] text-xs font-bold leading-[1.35]"
      :class="roomOptions.availability.status === 'available' ? 'bg-[#e7f2eb] text-[#315f48]' : 'bg-[#fdf2f2] text-[#9b4444]'"
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
    <form class="grid gap-2 mt-2" @submit.prevent="confirm">
      <label for="request-assign-customer" class="text-[11px] font-bold text-[var(--muted)]">Kunde zuordnen</label>
      <select id="request-assign-customer" v-model="customerId" class="h-[38px] w-full rounded-lg border border-[var(--border)] bg-white px-[10px] text-[color:var(--text)] [font:inherit]">
        <option value="" disabled>Kunde zuordnen</option>
        <option value="new">Als neuen Kunden anlegen</option>
        <optgroup v-if="matchingCustomers.length" label="Passende bestehende Kunden">
          <option v-for="{ customer } in matchingCustomers" :key="customer.id" :value="customer.id">{{ customer.firstName }} {{ customer.lastName }} · {{ customer.email }}</option>
        </optgroup>
      </select>
      <p v-if="matchingCustomers.length" class="m-0 rounded-[7px] bg-[#eef5f3] px-[10px] py-[6px] text-left text-[13px] text-[#466b62]">
        Passender Kunde: {{ matchingCustomers.map(({ customer }) => `${customer.firstName} ${customer.lastName}`).join(', ') }}
        <template v-if="matchingCustomers.some(({ match }) => match === 'email')"> · gleiche E-Mail-Adresse</template><template v-else-if="matchingCustomers.some(({ match }) => match === 'phone')"> · gleiche Telefonnummer</template>.
        Mit der Auswahl wird die Anfrage diesem Kunden zugeordnet.
      </p>
      <label for="request-assign-room" class="text-[11px] font-bold text-[var(--muted)]">Zimmer wählen</label>
      <select id="request-assign-room" v-model="roomId" class="h-[38px] w-full rounded-lg border border-[var(--border)] bg-white px-[10px] text-[color:var(--text)] [font:inherit]">
        <option value="" disabled>Zimmer wählen</option>
        <option v-for="room in roomOptions.rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
      </select>
      <p
        v-if="selectedRoomOccupancy"
        class="m-0 rounded-[7px] px-[10px] py-[6px] text-left text-[13px]"
        :class="selectedRoomOccupancy.availablePlaces === 0 ? 'bg-[#fdf2f2] text-[#9b4444]' : 'bg-[#f4f6f5] text-[var(--muted)]'"
      >
        Auslastung im Zeitraum: {{ selectedRoomOccupancy.peakOccupied }}/{{ selectedRoomOccupancy.capacity }} Plätze
        <template v-if="selectedRoomOccupancy.peakDate"> · engster Tag {{ selectedRoomOccupancy.peakDate }}</template>
        <template v-if="selectedRoomOccupancy.availablePlaces === 0"> · bereits ausgebucht</template>
      </p>
      <p v-if="error" class="form-error" role="alert">Bitte ordne einen Kunden zu und wähle ein verfügbares Zimmer.</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
        <AppButton variant="secondary" type="button" @click="emit('close')">Abbrechen</AppButton>
        <AppButton variant="primary" type="submit" :disabled="!roomId || !customerId"><ThumbsUp :size="16" /> Anfrage annehmen</AppButton>
      </div>
    </form>
  </BaseModal>
</template>
