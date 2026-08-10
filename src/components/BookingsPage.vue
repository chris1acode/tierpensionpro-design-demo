<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Download, List, LogOut, Pencil, Plus, Search, Trash2, X } from '@lucide/vue'
import type { BookingStatus, BookingUpdate, BookingView, DepartureView, NewBookingReservation } from '../domain'
import DeleteBookingModal from './DeleteBookingModal.vue'
import CustomerAutocomplete from './CustomerAutocomplete.vue'
import { bookingStatusFilters, bookingStatusLabels } from '../presentation/bookingStatus'
import { usePagination } from '../composables/usePagination'
import { useReservationDraft } from '../composables/useReservationDraft'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { usePensionStore } from '../usePensionStore'
import { createBookingTimeline } from '../domain/bookingTimeline'
import { addDaysToIsoDate, buildDateRange, fromLocalIsoDate } from '../domain/bookingPeriod'
import { formatDayAndMonth, formatShortWeekday } from '../presentation/dateFormat'
import { selectRoomBookingAvailability } from '../domain/roomAvailability'
import { formatEuroCents } from '../presentation/currencyFormat'
import { calculateReservationPrice, calculateStayPrice } from '../domain/stayPrice'

const route = useRoute()
const router = useRouter()
const store = usePensionStore()
const emit = defineEmits<{ checkOut: [departure: DepartureView] }>()
const localQuery = ref('')
const status = ref<BookingStatus | 'all'>('all')
const view = ref<'list' | 'calendar'>('list')
const calendarStart = ref(store.businessDate.value)
const calendarDays = 7
const bookingPageSize = 10
const formOpen = ref(false)
const error = ref('')
const bookingPendingDeletion = ref<BookingView | null>(null)
const bookingBeingEdited = ref<BookingView | null>(null)
const editError = ref('')
const editDraft = ref<BookingUpdate>({ roomId: '', arrivalDate: '', arrival: '', departure: '', pickupTime: '', bookingNote: '' })
const emptyDraft = (): NewBookingReservation => ({ customerId: '', petIds: [], roomId: '', arrivalDate: '2026-08-09', arrival: '09:00', departure: '2026-08-16', pickupTime: '', bookingNote: '' })
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
const searchTerm = computed(() => resolveSearchTerm(localQuery.value))
const focusedBookingId = computed(() => typeof route.query.bookingId === 'string' ? route.query.bookingId : '')
const shouldFocusBooking = computed(() => view.value === 'list' && Boolean(focusedBookingId.value))
const editBookingId = computed(() => route.query.edit === 'true' ? focusedBookingId.value : '')
const preselectedCustomerId = computed(() => typeof route.query.customerId === 'string' ? route.query.customerId : '')
const bookingCustomerChoices = computed(() => {
  const selectedCustomer = store.customers.find((customer) => customer.id === draft.value.customerId)
  return selectedCustomer && !availableCustomers.value.some((customer) => customer.id === selectedCustomer.id)
    ? [selectedCustomer, ...availableCustomers.value]
    : availableCustomers.value
})
const visibleBookings = computed(() => store.bookingViews.value
  .filter((booking) => shouldFocusBooking.value ? booking.id === focusedBookingId.value : status.value === 'all' || booking.status === status.value)
  .filter((booking) => shouldFocusBooking.value || matchesSearchTerm(searchTerm.value, [
    booking.pet.name, booking.customer.firstName, booking.customer.lastName, booking.room.name, booking.arrivalDate, booking.departure
  ]))
  .sort((a, b) => a.departure.localeCompare(b.departure)))
const { currentPage, pageCount, pagedItems: pagedBookings, resetPage, selectPage } = usePagination(visibleBookings, bookingPageSize)
const calendarDates = computed(() => buildDateRange(fromLocalIsoDate(calendarStart.value), calendarDays))
const calendarLabel = computed(() => `${formatDayAndMonth(calendarDates.value[0] ?? calendarStart.value)} – ${formatDayAndMonth(calendarDates.value.at(-1) ?? calendarStart.value)}`)
const bookingTimeline = computed(() => createBookingTimeline(visibleBookings.value, store.rooms, calendarStart.value, calendarDays))
const editRoomAvailability = computed(() => {
  const booking = bookingBeingEdited.value
  if (!booking) return []
  return selectRoomBookingAvailability(
    store.roomViews.value,
    store.bookingViews.value.filter((item) => item.id !== booking.id),
    booking.pet,
    editDraft.value.arrivalDate,
    editDraft.value.arrival,
    editDraft.value.departure,
    store.pensionClosures
  )
})
const selectedEditRoomAvailability = computed(() => editRoomAvailability.value.find((item) => item.room.id === editDraft.value.roomId))
const reservationPricePreview = computed(() => calculateReservationPrice({
  arrivalDate: draft.value.arrivalDate,
  arrival: draft.value.arrival,
  departure: draft.value.departure
}, store.pets.filter((pet) => draft.value.petIds.includes(pet.id)), store.settings.dailyPetRates))
const editPricePreview = computed(() => bookingBeingEdited.value
  ? calculateStayPrice({ ...editDraft.value, id: bookingBeingEdited.value.id, pet: bookingBeingEdited.value.pet }, store.settings.dailyPetRates)
  : null)

