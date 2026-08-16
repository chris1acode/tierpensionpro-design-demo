<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleAlert, CircleCheck, ThumbsUp } from '@lucide/vue'
import type { BookingRequest, RequestPetAssignment } from '../domain'
import { getCustomerRequestMatch } from '../domain/customerProfile'
import { getRequestRoomOptions } from '../domain/roomAvailability'
import { selectRoomOccupancyForPeriod } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import AppFormError from './AppFormError.vue'
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
const petAssignments = ref<RequestPetAssignment[]>([])
const error = ref(false)

const requestAnimals = computed(() => props.request.animals?.length
  ? props.request.animals
  : [{ name: props.request.petName, species: props.request.species }])

const selectedCustomerPets = computed(() => customerId.value && customerId.value !== 'new'
  ? store.pets.filter((pet) => pet.customerId === customerId.value)
  : [])

const roomOptions = computed(() => getRequestRoomOptions(
  store.roomViews.value.filter((room) => !props.request.tariffId || room.tariffId === props.request.tariffId),
  store.bookingViews.value,
  props.request.animals?.length ? props.request.animals : props.request,
  props.request.arrivalDate,
  props.request.arrival,
  props.request.departure,
  store.pensionClosures
))

const requestedTariffName = computed(() => store.settings.tariffs.find((tariff) => tariff.id === props.request.tariffId)?.name)

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
  const assignments = requestAnimals.value.map((_, index) => petAssignments.value[index] ?? 'new')
  if (!roomId.value || !customerId.value || !store.acceptRequest(props.request.id, roomId.value, customerId.value === 'new' ? 'new' : customerId.value, assignments)) {
    error.value = true
    return
  }
  emit('accepted')
}

function resetPetAssignments(): void {
  petAssignments.value = requestAnimals.value.map(() => 'new')
  error.value = false
}
</script>

<template>
  <BaseModal labelled-by="request-assign-title" modal-class="request-assign-modal max-w-[480px]" @close="emit('close')">
    <AppEyebrow>Anfrage zuordnen</AppEyebrow>
    <h2 id="request-assign-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Anfrage von {{ request.customerFirstName }} {{ request.customerLastName }} annehmen</h2>
    <p>{{ request.animals?.length ? request.animals.map((animal) => animal.name).join(', ') : request.petName }} · {{ request.arrivalDate }} bis {{ request.departure }}<template v-if="requestedTariffName"> · Tarif: {{ requestedTariffName }}</template></p>
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
      <label for="request-assign-customer" class="text-[11px] font-bold text-app-muted">Kunde zuordnen</label>
      <select id="request-assign-customer" v-model="customerId" class="h-[38px] w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text [font:inherit]" @change="resetPetAssignments">
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
      <fieldset v-if="customerId" class="mt-2 grid gap-2 rounded-lg border border-app-border p-3">
        <legend class="px-1 text-[11px] font-bold text-app-muted">Tiere zuordnen</legend>
        <p class="m-0 text-xs leading-relaxed text-app-muted">Ordne jedes angefragte Tier einem bestehenden Profil zu oder lege es beim Annehmen neu an.</p>
        <label v-for="(animal, index) in requestAnimals" :key="`${animal.name}-${index}`" class="grid gap-1 text-[11px] font-bold text-app-muted">
          {{ animal.name }} · {{ animal.species === 'dog' ? 'Hund' : 'Katze' }}
          <select v-model="petAssignments[index]" class="h-[38px] w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text [font:inherit]">
            <option value="new">Als neues Tier anlegen</option>
            <option v-for="pet in selectedCustomerPets.filter((pet) => pet.species === animal.species && !petAssignments.includes(pet.id))" :key="pet.id" :value="pet.id">Bestehendes Tier: {{ pet.name }}</option>
            <option v-if="petAssignments[index] && petAssignments[index] !== 'new'" :value="petAssignments[index]">Bestehendes Tier: {{ selectedCustomerPets.find((pet) => pet.id === petAssignments[index])?.name }}</option>
          </select>
        </label>
      </fieldset>
      <label for="request-assign-room" class="text-[11px] font-bold text-app-muted">Zimmer wählen</label>
      <select id="request-assign-room" v-model="roomId" class="h-[38px] w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text [font:inherit]">
        <option value="" disabled>Zimmer wählen</option>
        <option v-for="room in roomOptions.rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
      </select>
      <p
        v-if="selectedRoomOccupancy"
        class="m-0 rounded-[7px] px-[10px] py-[6px] text-left text-[13px]"
        :class="selectedRoomOccupancy.availablePlaces === 0 ? 'bg-[#fdf2f2] text-[#9b4444]' : 'bg-[#f4f6f5] text-app-muted'"
      >
        Auslastung im Zeitraum: {{ selectedRoomOccupancy.peakOccupied }}/{{ selectedRoomOccupancy.capacity }} Plätze <template v-if="request.animals?.length">· benötigt {{ request.animals.length }}</template>
        <template v-if="selectedRoomOccupancy.peakDate"> · engster Tag {{ selectedRoomOccupancy.peakDate }}</template>
        <template v-if="selectedRoomOccupancy.availablePlaces === 0"> · bereits ausgebucht</template>
      </p>
      <AppFormError v-if="error">Bitte ordne einen Kunden zu und wähle ein verfügbares Zimmer.</AppFormError>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
        <AppButton variant="secondary" type="button" @click="emit('close')">Abbrechen</AppButton>
        <AppButton variant="primary" type="submit" :disabled="!roomId || !customerId"><ThumbsUp :size="16" /> Anfrage annehmen</AppButton>
      </div>
    </form>
  </BaseModal>
</template>
