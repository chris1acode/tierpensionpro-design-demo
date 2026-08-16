<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Download, List, LogOut, Pencil, Plus, Search, Trash2 } from '@lucide/vue'
import type { BookingStatus, BookingView, DepartureView } from '../domain'
import AppButton from './AppButton.vue'
import AppContainer from './AppContainer.vue'
import AppEmptyState from './AppEmptyState.vue'
import AppIconButton from './AppIconButton.vue'
import AppPageHeading from './AppPageHeading.vue'
import AppPagination from './AppPagination.vue'
import AppTab from './AppTab.vue'
import AppTabs from './AppTabs.vue'
import DeleteBookingModal from './DeleteBookingModal.vue'
import BookingFormModal from './BookingFormModal.vue'
import { bookingStatusFilters, bookingStatusLabels } from '../presentation/bookingStatus'
import { usePagination } from '../composables/usePagination'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { usePensionStore } from '../usePensionStore'
import { createBookingTimeline } from '../domain/bookingTimeline'
import { addDaysToIsoDate, buildDateRange, fromLocalIsoDate, isDateWithinStay, isValidIsoDate } from '../domain/bookingPeriod'
import { formatDayAndMonth, formatShortWeekday } from '../presentation/dateFormat'
import { formatEuroCents } from '../presentation/currencyFormat'

