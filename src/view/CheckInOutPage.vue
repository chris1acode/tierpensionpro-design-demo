<script setup lang="ts">
import AppPanel from '../components/AppPanel.vue'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine, Check, ChevronLeft, ChevronRight, DoorOpen, Download, ExternalLink, History, RotateCcw, Search } from '@lucide/vue'
import type { BookingView, DepartureView } from '../domain'
import { addDaysToIsoDate, isValidIsoDate } from '../domain/bookingPeriod'
import { usePagination } from '../composables/usePagination'
import { formatDayAndMonth, formatEventTimestamp, formatShortWeekday } from '../presentation/dateFormat'
import { checkInOutEventLabels } from '../presentation/checkInOutEvent'
import AppButton from '../components/AppButton.vue'
import AppCustomerLink from '../components/AppCustomerLink.vue'
import AppContainer from '../components/AppContainer.vue'
import AppEmptyState from '../components/AppEmptyState.vue'
import AppMetricIcon from '../components/AppMetricIcon.vue'
import AppPageHeading from '../components/AppPageHeading.vue'
import AppPagination from '../components/AppPagination.vue'
import AppPetAvatar from '../components/AppPetAvatar.vue'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { selectArrivals, selectCheckedIn, selectDepartures } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'
import RoomChangeModal from '../components/RoomChangeModal.vue'

