<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Download, List, LogOut, Pencil, Plus, Search, Trash2 } from '@lucide/vue'
import type { BookingStatus, BookingView, DepartureView } from '../domain'
import AppButton from './AppButton.vue'
import AppBookingStatus from './AppBookingStatus.vue'
import AppCustomerLink from './AppCustomerLink.vue'
import AppContainer from './AppContainer.vue'
import AppEmptyState from './AppEmptyState.vue'
import AppIconButton from './AppIconButton.vue'
import AppPageHeading from './AppPageHeading.vue'
import AppPagination from './AppPagination.vue'
import AppPetAvatar from './AppPetAvatar.vue'
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
      <header class="max-[680px]:!items-stretch max-[680px]:!flex-col"><div><h2>{{ focusedBooking ? 'Ausgewählter Aufenthalt' : (view === 'list' ? 'Alle Aufenthalte' : 'Buchungszeitachse') }}</h2><p>{{ focusedBooking ? 'Details und Aktionen für die gewählte Buchung' : (view === 'list' ? `${visibleBookings.length} passende Buchungen` : 'Zimmer und zusammenhängende Aufenthalte im Wochenüberblick') }}</p></div><div class="flex items-center justify-end gap-[13px] max-[680px]:flex-col max-[680px]:items-stretch"><AppTabs class="max-sm:w-full max-sm:justify-center"><AppTab :active="view === 'list'" aria-label="Listenansicht" @click="view = 'list'"><List :size="15" /> Liste</AppTab><AppTab :active="view === 'calendar'" aria-label="Zeitachsenansicht" :disabled="!!focusedBooking" @click="view = 'calendar'"><CalendarDays :size="15" /> Zeitachse</AppTab></AppTabs><AppButton variant="text" type="button" aria-label="Buchungen als CSV exportieren" :disabled="!!focusedBooking" @click="exportBookings"><Download :size="15" /> Exportieren</AppButton><label class="m-0 flex h-10 w-full items-center gap-2 rounded-lg border border-[var(--border)] bg-[#faf9f7] px-[11px] text-[var(--muted)] sm:w-[min(340px,45%)]" :class="{ 'pointer-events-none opacity-50': !!focusedBooking }"><Search :size="17" /><input v-model="localQuery" class="w-full border-0 bg-transparent outline-none" :disabled="!!focusedBooking" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></div></header>
      <div class="booking-filters flex gap-[7px] overflow-x-auto border-b border-[#eeeae6] px-4 py-3 sm:px-[22px] sm:py-[13px]" :class="{ 'pointer-events-none opacity-50': !!focusedBooking }" aria-label="Buchungsstatus">
        <button v-for="option in bookingStatusFilters" :key="option.value" class="shrink-0 rounded-full border border-[var(--border)] bg-white px-[11px] py-[7px] text-[11px] font-bold text-[var(--muted)]" :class="{ 'border-[#e3a27d] bg-[#fff3eb] text-[#a74613]': status === option.value }" :disabled="!!focusedBooking" @click="status = option.value">{{ option.label }}</button>
        <label class="ml-1 flex shrink-0 items-center gap-[6px] whitespace-nowrap text-[11px] font-bold text-[var(--muted)] sm:ml-auto">Am Datum <input class="h-8 rounded-[7px] border border-[var(--border)] bg-white px-[7px] text-[inherit] text-[var(--text)]" type="date" aria-label="Buchungen am Datum filtern" :value="selectedDate" :disabled="!!focusedBooking" @change="setSelectedDate" /></label>
        <button v-if="selectedDate" class="shrink-0 border-0 bg-transparent px-[2px] py-1 text-[11px] font-bold text-[var(--primary-dark)]" type="button" :disabled="!!focusedBooking" @click="clearSelectedDate">Datum löschen</button>
      </div>
      <div v-if="focusedBooking" class="booking-selection-notice flex items-start justify-between gap-3 border-b border-[#f0d7c7] bg-[#fff8f2] px-4 py-[10px] text-xs text-[#6d432c] sm:items-center sm:px-[22px]" role="status">
        <span><ChevronLeft :size="14" style="vertical-align: middle; margin-top: -2px" /> Ausgewählte Buchung: <strong>{{ focusedBooking.pet.name }}</strong> von {{ focusedBooking.customer.firstName }} {{ focusedBooking.customer.lastName }}.</span>
        <button class="shrink-0 whitespace-nowrap border-0 bg-transparent text-[11px] font-extrabold text-[var(--primary-dark)] hover:underline" type="button" @click="clearFocusedBooking">Zurück zur Übersicht</button>
      </div>
      <div v-if="view === 'calendar'" class="overflow-x-auto px-3 pb-4 pt-[14px] sm:px-[22px] sm:pb-[22px] sm:pt-[18px] [&_.booking-calendar-navigation]:sticky [&_.booking-calendar-navigation]:left-0 [&_.booking-calendar-navigation]:mb-[14px] [&_.booking-calendar-navigation]:flex [&_.booking-calendar-navigation]:items-center [&_.booking-calendar-navigation]:justify-center [&_.booking-calendar-navigation]:gap-2 sm:[&_.booking-calendar-navigation]:gap-3 [&_.booking-calendar-navigation>strong]:min-w-[130px] [&_.booking-calendar-navigation>strong]:text-center [&_.booking-calendar-navigation>strong]:font-[700_13px_Manrope] sm:[&_.booking-calendar-navigation>strong]:min-w-[190px] sm:[&_.booking-calendar-navigation>strong]:text-[15px] [&_.booking-calendar-today]:min-h-10 [&_.booking-calendar-today]:min-w-16 [&_.booking-calendar-today]:px-[9px] [&_.booking-calendar-today]:text-xs sm:[&_.booking-calendar-today]:min-w-[72px] sm:[&_.booking-calendar-today]:px-[13px]">
        <div class="booking-calendar-navigation"><AppIconButton aria-label="Vorherige Woche" @click="changeCalendarWeek(-1)"><ChevronLeft :size="18" /></AppIconButton><strong>{{ calendarLabel }}</strong><AppIconButton aria-label="Nächste Woche" @click="changeCalendarWeek(1)"><ChevronRight :size="18" /></AppIconButton><AppButton variant="secondary" class="booking-calendar-today" type="button" :disabled="calendarStart === store.businessDate.value" @click="jumpTimelineToToday">Heute</AppButton></div>
        <div class="min-w-[720px] overflow-hidden rounded-[10px] border border-[#eeeae6] sm:min-w-[790px]" aria-label="Buchungszeitachse">
          <div class="grid grid-cols-[128px_minmax(0,1fr)] border-b border-[#eeeae6] bg-[#faf9f7] sm:grid-cols-[150px_minmax(0,1fr)]"><span class="px-[9px] py-[11px] text-[11px] font-extrabold text-[var(--muted)] sm:px-3">Zimmer</span><div class="grid grid-cols-7 border-l border-[#eeeae6]"><span v-for="date in calendarDates" :key="date" class="grid gap-0.5 border-r border-[#eeeae6] px-[5px] py-2 text-center text-[10px] text-[var(--muted)]"><b class="text-[11px] text-[var(--text)]">{{ formatShortWeekday(date) }}</b>{{ formatDayAndMonth(date) }}</span></div></div>
          <section v-for="row in bookingTimeline" :key="row.id" class="grid grid-cols-[128px_minmax(0,1fr)] border-b border-[#eeeae6] last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)]" :aria-label="row.label">
            <strong class="flex items-center border-r border-[#eeeae6] bg-white px-[9px] py-[11px] text-[11px] font-extrabold text-[var(--muted)] sm:px-3">{{ row.label }}</strong>
            <div class="col-start-2 grid grid-cols-7 gap-1 bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(14.2857%_-_1px),#eeeae6_calc(14.2857%_-_1px),#eeeae6_14.2857%)] py-[6px]">
              <div v-for="(lane, laneIndex) in row.lanes" :key="laneIndex" class="col-span-full grid min-h-[37px] grid-cols-7 px-[3px] [&>article]:flex [&>article]:min-w-0 [&>article]:items-center [&>article]:gap-[5px] [&>article]:overflow-hidden [&>article]:rounded-[5px] [&>article]:bg-[#faf0d9] [&>article]:px-[6px] [&>article]:py-1 [&>article]:text-[10px] [&>article]:leading-[1.15] [&>article]:text-[#84601c] [&>article.checked-in]:bg-[#e4eff0] [&>article.checked-in]:text-[#2f5d62] [&>article.checked-out]:bg-[#eeeae6] [&>article.checked-out]:text-[#67615c] [&>article>i]:block [&>article>i]:size-[7px] [&>article>i]:shrink-0 [&>article>i]:rounded-full [&>article>span]:grid [&>article>span]:min-w-0">
                <article v-for="bar in lane" :key="bar.booking.id" :class="bar.booking.status" :style="{ gridColumn: `${bar.startDay + 1} / span ${bar.duration}` }" :title="`${bar.booking.customer.firstName} ${bar.booking.customer.lastName} · ${bar.booking.pet.name}`">
                  <i :style="{ background: bar.booking.pet.color }" />
                  <span class="grid min-w-0"><RouterLink class="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold leading-[inherit] text-inherit no-underline hover:underline" :to="{ name: 'customers', query: { customerId: bar.booking.customer.id } }">{{ bar.booking.customer.firstName }} {{ bar.booking.customer.lastName }}</RouterLink><button class="block max-w-full overflow-hidden border-0 bg-transparent p-0 text-left font-[inherit] text-[10px] font-semibold text-inherit opacity-[.82] text-ellipsis whitespace-nowrap hover:underline" type="button" :aria-label="`Buchung von ${bar.booking.customer.firstName} ${bar.booking.customer.lastName} für ${bar.booking.pet.name} öffnen`" @click="openBookingFromTimeline(bar.booking.id)">{{ bar.booking.pet.name }}</button></span>
                </article>
              </div>
              <p v-if="!row.lanes.length" class="col-span-full m-0 px-[10px] py-2 text-[11px] text-[var(--muted)]">Keine Aufenthalte</p>
            </div>
          </section>
        </div>
        <p v-if="!bookingTimeline.some((row) => row.lanes.length)" class="booking-calendar-empty">Für diesen Zeitraum passen keine Buchungen zu Suche oder Statusfilter.</p>
      </div>
      <div v-else-if="visibleBookings.length" class="booking-table">
        <article
          v-for="booking in pagedBookings"
          :id="`booking-${booking.id}`"
          :key="booking.id"
          class="grid grid-cols-[auto_minmax(140px,1.3fr)_minmax(125px,1fr)_95px_120px_auto_auto] items-center gap-[14px] border-b border-[#eeeae6] px-[22px] py-[15px] last:border-b-0 max-[900px]:grid-cols-[auto_1fr_auto] max-[680px]:px-[15px] [&>div:not(.pet-avatar)_small]:mb-1 [&>div:not(.pet-avatar)_small]:block [&>div:not(.pet-avatar)_small]:text-xs [&>div:not(.pet-avatar)_small]:text-[var(--muted)] [&>div:not(.pet-avatar)>strong]:block [&>div:not(.pet-avatar)>strong]:text-sm max-[900px]:[&>div:not(.pet-avatar):not(.pet-info):not(.booking-row-actions)]:col-start-2"
          :class="{ 'focused-booking bg-[#fff8f2] shadow-[inset_4px_0_#d97845]': booking.id === focusedBookingId }"
        >
          <AppPetAvatar :initials="booking.pet.initials" :color="booking.pet.color" />
          <div class="pet-info"><strong class="block text-sm">{{ booking.pet.name }}</strong><AppCustomerLink compact :customer-id="booking.customer.id">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</AppCustomerLink><small v-if="booking.bookingNote" class="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap !text-[#84601c]">Hinweis · {{ booking.bookingNote }}</small><small v-if="booking.checkoutPrice" class="checkout-price-summary">Abgerechnet · {{ formatEuroCents(booking.checkoutPrice.totalCents) }}</small></div>
          <div><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div><small>Ankunft</small><strong>{{ booking.arrivalDate }} · {{ booking.arrival }} Uhr</strong></div>
          <div><small>Abreise</small><strong>{{ booking.departure }}<template v-if="booking.pickupTime"> · {{ booking.pickupTime }} Uhr</template></strong></div>
          <AppBookingStatus class="max-[900px]:col-start-3 max-[900px]:row-start-1" :status="booking.status">{{ bookingStatusLabels[booking.status] }}</AppBookingStatus>
          <div class="booking-row-actions flex flex-wrap items-end justify-end gap-[10px] max-[900px]:col-start-3 max-[900px]:row-start-2 max-[900px]:flex-col">
            <RouterLink v-if="booking.status === 'confirmed'" class="inline-flex items-center gap-[5px] text-[11px] font-bold text-[var(--primary-dark)] no-underline hover:underline" :to="{ name: 'bookings', query: { bookingId: booking.id, edit: 'true' } }" :aria-label="`Buchung für ${booking.pet.name} bearbeiten`"><Pencil :size="16" /> Bearbeiten</RouterLink>
            <button v-if="booking.status === 'checked-in'" class="inline-flex items-center gap-[5px] border-0 bg-transparent text-[11px] font-bold text-[var(--primary-dark)] hover:underline" :aria-label="`${booking.pet.name} auschecken`" @click="emit('checkOut', booking)"><LogOut :size="16" /> Auschecken</button>
            <button v-if="store.canDeleteBooking(booking.id)" class="inline-flex items-center gap-[5px] border-0 bg-transparent text-[11px] font-bold text-[#a52f2f] hover:underline" :aria-label="`Buchung für ${booking.pet.name} löschen`" @click="bookingPendingDeletion = booking"><Trash2 :size="16" /> Löschen</button>
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
