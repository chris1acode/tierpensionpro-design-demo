<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Download, List, Plus, Search, Trash2, X } from '@lucide/vue'
import type { BookingStatus, BookingView, NewBookingReservation } from '../domain'
import DeleteBookingModal from './DeleteBookingModal.vue'
import CustomerAutocomplete from './CustomerAutocomplete.vue'
import { bookingStatusFilters, bookingStatusLabels } from '../presentation/bookingStatus'
import { useReservationDraft } from '../composables/useReservationDraft'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { usePensionStore } from '../usePensionStore'

const props = defineProps<{ query: string }>()
const route = useRoute()
const store = usePensionStore()
const localQuery = ref('')
const status = ref<BookingStatus | 'all'>('all')
const view = ref<'list' | 'calendar'>('list')
const calendarMonth = ref('2026-08')
const currentPage = ref(1)
const bookingPageSize = 10
const formOpen = ref(false)
const error = ref('')
const bookingPendingDeletion = ref<BookingView | null>(null)
const emptyDraft = (): NewBookingReservation => ({ customerId: '', petIds: [], roomId: '', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-16' })
const {
  draft, availablePets, availableCustomers, customerPets, roomAvailability,
  selectedRoomAvailability, selectCustomer, resetDraft
} = useReservationDraft({
  customers: store.customers,
  pets: store.pets,
  roomViews: () => store.roomViews.value,
  bookingViews: () => store.bookingViews.value,
  pensionClosures: store.pensionClosures
}, emptyDraft)
const searchTerm = computed(() => resolveSearchTerm(localQuery.value, props.query))
const focusedBookingId = computed(() => typeof route.query.bookingId === 'string' ? route.query.bookingId : '')
const visibleBookings = computed(() => store.bookingViews.value
  .filter((booking) => focusedBookingId.value ? booking.id === focusedBookingId.value : status.value === 'all' || booking.status === status.value)
  .filter((booking) => focusedBookingId.value || matchesSearchTerm(searchTerm.value, [
    booking.pet.name, booking.customer.firstName, booking.customer.lastName, booking.room.name, booking.arrivalDate, booking.departure
  ]))
  .sort((a, b) => a.departure.localeCompare(b.departure)))
const pageCount = computed(() => Math.ceil(visibleBookings.value.length / bookingPageSize))
const pagedBookings = computed(() => visibleBookings.value.slice(
  (currentPage.value - 1) * bookingPageSize,
  currentPage.value * bookingPageSize
))
const calendarLabel = computed(() => new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
  .format(new Date(`${calendarMonth.value}-01T12:00:00`)))
const calendarCells = computed(() => {
  const [year, month] = calendarMonth.value.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells = Array.from({ length: mondayOffset + daysInMonth }, (_, index) => {
    const day = index - mondayOffset + 1
    if (day < 1 || day > daysInMonth) return null
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { date, day, bookings: visibleBookings.value.filter((booking) => booking.arrivalDate <= date && date < booking.departure) }
  })
  while (cells.length % 7) cells.push(null)
  return cells
})

watch([searchTerm, status, focusedBookingId], () => {
  currentPage.value = 1
})

watch(pageCount, (count) => {
  if (currentPage.value > count) currentPage.value = Math.max(1, count)
})

function selectPets() {
  draft.value.roomId = roomAvailability.value.find((item) => !item.wouldOverbook)?.room.id ?? roomAvailability.value[0]?.room.id ?? ''
}

function submit() {
  error.value = ''
  if (!store.createBookingReservation(draft.value)) {
    error.value = 'Bitte prüfe Kund:in, Tiere, Zimmer und den vollständigen Aufenthaltszeitraum.'
    return
  }
  formOpen.value = false
  resetDraft()
}

function confirmDeletion() {
  if (bookingPendingDeletion.value && store.deleteBooking(bookingPendingDeletion.value.id)) {
    bookingPendingDeletion.value = null
  }
}

function exportBookings() {
  downloadCsv({
    fileName: 'buchungen.csv',
    columns: ['Tier', 'Kund:in', 'Zimmer', 'Anreise', 'Ankunftszeit', 'Abreise', 'Status'],
    rows: visibleBookings.value.map((booking) => [
      booking.pet.name, `${booking.customer.firstName} ${booking.customer.lastName}`, booking.room.name,
      booking.arrivalDate, booking.arrival, booking.departure, bookingStatusLabels[booking.status]
    ])
  })
}

function changeCalendarMonth(offset: number) {
  const [year, month] = calendarMonth.value.split('-').map(Number)
  const date = new Date(year, month - 1 + offset, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function selectPage(page: number) {
  if (page < 1 || page > pageCount.value) return
  currentPage.value = page
}
</script>

<template>
  <main class="bookings-page">
    <div class="page-heading">
      <div><p class="eyebrow">Aufenthaltsplanung</p><h1>Buchungen</h1><p>Aufenthalte durchsuchen und neue Reservierungen verbindlich anlegen.</p></div>
      <button class="primary-button" @click="formOpen = !formOpen"><X v-if="formOpen" :size="17" /><Plus v-else :size="17" />{{ formOpen ? 'Schließen' : 'Neue Buchung' }}</button>
    </div>

    <section v-if="formOpen" class="panel booking-form-panel">
      <header><div><h2>Neue Buchung</h2><p>Wähle zuerst die Kundin oder den Kunden und anschließend ein oder mehrere verfügbare zugehörige Tiere.</p></div></header>
      <form class="booking-form" @submit.prevent="submit">
        <label>Kund:in<CustomerAutocomplete v-model="draft.customerId" input-id="booking-customer" label="Kund:in" :customers="availableCustomers" :min-query-length="2" @selected="selectCustomer" @cleared="selectCustomer" /></label>
        <fieldset class="pet-selection" :disabled="!draft.customerId"><legend>Tiere</legend><p>{{ draft.customerId ? 'Mehrere Tiere können gemeinsam reserviert werden.' : 'Zuerst Kund:in wählen' }}</p><label v-for="pet in customerPets" :key="pet.id" class="pet-choice"><input v-model="draft.petIds" type="checkbox" :value="pet.id" @change="selectPets" /><span>{{ pet.name }} · {{ pet.breed }}</span></label></fieldset>
        <label>Zimmer<select v-model="draft.roomId" :disabled="!draft.petIds.length" required><option value="" disabled>Zimmer auswählen</option><option v-for="availability in roomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option></select></label>
        <label v-if="selectedRoomAvailability?.wouldOverbook" class="overbooking-warning"><input v-model="draft.allowOverbooking" type="checkbox" /> <span><strong>Überbuchung bewusst anlegen</strong> · Im gewählten Zeitraum fehlen mindestens {{ Math.max(1, draft.petIds.length - selectedRoomAvailability.availablePlaces) }} Plätze.</span></label>
        <label>Anreisedatum<input v-model="draft.arrivalDate" type="date" required /></label>
        <label>Ankunftszeit<input v-model="draft.arrival" type="time" required /></label>
        <label>Abreise<input v-model="draft.departure" type="date" :min="draft.arrivalDate" required /></label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="primary-button" type="submit">Buchung anlegen</button>
      </form>
    </section>

    <section class="panel bookings-list">
      <header><div><h2>{{ view === 'list' ? 'Alle Aufenthalte' : 'Buchungskalender' }}</h2><p>{{ view === 'list' ? `${visibleBookings.length} passende Buchungen` : 'Aufenthalte im Monatsüberblick' }}</p></div><div class="list-header-actions"><div class="booking-view-switch" aria-label="Buchungsansicht"><button :class="{ active: view === 'list' }" aria-label="Listenansicht" @click="view = 'list'"><List :size="15" /> Liste</button><button :class="{ active: view === 'calendar' }" aria-label="Kalenderansicht" @click="view = 'calendar'"><CalendarDays :size="15" /> Kalender</button></div><button class="text-button" type="button" aria-label="Buchungen als CSV exportieren" @click="exportBookings"><Download :size="15" /> Exportieren</button><label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></div></header>
      <div class="booking-filters" aria-label="Buchungsstatus">
        <button v-for="option in bookingStatusFilters" :key="option.value" :class="{ active: status === option.value }" @click="status = option.value">{{ option.label }}</button>
      </div>
      <div v-if="view === 'calendar'" class="booking-calendar">
        <div class="booking-calendar-navigation"><button class="icon-button" aria-label="Vorheriger Monat" @click="changeCalendarMonth(-1)"><ChevronLeft :size="18" /></button><strong>{{ calendarLabel }}</strong><button class="icon-button" aria-label="Nächster Monat" @click="changeCalendarMonth(1)"><ChevronRight :size="18" /></button></div>
        <div class="booking-calendar-weekdays" aria-hidden="true"><span v-for="day in ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']" :key="day">{{ day }}</span></div>
        <div class="booking-calendar-grid" aria-label="Buchungskalender">
          <div v-for="(cell, index) in calendarCells" :key="cell?.date ?? `empty-${index}`" class="booking-calendar-day" :class="{ empty: !cell }">
            <template v-if="cell"><span>{{ cell.day }}</span><div><article v-for="booking in cell.bookings" :key="booking.id" :class="booking.status" :title="`${booking.pet.name} · ${booking.customer.firstName} ${booking.customer.lastName} · ${booking.room.name}`"><i :style="{ background: booking.pet.color }" />{{ booking.pet.name }}</article></div></template>
          </div>
        </div>
        <p v-if="!calendarCells.some((cell) => cell?.bookings.length)" class="booking-calendar-empty">Für diesen Monat passen keine Buchungen zu Suche oder Statusfilter.</p>
      </div>
      <div v-else-if="visibleBookings.length" class="booking-table">
        <article v-for="booking in pagedBookings" :id="`booking-${booking.id}`" :key="booking.id" :class="{ 'focused-booking': booking.id === focusedBookingId }">
          <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
          <div class="pet-info"><strong>{{ booking.pet.name }}</strong><span>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</span></div>
          <div><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div><small>Ankunft</small><strong>{{ booking.arrivalDate }} · {{ booking.arrival }} Uhr</strong></div>
          <div><small>Abreise</small><strong>{{ booking.departure }}</strong></div>
          <span class="booking-status" :class="booking.status">{{ bookingStatusLabels[booking.status] }}</span>
          <button v-if="store.canDeleteBooking(booking.id)" class="delete-booking-button" :aria-label="`Buchung für ${booking.pet.name} löschen`" @click="bookingPendingDeletion = booking"><Trash2 :size="16" /> Löschen</button>
        </article>
      </div>
      <nav v-if="view === 'list' && pageCount > 1" class="pagination" aria-label="Seiten in der Buchungsliste">
        <button :disabled="currentPage === 1" aria-label="Vorherige Seite" @click="selectPage(currentPage - 1)">‹</button>
        <span>Seite {{ currentPage }} von {{ pageCount }}</span>
        <button :disabled="currentPage === pageCount" aria-label="Nächste Seite" @click="selectPage(currentPage + 1)">›</button>
      </nav>
      <div v-if="view === 'list' && !visibleBookings.length" class="empty-state"><span><Search v-if="searchTerm" /><Check v-else /></span><strong>Keine Buchungen gefunden.</strong><p>Ändere Suche oder Statusfilter.</p></div>
    </section>
    <DeleteBookingModal v-if="bookingPendingDeletion" :booking="bookingPendingDeletion" @close="bookingPendingDeletion = null" @confirm="confirmDeletion" />
  </main>
</template>