const route = useRoute()
const router = useRouter()
const store = usePensionStore()
const emit = defineEmits<{ checkOut: [departure: DepartureView] }>()
const localQuery = ref('')
const status = ref<BookingStatus | 'all'>('all')
const view = ref<'list' | 'calendar'>('calendar')
const calendarStart = ref(store.businessDate.value)
const calendarDays = 7
const bookingPageSize = 10
const bookingPendingDeletion = ref<BookingView | null>(null)
const bookingModalMode = ref<'create' | 'edit' | null>(null)
const bookingModalTarget = ref<BookingView | null>(null)
const bookingModalPresetCustomerId = ref('')
const searchTerm = computed(() => resolveSearchTerm(localQuery.value))
const focusedBookingId = computed(() => typeof route.query.bookingId === 'string' ? route.query.bookingId : '')
const focusedBooking = computed(() => store.bookingViews.value.find((booking) => booking.id === focusedBookingId.value) ?? null)
const selectedDate = computed(() => {
  const value = typeof route.query.date === 'string' ? route.query.date : ''
  return isValidIsoDate(value) ? value : ''
})
const shouldFocusBooking = computed(() => view.value === 'list' && Boolean(focusedBookingId.value))
const editBookingId = computed(() => route.query.edit === 'true' ? focusedBookingId.value : '')
const preselectedCustomerId = computed(() => typeof route.query.customerId === 'string' ? route.query.customerId : '')
const visibleBookings = computed(() => store.bookingViews.value
  .filter((booking) => shouldFocusBooking.value ? booking.id === focusedBookingId.value : status.value === 'all' || booking.status === status.value)
  .filter((booking) => shouldFocusBooking.value || !selectedDate.value || isDateWithinStay(selectedDate.value, booking.arrivalDate, booking.departure))
  .filter((booking) => shouldFocusBooking.value || matchesSearchTerm(searchTerm.value, [
    booking.pet.name, booking.customer.firstName, booking.customer.lastName, booking.room.name, booking.arrivalDate, booking.departure
  ]))
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
const { currentPage, pageCount, pagedItems: pagedBookings, resetPage, selectPage } = usePagination(visibleBookings, bookingPageSize)
const calendarDates = computed(() => buildDateRange(fromLocalIsoDate(calendarStart.value), calendarDays))
const calendarLabel = computed(() => `${formatDayAndMonth(calendarDates.value[0] ?? calendarStart.value)} – ${formatDayAndMonth(calendarDates.value.at(-1) ?? calendarStart.value)}`)
const bookingTimeline = computed(() => createBookingTimeline(visibleBookings.value, store.rooms, calendarStart.value, calendarDays))

watch([searchTerm, status, focusedBookingId, selectedDate], () => {
  resetPage()
})

watch(focusedBookingId, (bookingId) => {
  if (bookingId) view.value = 'list'
}, { immediate: true })

watch(selectedDate, (date) => {
  if (date) view.value = 'list'
}, { immediate: true })

watch(editBookingId, (bookingId) => {
  const booking = store.bookingViews.value.find((item) => item.id === bookingId)
  if (!booking || booking.status !== 'confirmed') return
  bookingModalTarget.value = booking
  bookingModalMode.value = 'edit'
}, { immediate: true })

watch(preselectedCustomerId, (customerId) => {
  if (!customerId || !store.customers.some((customer) => customer.id === customerId)) return
  bookingModalPresetCustomerId.value = customerId
  bookingModalMode.value = 'create'
}, { immediate: true })

function openCreateBooking() {
  bookingModalPresetCustomerId.value = ''
  bookingModalMode.value = 'create'
}

function closeBookingModal() {
  bookingModalMode.value = null
  bookingModalTarget.value = null
  bookingModalPresetCustomerId.value = ''
}

function confirmDeletion() {
  if (bookingPendingDeletion.value && store.deleteBooking(bookingPendingDeletion.value.id)) {
    bookingPendingDeletion.value = null
  }
}

function exportBookings() {
  downloadCsv({
    fileName: 'buchungen.csv',
    columns: ['Tier', 'Kunde', 'Zimmer', 'Anreise', 'Ankunftszeit', 'Abreise', 'Abholzeit', 'Hinweis', 'Status', 'Rechnungsbetrag'],
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

function setSelectedDate(event: Event) {
  const date = (event.target as HTMLInputElement).value
  void router.push({ name: 'bookings', query: date ? { date } : {} })
}

function clearSelectedDate() {
  void router.push({ name: 'bookings' })
}

function clearFocusedBooking() {
  const { bookingId: _bookingId, edit: _edit, ...remainingQuery } = route.query
  void router.push({ name: 'bookings', query: remainingQuery })
}

function openBookingFromTimeline(bookingId: string) {
  view.value = 'list'
  void router.push({ name: 'bookings', query: { bookingId } })
}

</script>

<template>
  <AppContainer class="bookings-page">
    <AppPageHeading eyebrow="Aufenthaltsplanung" title="Buchungen" description="Aufenthalte durchsuchen und neue Reservierungen verbindlich anlegen.">
      <AppButton variant="primary" class="w-full sm:w-auto" @click="openCreateBooking"><Plus :size="17" />Neue Buchung</AppButton>
    </AppPageHeading>

    <section class="panel bookings-list">
      <header><div><h2>{{ focusedBooking ? 'Ausgewählter Aufenthalt' : (view === 'list' ? 'Alle Aufenthalte' : 'Buchungszeitachse') }}</h2><p>{{ focusedBooking ? 'Details und Aktionen für die gewählte Buchung' : (view === 'list' ? `${visibleBookings.length} passende Buchungen` : 'Zimmer und zusammenhängende Aufenthalte im Wochenüberblick') }}</p></div><div class="list-header-actions"><AppTabs class="max-sm:w-full max-sm:justify-center"><AppTab :active="view === 'list'" aria-label="Listenansicht" @click="view = 'list'"><List :size="15" /> Liste</AppTab><AppTab :active="view === 'calendar'" aria-label="Zeitachsenansicht" :disabled="!!focusedBooking" @click="view = 'calendar'"><CalendarDays :size="15" /> Zeitachse</AppTab></AppTabs><AppButton variant="text" type="button" aria-label="Buchungen als CSV exportieren" :disabled="!!focusedBooking" @click="exportBookings"><Download :size="15" /> Exportieren</AppButton><label class="directory-search" :class="{ disabled: !!focusedBooking }"><Search :size="17" /><input v-model="localQuery" :disabled="!!focusedBooking" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></div></header>
      <div class="booking-filters" :class="{ disabled: !!focusedBooking }" aria-label="Buchungsstatus">
        <button v-for="option in bookingStatusFilters" :key="option.value" :class="{ active: status === option.value }" :disabled="!!focusedBooking" @click="status = option.value">{{ option.label }}</button>
        <label class="booking-date-filter">Am Datum <input type="date" aria-label="Buchungen am Datum filtern" :value="selectedDate" :disabled="!!focusedBooking" @change="setSelectedDate" /></label>
        <button v-if="selectedDate" class="booking-date-filter-clear" type="button" :disabled="!!focusedBooking" @click="clearSelectedDate">Datum löschen</button>
      </div>
      <div v-if="focusedBooking" class="booking-selection-notice" role="status">
        <span><ChevronLeft :size="14" style="vertical-align: middle; margin-top: -2px" /> Ausgewählte Buchung: <strong>{{ focusedBooking.pet.name }}</strong> von {{ focusedBooking.customer.firstName }} {{ focusedBooking.customer.lastName }}.</span>
        <button type="button" @click="clearFocusedBooking">Zurück zur Übersicht</button>
      </div>
      <div v-if="view === 'calendar'" class="booking-calendar">
        <div class="booking-calendar-navigation"><AppIconButton aria-label="Vorherige Woche" @click="changeCalendarWeek(-1)"><ChevronLeft :size="18" /></AppIconButton><strong>{{ calendarLabel }}</strong><AppIconButton aria-label="Nächste Woche" @click="changeCalendarWeek(1)"><ChevronRight :size="18" /></AppIconButton><AppButton variant="secondary" class="booking-calendar-today" type="button" :disabled="calendarStart === store.businessDate.value" @click="jumpTimelineToToday">Heute</AppButton></div>
        <div class="booking-timeline" aria-label="Buchungszeitachse">
          <div class="booking-timeline-header"><span>Zimmer</span><div><span v-for="date in calendarDates" :key="date"><b>{{ formatShortWeekday(date) }}</b>{{ formatDayAndMonth(date) }}</span></div></div>
          <section v-for="row in bookingTimeline" :key="row.id" class="booking-timeline-row" :aria-label="row.label">
            <strong>{{ row.label }}</strong>
            <div class="booking-timeline-lanes">
              <div v-for="(lane, laneIndex) in row.lanes" :key="laneIndex" class="booking-timeline-lane">
                <article v-for="bar in lane" :key="bar.booking.id" :class="bar.booking.status" :style="{ gridColumn: `${bar.startDay + 1} / span ${bar.duration}` }" :title="`${bar.booking.customer.firstName} ${bar.booking.customer.lastName} · ${bar.booking.pet.name}`">
                  <i :style="{ background: bar.booking.pet.color }" />
                  <span><RouterLink class="customer-profile-link" :to="{ name: 'customers', query: { customerId: bar.booking.customer.id } }">{{ bar.booking.customer.firstName }} {{ bar.booking.customer.lastName }}</RouterLink><button type="button" :aria-label="`Buchung von ${bar.booking.customer.firstName} ${bar.booking.customer.lastName} für ${bar.booking.pet.name} öffnen`" @click="openBookingFromTimeline(bar.booking.id)">{{ bar.booking.pet.name }}</button></span>
                </article>
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
          <div class="pet-info"><strong>{{ booking.pet.name }}</strong><RouterLink class="customer-profile-link" :to="{ name: 'customers', query: { customerId: booking.customer.id } }">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</RouterLink><small v-if="booking.bookingNote" class="booking-note-summary">Hinweis · {{ booking.bookingNote }}</small><small v-if="booking.checkoutPrice" class="checkout-price-summary">Abgerechnet · {{ formatEuroCents(booking.checkoutPrice.totalCents) }}</small></div>
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
      <AppPagination
        v-if="view === 'list'"
        :current-page="currentPage"
        :page-count="pageCount"
        ariaLabel="Seiten in der Buchungsliste"
        @select="selectPage"
      />
      <AppEmptyState v-if="view === 'list' && !visibleBookings.length">
        <template #icon><Search v-if="searchTerm" /><Check v-else /></template>
        <template #title>Keine Buchungen gefunden.</template>
        <template #description>Ändere Suche oder Statusfilter.</template>
      </AppEmptyState>
    </section>
    <DeleteBookingModal v-if="bookingPendingDeletion" :booking="bookingPendingDeletion" @close="bookingPendingDeletion = null" @confirm="confirmDeletion" />
    <BookingFormModal
      v-if="bookingModalMode"
      :mode="bookingModalMode"
      :booking="bookingModalMode === 'edit' ? bookingModalTarget ?? undefined : undefined"
      :preset-customer-id="bookingModalPresetCustomerId"
      @close="closeBookingModal"
    />
  </AppContainer>
</template>