const emit = defineEmits<{ checkIn: [booking: BookingView]; checkOut: [departure: DepartureView] }>()
const historyEventIconClasses: Record<string, string> = {
  'check-in': 'bg-[#e4eff0] text-[#2f5d62]',
  'check-in-reverted': 'bg-[#fff1e8] text-[#a74613]',
  'check-out': 'bg-[#eeeae6] text-[#67615c]',
}
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
  booking.customer.firstName,
  booking.customer.lastName,
  booking.room.name
])
const arrivals = computed(() => selectArrivals(store.bookingViews.value, selectedDate.value).filter(matchesSearch))
const departures = computed(() => selectDepartures(store.bookingViews.value, selectedDate.value).filter(matchesSearch))
const checkedIn = computed(() => selectCheckedIn(store.bookingViews.value).filter(matchesSearch))
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
    columns: ['Kunde', 'Tier', 'Zimmer', activeView.value === 'arrivals' ? 'Ankunftszeit' : activeView.value === 'departures' ? 'Abholung' : 'Geplante Abreise'],
    rows: visibleBookings.value.map((booking) => [
      `${booking.customer.firstName} ${booking.customer.lastName}`, booking.pet.name,
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
  <AppContainer class="operations-page">
    <AppPageHeading eyebrow="Tagesgeschäft" title="Check-in/out" description="Eingecheckte Tiere sowie anstehende Anreisen und Abreisen zentral bearbeiten." />
    <div
      class="-mt-1 mb-[18px] flex flex-wrap items-center gap-[10px]"
      :class="{ 'pointer-events-none opacity-45': activeView === 'checked-in' }"
      role="group" aria-label="Vorgangsdatum"
    >
      <button type="button" class="grid h-10 w-10 place-items-center rounded-lg border border-app-border bg-white text-app-text disabled:cursor-default disabled:opacity-45" aria-label="Einen Tag zurück" :disabled="activeView === 'checked-in'" @click="shiftSelectedDate(-1)"><ChevronLeft :size="16" /></button>
      <label class="flex items-center gap-2 text-[11px] font-bold text-app-muted max-[680px]:flex-1"><span>Datum</span><input type="date" class="h-10 rounded-lg border border-app-border bg-white px-[10px] text-app-text [font:inherit] disabled:cursor-not-allowed max-[680px]:min-w-0 max-[680px]:flex-1" aria-label="Datum für Check-in und Check-out" :value="selectedDate" :disabled="activeView === 'checked-in'" @change="setSelectedDate" /></label>
      <button type="button" class="grid h-10 w-10 place-items-center rounded-lg border border-app-border bg-white text-app-text disabled:cursor-default disabled:opacity-45" aria-label="Einen Tag vor" :disabled="activeView === 'checked-in'" @click="shiftSelectedDate(1)"><ChevronRight :size="16" /></button>
      <button type="button" class="grid h-10 w-auto min-w-[72px] place-items-center rounded-lg border border-app-border bg-white px-[14px] text-[13px] font-bold text-app-text disabled:cursor-default disabled:opacity-45" :disabled="selectedDate === store.businessDate.value || activeView === 'checked-in'" @click="selectedDate = store.businessDate.value">Heute</button>
      <span class="text-xs font-bold text-app-muted max-[680px]:w-full">{{ selectedDateLabel }}</span>
    </div>
    <section class="mb-[22px] grid grid-cols-3 gap-4 max-[680px]:grid-cols-1" aria-label="Offene Vorgänge">
      <button
        class="flex items-center gap-[14px] rounded-xl border border-app-border bg-white p-[18px] text-left text-app-text hover:border-[#e3a27d] hover:shadow-[0_3px_12px_rgba(90,56,36,.08)]"
        :class="{ 'border-[#e3a27d] shadow-[0_3px_12px_rgba(90,56,36,.08)]': activeView === 'checked-in' }"
        :aria-pressed="activeView === 'checked-in'" @click="activeView = 'checked-in'"
      ><AppMetricIcon variant="rose"><Check /></AppMetricIcon><span class="grid flex-1 grid-cols-[1fr_auto] items-center"><small class="font-bold text-app-muted">Jetzt eingecheckt</small><strong class="col-start-2 row-start-1 row-span-2 text-[25px] font-bold [font-family:'Manrope',sans-serif]">{{ checkedIn.length }}</strong><em class="mt-[3px] text-[11px] not-italic text-app-muted">jederzeit auscheckbar</em></span></button>
      <button
        class="flex items-center gap-[14px] rounded-xl border border-app-border bg-white p-[18px] text-left text-app-text hover:border-[#e3a27d] hover:shadow-[0_3px_12px_rgba(90,56,36,.08)]"
        :class="{ 'border-[#e3a27d] shadow-[0_3px_12px_rgba(90,56,36,.08)]': activeView === 'arrivals' }"
        :aria-pressed="activeView === 'arrivals'" @click="activeView = 'arrivals'"
      ><AppMetricIcon variant="orange"><ArrowDownToLine /></AppMetricIcon><span class="grid flex-1 grid-cols-[1fr_auto] items-center"><small class="font-bold text-app-muted">Geplante Anreisen</small><strong class="col-start-2 row-start-1 row-span-2 text-[25px] font-bold [font-family:'Manrope',sans-serif]">{{ arrivals.length }}</strong><em class="mt-[3px] text-[11px] not-italic text-app-muted">noch einzuchecken</em></span></button>
      <button
        class="flex items-center gap-[14px] rounded-xl border border-app-border bg-white p-[18px] text-left text-app-text hover:border-[#e3a27d] hover:shadow-[0_3px_12px_rgba(90,56,36,.08)]"
        :class="{ 'border-[#e3a27d] shadow-[0_3px_12px_rgba(90,56,36,.08)]': activeView === 'departures' }"
        :aria-pressed="activeView === 'departures'" @click="activeView = 'departures'"
      ><AppMetricIcon><ArrowUpFromLine /></AppMetricIcon><span class="grid flex-1 grid-cols-[1fr_auto] items-center"><small class="font-bold text-app-muted">Geplante Abreisen</small><strong class="col-start-2 row-start-1 row-span-2 text-[25px] font-bold [font-family:'Manrope',sans-serif]">{{ departures.length }}</strong><em class="mt-[3px] text-[11px] not-italic text-app-muted">heute auszuchecken</em></span></button>
    </section>
    <AppPanel >
      <header class="!grid grid-cols-[minmax(0,1fr)_minmax(340px,460px)_minmax(0,1fr)] items-center gap-[18px] border-b border-b-[#e8e4df] px-[22px] py-[21px] max-[760px]:grid-cols-1 max-[760px]:items-stretch"><div><h2>{{ activeViewTitle }}</h2><p>{{ activeViewDescription }}</p></div><label class="flex h-12 w-full items-center gap-2 rounded-[10px] border border-app-border bg-[#faf9f7] px-[14px] text-[15px] text-app-muted"><Search :size="19" /><input v-model="localQuery" class="w-full border-0 bg-transparent text-[15px] outline-none" aria-label="Aktuelle Vorgänge durchsuchen" placeholder="Tier, Kunde oder Zimmer suchen …" /></label><div class="flex items-center justify-end gap-[13px] max-[760px]:justify-start max-[680px]:flex-col max-[680px]:items-stretch"><AppButton variant="text" type="button" aria-label="Aktuelle Vorgänge als CSV exportieren" @click="exportOperations"><Download :size="15" /> Exportieren</AppButton></div></header>
      <div v-if="visibleBookings.length">
        <article v-for="booking in visibleBookings" :key="booking.id" class="grid grid-cols-[auto_minmax(190px,1.4fr)_minmax(130px,1fr)_105px_auto] items-center gap-4 border-b border-b-[#eeeae6] px-[22px] py-4 last:border-b-0 max-[680px]:grid-cols-[auto_1fr] max-[680px]:p-[15px]">
          <AppPetAvatar :initials="booking.pet.initials" :color="booking.pet.color" />
          <div><AppCustomerLink compact :customer-id="booking.customer.id">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</AppCustomerLink><span class="mt-[3px] block text-[11px] text-app-muted">{{ booking.pet.name }}</span></div>
          <div class="max-[680px]:col-start-2"><small class="mb-1 block text-xs text-app-muted">Zimmer</small><strong class="block text-sm">{{ booking.room.name }}</strong></div>
          <div class="max-[680px]:col-start-2"><small class="mb-1 block text-xs text-app-muted">{{ activeView === 'arrivals' ? 'Ankunft' : activeView === 'departures' ? 'Abholung' : 'Geplante Abreise' }}</small><strong class="block text-sm">{{ activeView === 'arrivals' ? `${booking.arrival} Uhr` : activeView === 'departures' ? (booking.pickupTime ? `${booking.pickupTime} Uhr` : 'Nicht vereinbart') : formatDayAndMonth(booking.departure) }}</strong></div>
          <div v-if="activeView === 'arrivals'" class="flex items-center justify-end gap-3 max-[680px]:col-start-2 max-[680px]:flex-col max-[680px]:items-start max-[680px]:justify-start max-[680px]:gap-2">
            <AppButton variant="text" :to="{ name: 'bookings', query: { bookingId: booking.id, edit: 'true' } }">Buchung bearbeiten <ExternalLink :size="14" /></AppButton>
            <AppButton variant="link" @click="emit('checkIn', booking)"><ArrowDownToLine :size="16" /> Einchecken</AppButton>
          </div>
          <div v-else class="flex items-center justify-end gap-3 max-[680px]:col-start-2 max-[680px]:flex-col max-[680px]:items-start max-[680px]:justify-start max-[680px]:gap-2">
            <AppButton variant="text" type="button" @click="bookingToMove = booking"><DoorOpen :size="14" /> Zimmer wechseln</AppButton>
            <AppButton variant="link" @click="emit('checkOut', booking as DepartureView)"><ArrowUpFromLine :size="16" /> Auschecken</AppButton>
          </div>
        </article>
      </div>
      <AppEmptyState v-else>
        <template #icon><Search v-if="searchTerm" /><Check v-else /></template>
        <template #title>{{ searchTerm ? 'Keine passenden Vorgänge.' : activeView === 'checked-in' ? 'Keine Tiere eingecheckt.' : 'Alles erledigt.' }}</template>
        <template #description>{{ searchTerm ? 'Versuche einen anderen Suchbegriff.' : activeView === 'checked-in' ? 'Aktuell befindet sich kein Tier in der Pension.' : 'In diesem Bereich sind keine Vorgänge mehr offen.' }}</template>
      </AppEmptyState>
    </AppPanel>
    <RoomChangeModal v-if="bookingToMove" :booking="bookingToMove" @close="bookingToMove = null" />
    <AppPanel class="mt-[22px]">
      <header><div><h2>Letzte Vorgänge</h2><p>Zuletzt ein- und ausgecheckte Tiere · {{ store.checkInOutHistory.value.length }} insgesamt</p></div><div class="flex items-center justify-end gap-[13px] max-[680px]:flex-col max-[680px]:items-stretch"><AppButton variant="text" type="button" aria-label="Check-in-out-Verlauf als CSV exportieren" @click="exportHistory"><Download :size="15" /> Exportieren</AppButton><History :size="20" /></div></header>
      <div>
        <article v-for="event in pagedHistory" :key="event.id" class="grid grid-cols-[auto_minmax(150px,1fr)_minmax(170px,.7fr)_auto_auto] items-center gap-[14px] border-b border-b-[#eeeae6] px-[22px] py-[14px] last:border-b-0 max-sm:grid-cols-[auto_1fr] max-sm:px-4">
          <span class="grid h-[35px] w-[35px] place-items-center rounded-[9px]" :class="historyEventIconClasses[event.type]"><ArrowDownToLine v-if="event.type === 'check-in'" :size="17" /><RotateCcw v-else-if="event.type === 'check-in-reverted'" :size="17" /><ArrowUpFromLine v-else :size="17" /></span>
          <div><AppCustomerLink compact :customer-id="event.booking.customer.id">{{ event.booking.customer.firstName }} {{ event.booking.customer.lastName }}</AppCustomerLink><span class="mt-[3px] block text-[11px] text-app-muted">{{ event.booking.pet.name }} · {{ event.booking.room.name }}</span></div>
          <div class="max-sm:col-start-2"><strong class="block text-[11px]">{{ checkInOutEventLabels[event.type] }}</strong><span class="mt-[3px] block text-[11px] text-app-muted">{{ formatEventTime(event.occurredAt) }} Uhr</span></div>
          <AppButton v-if="event.type === 'check-in' && store.canUndoCheckIn(event.bookingId)" variant="text" class="text-[11px] text-primary-dark max-sm:col-start-2 max-sm:justify-self-start" type="button" @click="store.undoCheckIn(event.bookingId)"><RotateCcw :size="14" /> Rückgängig</AppButton>
          <AppButton variant="text" class="max-sm:col-start-2 max-sm:justify-self-start" :to="{ name: 'bookings', query: { bookingId: event.bookingId } }">Zur Buchung <ExternalLink :size="14" /></AppButton>
        </article>
      </div>
      <AppPagination
        :current-page="historyPage"
        :page-count="historyPageCount"
        ariaLabel="Seiten im Check-in-out-Verlauf"
        @select="selectHistoryPage"
      >
        <template #prev><ArrowLeft :size="15" /></template>
        <template #next><ArrowRight :size="15" /></template>
      </AppPagination>
    </AppPanel>
  </AppContainer>
</template>
