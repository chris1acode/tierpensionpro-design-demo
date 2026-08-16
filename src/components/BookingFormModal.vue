<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pencil } from '@lucide/vue'
import type { BookingUpdate, BookingView, NewBookingReservation } from '../domain'
import { useReservationDraft } from '../composables/useReservationDraft'
import { usePensionStore } from '../usePensionStore'
import { selectRoomBookingAvailability } from '../domain/roomAvailability'
import { calculateTariffReservationPrice } from '../domain/stayPrice'
import { formatEuroCents } from '../presentation/currencyFormat'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import AppFormField from './AppFormField.vue'
import AppOverbookingWarning from './AppOverbookingWarning.vue'
import AppPetSelection from './AppPetSelection.vue'
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
    tariffId: store.settings.tariffs[0]?.id ?? '',
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

const reservationPricePreview = computed(() => calculateTariffReservationPrice({
  arrivalDate: draft.value.arrivalDate,
  arrival: draft.value.arrival,
  departure: draft.value.departure
}, store.pets.filter((pet) => draft.value.petIds.includes(pet.id)), store.settings.tariffs.find((tariff) => tariff.id === draft.value.tariffId)))

function selectPets() {
  draft.value.roomId = roomAvailability.value.find((item) => !item.wouldOverbook)?.room.id ?? roomAvailability.value[0]?.room.id ?? ''
}

