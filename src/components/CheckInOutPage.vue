<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine, Check, ChevronLeft, ChevronRight, ClipboardCheck, Download, ExternalLink, History, RotateCcw, Search } from '@lucide/vue'
import type { BookingView, CheckInOutEventType, DepartureView } from '../domain'
import { addDaysToIsoDate, isValidIsoDate } from '../domain/bookingPeriod'
import { formatDayAndMonth, formatEventTimestamp, formatShortWeekday } from '../presentation/dateFormat'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { selectArrivals, selectDepartures } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'

const props = defineProps<{ query: string }>()
const emit = defineEmits<{ checkIn: [booking: BookingView]; checkOut: [departure: DepartureView] }>()
const store = usePensionStore()
const activeView = ref<'arrivals' | 'departures'>('arrivals')
const localQuery = ref('')
const selectedDate = ref(store.businessDate.value)
const historyPageSize = 5
const historyPage = ref(1)

const searchTerm = computed(() => resolveSearchTerm(localQuery.value, props.query))
const matchesSearch = (booking: BookingView) => matchesSearchTerm(searchTerm.value, [
  booking.pet.name,
  booking.pet.breed,
  booking.customer.firstName,
  booking.customer.lastName,
  booking.room.name
])
const arrivals = computed(() => selectArrivals(store.bookingViews.value, selectedDate.value).filter(matchesSearch))
const departures = computed(() => selectDepartures(store.bookingViews.value, selectedDate.value).filter(matchesSearch))
const visibleBookings = computed(() => activeView.value === 'arrivals' ? arrivals.value : departures.value)
const historyPageCount = computed(() => Math.max(1, Math.ceil(store.checkInOutHistory.value.length / historyPageSize)))
const pagedHistory = computed(() => {
  const start = (historyPage.value - 1) * historyPageSize
  return store.checkInOutHistory.value.slice(start, start + historyPageSize)
})
const formatEventTime = formatEventTimestamp
const selectedDateLabel = computed(() => `${formatShortWeekday(selectedDate.value)} · ${formatDayAndMonth(selectedDate.value)}`)

watch(historyPageCount, (pageCount) => {
  if (historyPage.value > pageCount) historyPage.value = pageCount
})

function selectHistoryPage(page: number) {
  historyPage.value = Math.min(Math.max(page, 1), historyPageCount.value)
}

function shiftSelectedDate(days: number): void {
  selectedDate.value = addDaysToIsoDate(selectedDate.value, days)
}

function setSelectedDate(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (isValidIsoDate(value)) selectedDate.value = value
}

function eventLabel(type: CheckInOutEventType): string {
  if (type === 'check-in') return 'Eingecheckt'
  if (type === 'check-in-reverted') return 'Check-in zurückgenommen'
  return 'Ausgecheckt'
}

function exportOperations() {
  downloadCsv({
    fileName: activeView.value === 'arrivals' ? 'anreisen.csv' : 'abreisen.csv',
    columns: ['Kund:in', 'Tier', 'Rasse', 'Zimmer', activeView.value === 'arrivals' ? 'Ankunftszeit' : 'Abholung'],
    rows: visibleBookings.value.map((booking) => [
      `${booking.customer.firstName} ${booking.customer.lastName}`, booking.pet.name, booking.pet.breed,
      booking.room.name, activeView.value === 'arrivals' ? booking.arrival : selectedDate.value
    ])
  })
}

function exportHistory() {
  downloadCsv({
    fileName: 'check-in-out-verlauf.csv',
    columns: ['Zeitpunkt', 'Vorgang', 'Kund:in', 'Tier', 'Zimmer'],
    rows: store.checkInOutHistory.value.map((event) => [
      formatEventTime(event.occurredAt), eventLabel(event.type),
      `${event.booking.customer.firstName} ${event.booking.customer.lastName}`,
      event.booking.pet.name, event.booking.room.name
    ])
  })
}
</script>

