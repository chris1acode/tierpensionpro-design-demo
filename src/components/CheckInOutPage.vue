<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine, Check, ChevronLeft, ChevronRight, ClipboardCheck, DoorOpen, Download, ExternalLink, History, RotateCcw, Search } from '@lucide/vue'
import type { BookingView, DepartureView } from '../domain'
import { addDaysToIsoDate, isValidIsoDate } from '../domain/bookingPeriod'
import { usePagination } from '../composables/usePagination'
import { formatDayAndMonth, formatEventTimestamp, formatShortWeekday } from '../presentation/dateFormat'
import { checkInOutEventLabels } from '../presentation/checkInOutEvent'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { selectArrivals, selectCheckedIn, selectDepartures } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'
import RoomChangeModal from './RoomChangeModal.vue'

const emit = defineEmits<{ checkIn: [booking: BookingView]; checkOut: [departure: DepartureView] }>()
const store = usePensionStore()
const route = useRoute()
type OperationsView = 'arrivals' | 'departures' | 'checked-in'
const activeView = ref<OperationsView>('checked-in')
const localQuery = ref('')
const selectedDate = ref(store.businessDate.value)
const historyPageSize = 5
const bookingToMove = ref<BookingView | null>(null)

const searchTerm = computed(() => resolveSearchTerm(localQuery.value))
const matchesSearch = (booking: BookingView) => matchesSearchTerm(searchTerm.value, [
  booking.pet.name,
  booking.pet.breed,
  booking.customer.firstName,
  booking.customer.lastName,
  booking.room.name
])
const arrivals = computed(() => selectArrivals(store.bookingViews.value, selectedDate.value).filter(matchesSearch))
const departures = computed(() => selectDepartures(store.bookingViews.value, selectedDate.value).filter(matchesSearch))
const checkedIn = computed(() => selectCheckedIn(store.bookingViews.value).filter(matchesSearch))
const openTaskCount = computed(() => arrivals.value.length + departures.value.length)
const visibleBookings = computed(() => {
  if (activeView.value === 'arrivals') return arrivals.value
  if (activeView.value === 'departures') return departures.value
  return checkedIn.value
})
const { currentPage: historyPage, pageCount: historyPageCount, pagedItems: pagedHistory, selectPage: selectHistoryPage } = usePagination(store.checkInOutHistory, historyPageSize)
const formatEventTime = formatEventTimestamp
const selectedDateLabel = computed(() => `${formatShortWeekday(selectedDate.value)} · ${formatDayAndMonth(selectedDate.value)}`)
const activeViewTitle = computed(() => {
  if (activeView.value === 'arrivals') return 'Geplante Anreisen'
  if (activeView.value === 'departures') return 'Geplante Abreisen'
  return 'Jetzt eingecheckt'
})
const activeViewDescription = computed(() => activeView.value === 'checked-in'
  ? 'Tiere, die aktuell in der Pension sind'
  : `${visibleBookings.value.length} passende Vorgänge`)

watch(() => route.query.view, (view) => {
  activeView.value = view === 'departures' || view === 'arrivals' ? view : 'checked-in'
}, { immediate: true })

function shiftSelectedDate(days: number): void {
  selectedDate.value = addDaysToIsoDate(selectedDate.value, days)
}

function setSelectedDate(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (isValidIsoDate(value)) selectedDate.value = value
}

function exportOperations() {
  downloadCsv({
    fileName: activeView.value === 'arrivals' ? 'anreisen.csv' : activeView.value === 'departures' ? 'abreisen.csv' : 'eingecheckte-tiere.csv',
    columns: ['Kunde', 'Tier', 'Rasse', 'Zimmer', activeView.value === 'arrivals' ? 'Ankunftszeit' : activeView.value === 'departures' ? 'Abholung' : 'Geplante Abreise'],
    rows: visibleBookings.value.map((booking) => [
      `${booking.customer.firstName} ${booking.customer.lastName}`, booking.pet.name, booking.pet.breed,
      booking.room.name, activeView.value === 'arrivals' ? booking.arrival : activeView.value === 'departures' ? (booking.pickupTime || 'Nicht vereinbart') : booking.departure
    ])
  })
}