const editDraft = ref<BookingUpdate>(props.booking
  ? {
      roomId: props.booking.roomId,
      tariffId: props.booking.tariffId ?? store.settings.tariffs[0]?.id ?? '',
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
  ? calculateTariffReservationPrice(editDraft.value, [props.booking.pet], store.settings.tariffs.find((tariff) => tariff.id === editDraft.value.tariffId))
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
  <BaseModal labelled-by="booking-form-heading" modal-class="booking-form-modal max-w-[620px]" @close="$emit('close')">
    <AppEyebrow>Aufenthaltsplanung</AppEyebrow>
    <h2 id="booking-form-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ mode === 'edit' ? 'Buchung bearbeiten' : 'Neue Buchung' }}</h2>
    <p v-if="mode === 'edit' && booking">{{ booking.customer.firstName }} {{ booking.customer.lastName }} · {{ booking.pet.name }}. Kunde und Tier bleiben dieser Buchung zugeordnet.</p>
    <p v-else>Wähle zuerst die Kundin oder den Kunden und anschließend ein oder mehrere verfügbare zugehörige Tiere.</p>

    <form v-if="mode === 'create'" class="mt-5 grid gap-[13px]" @submit.prevent="submit">
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Kunde
        <CustomerAutocomplete v-model="draft.customerId" input-id="booking-form-customer" label="Kunde" :customers="bookingCustomerChoices" :min-query-length="2" @selected="selectCustomer" @cleared="selectCustomer" />
      </label>
      <AppPetSelection v-model="draft.petIds" :pets="customerPets" :disabled="!draft.customerId" :description="draft.customerId ? 'Mehrere Tiere können gemeinsam reserviert werden.' : 'Zuerst Kunde wählen'" @change="selectPets" />
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Tarif
        <select v-model="draft.tariffId" aria-label="Tarif" required class="h-10 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text"><option value="" disabled>Tarif auswählen</option><option v-for="tariff in store.settings.tariffs" :key="tariff.id" :value="tariff.id">{{ tariff.name }}</option></select>
      </label>
      <div class="grid grid-cols-1 gap-[10px] sm:grid-cols-[1.1fr_.8fr_1.1fr]">
        <AppFormField label="Anreise"><input v-model="draft.arrivalDate" aria-label="Anreisedatum" type="date" required class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
        <AppFormField label="Uhrzeit"><input v-model="draft.arrival" aria-label="Ankunftszeit" type="time" required class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
        <AppFormField label="Abreise"><input v-model="draft.departure" aria-label="Abreise" type="date" :min="draft.arrivalDate" required class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
        <AppFormField label="Abholzeit · optional"><input v-model="draft.pickupTime" aria-label="Abholzeit" type="time" class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
      </div>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Zimmer
        <select v-model="draft.roomId" aria-label="Zimmer" :disabled="!draft.petIds.length" required class="h-10 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text disabled:cursor-not-allowed disabled:bg-[#f3f0ec] disabled:text-[#8b847e]">
          <option value="" disabled>Zimmer auswählen</option>
          <option v-for="availability in roomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option>
        </select>
      </label>
      <AppOverbookingWarning v-if="selectedRoomAvailability?.wouldOverbook" v-model="draft.allowOverbooking"><template #title>Überbuchung bewusst anlegen</template>· Im gewählten Zeitraum fehlen mindestens {{ Math.max(1, draft.petIds.length - selectedRoomAvailability.availablePlaces) }} Plätze.</AppOverbookingWarning>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Hinweis <small>optional, max. 300 Zeichen</small><textarea v-model="draft.bookingNote" maxlength="300" placeholder="z. B. Medikament mittags geben" class="min-h-16 min-w-0 w-full resize-y rounded-lg border border-app-border bg-white p-[10px] text-app-text" /></label>
      <p v-if="reservationPricePreview" class="m-0 grid min-w-[205px] grid-cols-[1fr_auto] gap-x-[10px] gap-y-[3px] rounded-lg border border-[#c9e1dc] bg-[#f2f9f7] p-[10px_12px] text-[11px] leading-[1.35] text-[#285953]"><strong class="text-xs">Preisvorschau</strong><span>{{ reservationPricePreview.stays[0]?.billableDays }} Betreuungstage · {{ draft.petIds.length }} {{ draft.petIds.length === 1 ? 'Tier' : 'Tiere' }}</span><b class="col-start-2 row-span-2 row-start-1 self-center text-[15px]">{{ formatEuroCents(reservationPricePreview.totalCents) }}</b><small class="col-span-full text-[10px] text-[#4a6865]">unverbindlich, Abrechnung beim Check-out</small></p>
      <p v-if="error" class="m-0 text-xs text-[#9b4444]" role="alert">{{ error }}</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton type="submit" variant="primary">Buchung anlegen</AppButton></div>
    </form>

    <form v-else class="mt-5 grid gap-[13px]" @submit.prevent="submit">
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Zimmer
        <select v-model="editDraft.roomId" aria-label="Zimmer" required class="h-10 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text">
          <option value="" disabled>Zimmer auswählen</option>
          <option v-for="availability in editRoomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option>
        </select>
      </label>
      <div class="grid grid-cols-1 gap-[10px] sm:grid-cols-[1.1fr_.8fr_1.1fr]">
        <AppFormField label="Anreise"><input v-model="editDraft.arrivalDate" aria-label="Anreisedatum" type="date" required class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
        <AppFormField label="Uhrzeit"><input v-model="editDraft.arrival" aria-label="Ankunftszeit" type="time" required class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
        <AppFormField label="Abreise"><input v-model="editDraft.departure" aria-label="Abreise" type="date" :min="editDraft.arrivalDate" required class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
        <AppFormField label="Abholzeit · optional"><input v-model="editDraft.pickupTime" aria-label="Abholzeit" type="time" class="h-10 min-w-0 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text" /></AppFormField>
      </div>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Hinweis <small>optional, max. 300 Zeichen</small><textarea v-model="editDraft.bookingNote" maxlength="300" placeholder="z. B. Medikament mittags geben" class="min-h-16 min-w-0 w-full resize-y rounded-lg border border-app-border bg-white p-[10px] text-app-text" /></label>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Tarif
        <select v-model="editDraft.tariffId" aria-label="Tarif" required class="h-10 w-full rounded-lg border border-app-border bg-white px-[10px] text-app-text"><option value="" disabled>Tarif auswählen</option><option v-for="tariff in store.settings.tariffs" :key="tariff.id" :value="tariff.id">{{ tariff.name }}</option></select>
      </label>
      <p v-if="editPricePreview" class="m-0 grid min-w-[205px] grid-cols-[1fr_auto] gap-x-[10px] gap-y-[3px] rounded-lg border border-[#c9e1dc] bg-[#f2f9f7] p-[10px_12px] text-[11px] leading-[1.35] text-[#285953]"><strong class="text-xs">Preisvorschau</strong><span>{{ editPricePreview.stays[0]?.billableDays }} Betreuungstage</span><b class="col-start-2 row-span-2 row-start-1 self-center text-[15px]">{{ formatEuroCents(editPricePreview.totalCents) }}</b><small class="col-span-full text-[10px] text-[#4a6865]">unverbindlich, Abrechnung beim Check-out</small></p>
      <AppOverbookingWarning v-if="selectedEditRoomAvailability?.wouldOverbook" v-model="editDraft.allowOverbooking"><template #title>Überbuchung bewusst übernehmen</template>· Im gewählten Zeitraum fehlen Plätze.</AppOverbookingWarning>
      <p v-if="error" class="m-0 text-xs text-[#9b4444]" role="alert">{{ error }}</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton type="submit" variant="primary"><Pencil :size="16" /> Änderungen speichern</AppButton></div>
    </form>
  </BaseModal>
</template>