<template>
  <main class="operations-page">
    <div class="page-heading">
      <div><p class="eyebrow">Tagesgeschäft</p><h1>Check-in/out</h1><p>Alle anstehenden Anreisen und Abreisen zentral bearbeiten.</p></div>
      <span class="page-count"><ClipboardCheck :size="17" /> {{ arrivals.length + departures.length }} offen</span>
    </div>
    <div class="operations-date-nav" role="group" aria-label="Vorgangsdatum">
      <button type="button" aria-label="Einen Tag zurück" @click="shiftSelectedDate(-1)"><ChevronLeft :size="16" /></button>
      <label class="operations-date-input"><span>Datum</span><input type="date" aria-label="Datum für Check-in und Check-out" :value="selectedDate" @change="setSelectedDate" /></label>
      <button type="button" aria-label="Einen Tag vor" @click="shiftSelectedDate(1)"><ChevronRight :size="16" /></button>
      <button type="button" class="operations-today" :disabled="selectedDate === store.businessDate.value" @click="selectedDate = store.businessDate.value">Heute</button>
      <span class="operations-date-label">{{ selectedDateLabel }}</span>
    </div>
    <section class="operations-summary" aria-label="Offene Vorgänge">
      <button :class="{ active: activeView === 'arrivals' }" @click="activeView = 'arrivals'"><span class="metric-icon orange"><ArrowDownToLine /></span><span><small>Anreisen</small><strong>{{ arrivals.length }}</strong><em>noch einzuchecken</em></span></button>
      <button :class="{ active: activeView === 'departures' }" @click="activeView = 'departures'"><span class="metric-icon teal"><ArrowUpFromLine /></span><span><small>Abreisen</small><strong>{{ departures.length }}</strong><em>noch auszuchecken</em></span></button>
    </section>
    <section class="panel operations-list">
      <header><div><h2>{{ activeView === 'arrivals' ? 'Anstehende Anreisen' : 'Anstehende Abreisen' }}</h2><p>{{ visibleBookings.length }} passende Vorgänge</p></div><div class="list-header-actions"><button class="text-button" type="button" aria-label="Aktuelle Vorgänge als CSV exportieren" @click="exportOperations"><Download :size="15" /> Exportieren</button><label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></div></header>
      <div v-if="visibleBookings.length" class="operation-rows">
        <article v-for="booking in visibleBookings" :key="booking.id" class="operation-row">
          <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
          <div class="pet-info"><strong>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</strong><span>{{ booking.pet.name }} · {{ booking.pet.breed }}</span></div>
          <div class="operation-room"><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div class="operation-time"><small>{{ activeView === 'arrivals' ? 'Ankunft' : 'Abholung' }}</small><strong>{{ activeView === 'arrivals' ? `${booking.arrival} Uhr` : selectedDateLabel }}</strong></div>
          <button v-if="activeView === 'arrivals'" class="primary-button" @click="emit('checkIn', booking)"><ArrowDownToLine :size="16" /> Einchecken</button>
          <button v-else class="primary-button" @click="emit('checkOut', booking as DepartureView)"><ArrowUpFromLine :size="16" /> Auschecken</button>
        </article>
      </div>
      <div v-else class="empty-state"><span><Search v-if="searchTerm" /><Check v-else /></span><strong>{{ searchTerm ? 'Keine passenden Vorgänge.' : 'Alles erledigt.' }}</strong><p>{{ searchTerm ? 'Versuche einen anderen Suchbegriff.' : 'In diesem Bereich sind keine Vorgänge mehr offen.' }}</p></div>
    </section>
    <section class="panel operations-history">
      <header><div><h2>Letzte Vorgänge</h2><p>Zuletzt ein- und ausgecheckte Tiere · {{ store.checkInOutHistory.value.length }} insgesamt</p></div><div class="list-header-actions"><button class="text-button" type="button" aria-label="Check-in-out-Verlauf als CSV exportieren" @click="exportHistory"><Download :size="15" /> Exportieren</button><History :size="20" /></div></header>
      <div class="history-rows">
        <article v-for="event in pagedHistory" :key="event.id">
          <span class="history-event-icon" :class="event.type"><ArrowDownToLine v-if="event.type === 'check-in'" :size="17" /><RotateCcw v-else-if="event.type === 'check-in-reverted'" :size="17" /><ArrowUpFromLine v-else :size="17" /></span>
          <div class="pet-info"><strong>{{ event.booking.customer.firstName }} {{ event.booking.customer.lastName }}</strong><span>{{ event.booking.pet.name }} · {{ event.booking.room.name }}</span></div>
          <div class="history-event-time"><strong>{{ eventLabel(event.type) }}</strong><span>{{ formatEventTime(event.occurredAt) }} Uhr</span></div>
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
