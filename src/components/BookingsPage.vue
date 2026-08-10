<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Plus, Search, X } from '@lucide/vue'
import type { BookingStatus, NewBooking } from '../domain'
import { isRoomCompatibleWithSpecies } from '../domain/roomCompatibility'
import { bookingStatusFilters, bookingStatusLabels } from '../presentation/bookingStatus'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { usePensionStore } from '../usePensionStore'

const props = defineProps<{ query: string }>()
const store = usePensionStore()
const localQuery = ref('')
const status = ref<BookingStatus | 'all'>('all')
const formOpen = ref(false)
const error = ref('')
const emptyDraft = (): NewBooking => ({ customerId: '', petId: '', roomId: '', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-16' })
const draft = ref<NewBooking>(emptyDraft())

const availablePets = computed(() => store.pets.filter((pet) =>
  !store.bookingViews.value.some((booking) => booking.petId === pet.id && booking.status !== 'checked-out')))
const availableCustomers = computed(() => store.customers.filter((customer) =>
  availablePets.value.some((pet) => pet.customerId === customer.id)))
const customerPets = computed(() => availablePets.value.filter((pet) => pet.customerId === draft.value.customerId))
const compatibleRooms = computed(() => {
  const pet = store.pets.find((item) => item.id === draft.value.petId)
  const readyRooms = store.roomViews.value.filter((room) => room.operationalState.status === 'ready')
  if (!pet) return readyRooms
  return readyRooms.filter((room) => isRoomCompatibleWithSpecies(room, pet.species))
})
const searchTerm = computed(() => resolveSearchTerm(localQuery.value, props.query))
const visibleBookings = computed(() => store.bookingViews.value
  .filter((booking) => status.value === 'all' || booking.status === status.value)
  .filter((booking) => matchesSearchTerm(searchTerm.value, [
    booking.pet.name, booking.customer.firstName, booking.customer.lastName, booking.room.name, booking.arrivalDate, booking.departure
  ]))
  .sort((a, b) => a.departure.localeCompare(b.departure)))

function selectPet() {
  draft.value.roomId = compatibleRooms.value[0]?.id ?? ''
}

function selectCustomer() {
  draft.value.petId = ''
  draft.value.roomId = ''
}

function submit() {
  error.value = ''
  if (!store.createBooking(draft.value)) {
    error.value = 'Bitte prüfe Kund:in, Tier, Zimmer und den vollständigen Aufenthaltszeitraum.'
    return
  }
  formOpen.value = false
  draft.value = emptyDraft()
}
</script>

<template>
  <main class="bookings-page">
    <div class="page-heading">
      <div><p class="eyebrow">Aufenthaltsplanung</p><h1>Buchungen</h1><p>Aufenthalte durchsuchen und neue Reservierungen verbindlich anlegen.</p></div>
      <button class="primary-button" @click="formOpen = !formOpen"><X v-if="formOpen" :size="17" /><Plus v-else :size="17" />{{ formOpen ? 'Schließen' : 'Neue Buchung' }}</button>
    </div>

    <section v-if="formOpen" class="panel booking-form-panel">
      <header><div><h2>Neue Buchung</h2><p>Wähle zuerst die Kundin oder den Kunden und anschließend ein verfügbares zugehöriges Tier.</p></div></header>
      <form class="booking-form" @submit.prevent="submit">
        <label>Kund:in<select v-model="draft.customerId" aria-label="Kund:in" required @change="selectCustomer"><option value="" disabled>Kund:in auswählen</option><option v-for="customer in availableCustomers" :key="customer.id" :value="customer.id">{{ customer.firstName }} {{ customer.lastName }}</option></select></label>
        <label>Tier<select v-model="draft.petId" aria-label="Tier" :disabled="!draft.customerId" required @change="selectPet"><option value="" disabled>{{ draft.customerId ? 'Tier auswählen' : 'Zuerst Kund:in wählen' }}</option><option v-for="pet in customerPets" :key="pet.id" :value="pet.id">{{ pet.name }} · {{ pet.breed }}</option></select></label>
        <label>Zimmer<select v-model="draft.roomId" :disabled="!draft.petId" required><option value="" disabled>Zimmer auswählen</option><option v-for="room in compatibleRooms" :key="room.id" :value="room.id">{{ room.name }} · {{ room.capacity }} Plätze</option></select></label>
        <label>Anreisedatum<input v-model="draft.arrivalDate" type="date" required /></label>
        <label>Ankunftszeit<input v-model="draft.arrival" type="time" required /></label>
        <label>Abreise<input v-model="draft.departure" type="date" :min="draft.arrivalDate" required /></label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="primary-button" type="submit">Buchung anlegen</button>
      </form>
    </section>

    <section class="panel bookings-list">
      <header><div><h2>Alle Aufenthalte</h2><p>{{ visibleBookings.length }} passende Buchungen</p></div><label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></header>
      <div class="booking-filters" aria-label="Buchungsstatus">
        <button v-for="option in bookingStatusFilters" :key="option.value" :class="{ active: status === option.value }" @click="status = option.value">{{ option.label }}</button>
      </div>
      <div v-if="visibleBookings.length" class="booking-table">
        <article v-for="booking in visibleBookings" :key="booking.id">
          <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
          <div class="pet-info"><strong>{{ booking.pet.name }}</strong><span>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</span></div>
          <div><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div><small>Ankunft</small><strong>{{ booking.arrivalDate }} · {{ booking.arrival }} Uhr</strong></div>
          <div><small>Abreise</small><strong>{{ booking.departure }}</strong></div>
          <span class="booking-status" :class="booking.status">{{ bookingStatusLabels[booking.status] }}</span>
        </article>
      </div>
      <div v-else class="empty-state"><span><Search v-if="searchTerm" /><Check v-else /></span><strong>Keine Buchungen gefunden.</strong><p>Ändere Suche oder Statusfilter.</p></div>
    </section>
  </main>
</template>