watch([searchTerm, status, focusedBookingId], () => {
  resetPage()
})

watch(editBookingId, (bookingId) => {
  const booking = store.bookingViews.value.find((item) => item.id === bookingId)
  if (!booking || booking.status !== 'confirmed') return
  bookingBeingEdited.value = booking
  editError.value = ''
  editDraft.value = {
    roomId: booking.roomId,
    arrivalDate: booking.arrivalDate,
    arrival: booking.arrival,
    departure: booking.departure,
    pickupTime: booking.pickupTime ?? '',
    bookingNote: booking.bookingNote ?? '',
    allowOverbooking: booking.overbooked
  }
}, { immediate: true })

watch(preselectedCustomerId, (customerId) => {
  if (!customerId || !store.customers.some((customer) => customer.id === customerId)) return
  formOpen.value = true
  resetDraft()
  draft.value.customerId = customerId
  selectCustomer()
}, { immediate: true })

watch([() => editDraft.value.arrivalDate, () => editDraft.value.arrival, () => editDraft.value.departure, editRoomAvailability], () => {
  if (bookingBeingEdited.value && !editRoomAvailability.value.some((item) => item.room.id === editDraft.value.roomId)) {
    editDraft.value.roomId = ''
  }
  if (!selectedEditRoomAvailability.value?.wouldOverbook) editDraft.value.allowOverbooking = false
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

function submitEdit() {
  const booking = bookingBeingEdited.value
  if (!booking) return
  editError.value = ''
  if (!store.updateBooking(booking.id, editDraft.value)) {
    editError.value = 'Bitte prüfe Zimmer, Zeitraum und die Kapazität.'
    return
  }
  bookingBeingEdited.value = null
}

function exportBookings() {
  downloadCsv({
    fileName: 'buchungen.csv',
    columns: ['Tier', 'Kund:in', 'Zimmer', 'Anreise', 'Ankunftszeit', 'Abreise', 'Abholzeit', 'Hinweis', 'Status', 'Rechnungsbetrag'],
    rows: visibleBookings.value.map((booking) => [
      booking.pet.name, `${booking.customer.firstName} ${booking.customer.lastName}`, booking.room.name,
      booking.arrivalDate, booking.arrival, booking.departure, booking.pickupTime ?? '', booking.bookingNote ?? '', bookingStatusLabels[booking.status],
      booking.checkoutPrice ? formatEuroCents(booking.checkoutPrice.totalCents) : ''
    ])
  })
}

function changeCalendarWeek(offset: number) {
  calendarStart.value = addDaysToIsoDate(calendarStart.value, offset * calendarDays)
}

function jumpTimelineToToday() {
  calendarStart.value = store.businessDate.value
}

function openBookingFromTimeline(bookingId: string) {
  view.value = 'list'
  void router.push({ name: 'bookings', query: { bookingId } })
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
        <label>Kund:in<CustomerAutocomplete v-model="draft.customerId" input-id="booking-customer" label="Kund:in" :customers="bookingCustomerChoices" :min-query-length="2" @selected="selectCustomer" @cleared="selectCustomer" /></label>
        <fieldset class="pet-selection" :disabled="!draft.customerId"><legend>Tiere</legend><p>{{ draft.customerId ? 'Mehrere Tiere können gemeinsam reserviert werden.' : 'Zuerst Kund:in wählen' }}</p><label v-for="pet in customerPets" :key="pet.id" class="pet-choice"><input v-model="draft.petIds" type="checkbox" :value="pet.id" @change="selectPets" /><span>{{ pet.name }} · {{ pet.breed }}</span></label></fieldset>
        <label>Zimmer<select v-model="draft.roomId" :disabled="!draft.petIds.length" required><option value="" disabled>Zimmer auswählen</option><option v-for="availability in roomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option></select></label>
        <label v-if="selectedRoomAvailability?.wouldOverbook" class="overbooking-warning"><input v-model="draft.allowOverbooking" type="checkbox" /> <span><strong>Überbuchung bewusst anlegen</strong> · Im gewählten Zeitraum fehlen mindestens {{ Math.max(1, draft.petIds.length - selectedRoomAvailability.availablePlaces) }} Plätze.</span></label>
        <label>Anreisedatum<input v-model="draft.arrivalDate" type="date" required /></label>
        <label>Ankunftszeit<input v-model="draft.arrival" type="time" required /></label>
        <label>Abreise<input v-model="draft.departure" type="date" :min="draft.arrivalDate" required /></label>
        <label>Abholzeit <small>optional</small><input v-model="draft.pickupTime" type="time" /></label>
        <label class="booking-note-input">Hinweis <small>optional, max. 300 Zeichen</small><textarea v-model="draft.bookingNote" maxlength="300" placeholder="z. B. Medikament mittags geben" /></label>
        <p v-if="reservationPricePreview" class="booking-price-preview"><strong>Preisvorschau</strong><span>{{ reservationPricePreview.stays[0]?.billableDays }} Betreuungstage · {{ draft.petIds.length }} {{ draft.petIds.length === 1 ? 'Tier' : 'Tiere' }}</span><b>{{ formatEuroCents(reservationPricePreview.totalCents) }}</b><small>unverbindlich, Abrechnung beim Check-out</small></p>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="primary-button" type="submit">Buchung anlegen</button>
      </form>
    </section>

    <section v-if="bookingBeingEdited" class="panel booking-form-panel edit-booking-panel">
      <header><div><h2>Buchung bearbeiten</h2><p>{{ bookingBeingEdited.customer.firstName }} {{ bookingBeingEdited.customer.lastName }} · {{ bookingBeingEdited.pet.name }}. Kundschaft und Tier bleiben dieser Buchung zugeordnet.</p></div><button class="text-button" type="button" @click="bookingBeingEdited = null"><X :size="15" /> Schließen</button></header>
      <form class="booking-form edit-booking-form" @submit.prevent="submitEdit">
        <label>Zimmer<select v-model="editDraft.roomId" required><option value="" disabled>Zimmer auswählen</option><option v-for="availability in editRoomAvailability" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.room.capacity }} {{ availability.room.capacity === 1 ? 'Platz' : 'Plätze' }}{{ availability.wouldOverbook ? ' · Überbuchung' : '' }}</option></select></label>
        <label>Anreisedatum<input v-model="editDraft.arrivalDate" type="date" required /></label>
        <label>Ankunftszeit<input v-model="editDraft.arrival" type="time" required /></label>
        <label>Abreise<input v-model="editDraft.departure" type="date" :min="editDraft.arrivalDate" required /></label>
        <label>Abholzeit <small>optional</small><input v-model="editDraft.pickupTime" type="time" /></label>
        <label class="booking-note-input">Hinweis <small>optional, max. 300 Zeichen</small><textarea v-model="editDraft.bookingNote" maxlength="300" placeholder="z. B. Medikament mittags geben" /></label>
        <p v-if="editPricePreview" class="booking-price-preview"><strong>Preisvorschau</strong><span>{{ editPricePreview.billableDays }} Betreuungstage</span><b>{{ formatEuroCents(editPricePreview.totalCents) }}</b><small>unverbindlich, Abrechnung beim Check-out</small></p>
        <label v-if="selectedEditRoomAvailability?.wouldOverbook" class="overbooking-warning"><input v-model="editDraft.allowOverbooking" type="checkbox" /> <span><strong>Überbuchung bewusst übernehmen</strong> · Im gewählten Zeitraum fehlen Plätze.</span></label>
        <p v-if="editError" class="form-error" role="alert">{{ editError }}</p>
        <button class="primary-button" type="submit"><Pencil :size="16" /> Änderungen speichern</button>
      </form>
    </section>

    <section class="panel bookings-list">
      <header><div><h2>{{ view === 'list' ? 'Alle Aufenthalte' : 'Buchungszeitachse' }}</h2><p>{{ view === 'list' ? `${visibleBookings.length} passende Buchungen` : 'Zimmer und zusammenhängende Aufenthalte im Wochenüberblick' }}</p></div><div class="list-header-actions"><div class="booking-view-switch" aria-label="Buchungsansicht"><button :class="{ active: view === 'list' }" aria-label="Listenansicht" @click="view = 'list'"><List :size="15" /> Liste</button><button :class="{ active: view === 'calendar' }" aria-label="Zeitachsenansicht" @click="view = 'calendar'"><CalendarDays :size="15" /> Zeitachse</button></div><button class="text-button" type="button" aria-label="Buchungen als CSV exportieren" @click="exportBookings"><Download :size="15" /> Exportieren</button><label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></div></header>
      <div class="booking-filters" aria-label="Buchungsstatus">
        <button v-for="option in bookingStatusFilters" :key="option.value" :class="{ active: status === option.value }" @click="status = option.value">{{ option.label }}</button>
      </div>
      <div v-if="view === 'calendar'" class="booking-calendar">
        <div class="booking-calendar-navigation"><button class="icon-button" aria-label="Vorherige Woche" @click="changeCalendarWeek(-1)"><ChevronLeft :size="18" /></button><strong>{{ calendarLabel }}</strong><button class="icon-button" aria-label="Nächste Woche" @click="changeCalendarWeek(1)"><ChevronRight :size="18" /></button><button class="secondary-button booking-calendar-today" type="button" :disabled="calendarStart === store.businessDate.value" @click="jumpTimelineToToday">Heute</button></div>
        <div class="booking-timeline" aria-label="Buchungszeitachse">
          <div class="booking-timeline-header"><span>Zimmer</span><div><span v-for="date in calendarDates" :key="date"><b>{{ formatShortWeekday(date) }}</b>{{ formatDayAndMonth(date) }}</span></div></div>
          <section v-for="row in bookingTimeline" :key="row.id" class="booking-timeline-row" :aria-label="row.label">
            <strong>{{ row.label }}</strong>
            <div class="booking-timeline-lanes">
              <div v-for="(lane, laneIndex) in row.lanes" :key="laneIndex" class="booking-timeline-lane">
                <button v-for="bar in lane" :key="bar.booking.id" type="button" :class="bar.booking.status" :style="{ gridColumn: `${bar.startDay + 1} / span ${bar.duration}` }" :aria-label="`Buchung von ${bar.booking.customer.firstName} ${bar.booking.customer.lastName} für ${bar.booking.pet.name} öffnen`" :title="`${bar.booking.customer.firstName} ${bar.booking.customer.lastName} · ${bar.booking.pet.name}`" @click="openBookingFromTimeline(bar.booking.id)">
                  <i :style="{ background: bar.booking.pet.color }" /><span><b>{{ bar.booking.customer.firstName }} {{ bar.booking.customer.lastName }}</b><em>{{ bar.booking.pet.name }}</em></span>
                </button>
              </div>
              <p v-if="!row.lanes.length">Keine Aufenthalte</p>
            </div>
          </section>
        </div>
        <p v-if="!bookingTimeline.some((row) => row.lanes.length)" class="booking-calendar-empty">Für diesen Zeitraum passen keine Buchungen zu Suche oder Statusfilter.</p>
      </div>
      <div v-else-if="visibleBookings.length" class="booking-table">
        <article v-for="booking in pagedBookings" :id="`booking-${booking.id}`" :key="booking.id" :class="{ 'focused-booking': booking.id === focusedBookingId }">
          <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
          <div class="pet-info"><strong>{{ booking.pet.name }}</strong><span>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</span><small v-if="booking.bookingNote" class="booking-note-summary">Hinweis · {{ booking.bookingNote }}</small><small v-if="booking.checkoutPrice" class="checkout-price-summary">Abgerechnet · {{ formatEuroCents(booking.checkoutPrice.totalCents) }}</small></div>
          <div><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div><small>Ankunft</small><strong>{{ booking.arrivalDate }} · {{ booking.arrival }} Uhr</strong></div>
          <div><small>Abreise</small><strong>{{ booking.departure }}<template v-if="booking.pickupTime"> · {{ booking.pickupTime }} Uhr</template></strong></div>
          <span class="booking-status" :class="booking.status">{{ bookingStatusLabels[booking.status] }}</span>
          <div class="booking-row-actions">
            <RouterLink v-if="booking.status === 'confirmed'" class="edit-booking-button" :to="{ name: 'bookings', query: { bookingId: booking.id, edit: 'true' } }" :aria-label="`Buchung für ${booking.pet.name} bearbeiten`"><Pencil :size="16" /> Bearbeiten</RouterLink>
            <button v-if="booking.status === 'checked-in'" class="checkout-booking-button" :aria-label="`${booking.pet.name} auschecken`" @click="emit('checkOut', booking)"><LogOut :size="16" /> Auschecken</button>
            <button v-if="store.canDeleteBooking(booking.id)" class="delete-booking-button" :aria-label="`Buchung für ${booking.pet.name} löschen`" @click="bookingPendingDeletion = booking"><Trash2 :size="16" /> Löschen</button>
          </div>
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