function exportHistory() {
  downloadCsv({
    fileName: 'check-in-out-verlauf.csv',
    columns: ['Zeitpunkt', 'Vorgang', 'Kunde', 'Tier', 'Zimmer'],
    rows: store.checkInOutHistory.value.map((event) => [
      formatEventTime(event.occurredAt), checkInOutEventLabels[event.type],
      `${event.booking.customer.firstName} ${event.booking.customer.lastName}`,
      event.booking.pet.name, event.booking.room.name
    ])
  })
}
</script>

<template>
  <main class="operations-page">
    <div class="page-heading">
      <div><p class="eyebrow">Tagesgeschäft</p><h1>Check-in/out</h1><p>Eingecheckte Tiere sowie anstehende Anreisen und Abreisen zentral bearbeiten.</p></div>
      <span class="page-count"><ClipboardCheck :size="17" /> {{ openTaskCount }} offen</span>
    </div>
    <div class="operations-date-nav" :class="{ disabled: activeView === 'checked-in' }" role="group" aria-label="Vorgangsdatum">
      <button type="button" aria-label="Einen Tag zurück" :disabled="activeView === 'checked-in'" @click="shiftSelectedDate(-1)"><ChevronLeft :size="16" /></button>
      <label class="operations-date-input"><span>Datum</span><input type="date" aria-label="Datum für Check-in und Check-out" :value="selectedDate" :disabled="activeView === 'checked-in'" @change="setSelectedDate" /></label>
      <button type="button" aria-label="Einen Tag vor" :disabled="activeView === 'checked-in'" @click="shiftSelectedDate(1)"><ChevronRight :size="16" /></button>
      <button type="button" class="operations-today" :disabled="selectedDate === store.businessDate.value || activeView === 'checked-in'" @click="selectedDate = store.businessDate.value">Heute</button>
      <span class="operations-date-label">{{ selectedDateLabel }}</span>
    </div>
    <section class="operations-summary" aria-label="Offene Vorgänge">
      <button :class="{ active: activeView === 'checked-in' }" :aria-pressed="activeView === 'checked-in'" @click="activeView = 'checked-in'"><span class="metric-icon rose"><Check /></span><span><small>Jetzt eingecheckt</small><strong>{{ checkedIn.length }}</strong><em>jederzeit auscheckbar</em></span></button>
      <button :class="{ active: activeView === 'arrivals' }" :aria-pressed="activeView === 'arrivals'" @click="activeView = 'arrivals'"><span class="metric-icon orange"><ArrowDownToLine /></span><span><small>Geplante Anreisen</small><strong>{{ arrivals.length }}</strong><em>noch einzuchecken</em></span></button>
      <button :class="{ active: activeView === 'departures' }" :aria-pressed="activeView === 'departures'" @click="activeView = 'departures'"><span class="metric-icon teal"><ArrowUpFromLine /></span><span><small>Geplante Abreisen</small><strong>{{ departures.length }}</strong><em>heute auszuchecken</em></span></button>
    </section>
    <section class="panel operations-list">
      <header><div><h2>{{ activeViewTitle }}</h2><p>{{ activeViewDescription }}</p></div><div class="list-header-actions"><button class="text-button" type="button" aria-label="Aktuelle Vorgänge als CSV exportieren" @click="exportOperations"><Download :size="15" /> Exportieren</button><label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></div></header>
      <div v-if="visibleBookings.length" class="operation-rows">
        <article v-for="booking in visibleBookings" :key="booking.id" class="operation-row">
          <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
          <div class="pet-info"><strong>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</strong><span>{{ booking.pet.name }} · {{ booking.pet.breed }}</span></div>
          <div class="operation-room"><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div class="operation-time"><small>{{ activeView === 'arrivals' ? 'Ankunft' : activeView === 'departures' ? 'Abholung' : 'Geplante Abreise' }}</small><strong>{{ activeView === 'arrivals' ? `${booking.arrival} Uhr` : activeView === 'departures' ? (booking.pickupTime ? `${booking.pickupTime} Uhr` : 'Nicht vereinbart') : formatDayAndMonth(booking.departure) }}</strong></div>
          <div v-if="activeView === 'arrivals'" class="operation-actions">
            <RouterLink class="text-button" :to="{ name: 'bookings', query: { bookingId: booking.id, edit: 'true' } }">Buchung bearbeiten <ExternalLink :size="14" /></RouterLink>
            <button class="link-button" @click="emit('checkIn', booking)"><ArrowDownToLine :size="16" /> Einchecken</button>
          </div>
          <div v-else class="operation-actions">
            <button class="text-button" type="button" @click="bookingToMove = booking"><DoorOpen :size="14" /> Zimmer wechseln</button>
            <button class="link-button" @click="emit('checkOut', booking as DepartureView)"><ArrowUpFromLine :size="16" /> Auschecken</button>
          </div>
        </article>
      </div>
      <div v-else class="empty-state"><span><Search v-if="searchTerm" /><Check v-else /></span><strong>{{ searchTerm ? 'Keine passenden Vorgänge.' : activeView === 'checked-in' ? 'Keine Tiere eingecheckt.' : 'Alles erledigt.' }}</strong><p>{{ searchTerm ? 'Versuche einen anderen Suchbegriff.' : activeView === 'checked-in' ? 'Aktuell befindet sich kein Tier in der Pension.' : 'In diesem Bereich sind keine Vorgänge mehr offen.' }}</p></div>
    </section>
    <RoomChangeModal v-if="bookingToMove" :booking="bookingToMove" @close="bookingToMove = null" />
    <section class="panel operations-history">
      <header><div><h2>Letzte Vorgänge</h2><p>Zuletzt ein- und ausgecheckte Tiere · {{ store.checkInOutHistory.value.length }} insgesamt</p></div><div class="list-header-actions"><button class="text-button" type="button" aria-label="Check-in-out-Verlauf als CSV exportieren" @click="exportHistory"><Download :size="15" /> Exportieren</button><History :size="20" /></div></header>
      <div class="history-rows">
        <article v-for="event in pagedHistory" :key="event.id">
          <span class="history-event-icon" :class="event.type"><ArrowDownToLine v-if="event.type === 'check-in'" :size="17" /><RotateCcw v-else-if="event.type === 'check-in-reverted'" :size="17" /><ArrowUpFromLine v-else :size="17" /></span>
          <div class="pet-info"><strong>{{ event.booking.customer.firstName }} {{ event.booking.customer.lastName }}</strong><span>{{ event.booking.pet.name }} · {{ event.booking.room.name }}</span></div>
          <div class="history-event-time"><strong>{{ checkInOutEventLabels[event.type] }}</strong><span>{{ formatEventTime(event.occurredAt) }} Uhr</span></div>
          <button v-if="event.type === 'check-in' && store.canUndoCheckIn(event.bookingId)" class="text-button history-undo" type="button" @click="store.undoCheckIn(event.bookingId)"><RotateCcw :size="14" /> Rückgängig</button>
          <RouterLink class="text-button" :to="{ name: 'bookings', query: { bookingId: event.bookingId } }">Zur Buchung <ExternalLink :size="14" /></RouterLink>
        </article>
      </div>
      <nav v-if="historyPageCount > 1" class="pagination history-pagination" aria-label="Seiten im Check-in-out-Verlauf">
        <button :disabled="historyPage === 1" aria-label="Vorherige Seite" @click="selectHistoryPage(historyPage - 1)"><ArrowLeft :size="15" /></button>
        <span>Seite {{ historyPage }} von {{ historyPageCount }}</span>
        <button :disabled="historyPage === historyPageCount" aria-label="Nächste Seite" @click="selectHistoryPage(historyPage + 1)"><ArrowRight :size="15" /></button>
      </nav>
    </section>
  </main>
</template>
