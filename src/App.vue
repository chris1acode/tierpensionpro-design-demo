<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowRight, CalendarDays, Check, Dog, LogOut, Menu, PawPrint, Search, X
} from '@lucide/vue'
import AccountSettingsPage from './components/AccountSettingsPage.vue'
import CheckInModal from './components/CheckInModal.vue'
import CheckInOutPage from './components/CheckInOutPage.vue'
import BookingsPage from './components/BookingsPage.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import CustomersPage from './components/CustomersPage.vue'
import DemoDataControl from './components/DemoDataControl.vue'
import OccupancyPage from './components/OccupancyPage.vue'
import RequestsPage from './components/RequestsPage.vue'
import RoomOccupancyModal from './components/RoomOccupancyModal.vue'
import SettingsPage from './components/SettingsPage.vue'
import ToastRegion from './components/ToastRegion.vue'
import type { BookingView, DepartureView } from './domain'
import { accountInitials } from './domain/account'
import { calculateStayPrice } from './domain/stayPrice'
import { navigationItems } from './navigation'
import { matchesSearchTerm, resolveSearchTerm } from './shared/search'
import { usePensionStore } from './usePensionStore'

const store = usePensionStore()
const route = useRoute()
const mobileNavOpen = ref(false)
const selectedBooking = ref<BookingView | null>(null)
const selectedDeparture = ref<DepartureView | null>(null)
const scheduleView = ref<'arrivals' | 'departures'>('arrivals')
const roomDialogOpen = ref(false)
const query = ref('')
const globalSearchInput = ref<HTMLInputElement | null>(null)
const mobileNavTrigger = ref<HTMLButtonElement | null>(null)
const mobileNavClose = ref<HTMLButtonElement | null>(null)
const mobileNavigation = ref<HTMLElement | null>(null)

const currentPage = computed(() => ({
  title: String(route.meta.title ?? 'Seite nicht gefunden'),
  description: String(route.meta.description ?? '')
}))

const visibleNavigationItems = computed(() => navigationItems.filter((item) =>
  item.name !== 'requests' || store.settings.requestsEnabled))

const filteredArrivals = computed(() => {
  const term = resolveSearchTerm(query.value)
  return store.arrivals.value.filter((booking) =>
    matchesSearchTerm(term, [booking.pet.name, booking.customer.firstName, booking.customer.lastName, booking.room.name]))
})

const filteredDepartures = computed(() => {
  const term = resolveSearchTerm(query.value)
  return store.departures.value.filter((departure) =>
    matchesSearchTerm(term, [departure.pet.name, departure.customer.firstName, departure.customer.lastName, departure.room.name]))
})

const selectedDeparturePrice = computed(() => selectedDeparture.value
  ? calculateStayPrice(selectedDeparture.value, store.settings.dailyPetRates)
  : null)

function confirmCheckIn(booking: BookingView) {
  if (store.checkIn(booking.id)) selectedBooking.value = null
}

function confirmCheckout(departure: DepartureView) {
  if (store.checkOut(departure.id)) selectedDeparture.value = null
}

function focusGlobalSearch(event: KeyboardEvent) {
  if (event.key.toLocaleLowerCase('en') !== 'k' || (!event.metaKey && !event.ctrlKey)) return
  if (mobileNavOpen.value || selectedBooking.value || selectedDeparture.value || roomDialogOpen.value
    || document.querySelector('[role="dialog"][aria-modal="true"]')) return
  event.preventDefault()
  globalSearchInput.value?.focus()
}

async function openMobileNavigation() {
  mobileNavOpen.value = true
  await nextTick()
  mobileNavClose.value?.focus()
}

function closeMobileNavigation(restoreFocus = false) {
  mobileNavOpen.value = false
  if (restoreFocus) nextTick(() => mobileNavTrigger.value?.focus())
}

function closeMobileNavigationWithEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !mobileNavOpen.value) return
  event.preventDefault()
  closeMobileNavigation(true)
}

function keepFocusInMobileNavigation(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !mobileNavOpen.value || !mobileNavigation.value) return

  const focusableElements = Array.from(mobileNavigation.value.querySelectorAll<HTMLElement>(
    'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => !element.hasAttribute('hidden'))
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)
  if (!firstElement || !lastElement) return

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  } else if (!mobileNavigation.value.contains(document.activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', focusGlobalSearch)
  window.addEventListener('keydown', closeMobileNavigationWithEscape)
  window.addEventListener('keydown', keepFocusInMobileNavigation)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', focusGlobalSearch)
  window.removeEventListener('keydown', closeMobileNavigationWithEscape)
  window.removeEventListener('keydown', keepFocusInMobileNavigation)
})
</script>

<template>
  <div class="app-shell">
    <aside ref="mobileNavigation" class="sidebar" :class="{ open: mobileNavOpen }" :role="mobileNavOpen ? 'dialog' : undefined" :aria-modal="mobileNavOpen ? 'true' : undefined" aria-label="Seitennavigation">
      <RouterLink class="brand" to="/" @click="closeMobileNavigation()"><span class="brand-mark"><PawPrint :size="21" /></span><span>Tierpension <span>Pro</span></span></RouterLink>
      <button ref="mobileNavClose" class="close-nav icon-button" aria-label="Navigation schließen" @click="closeMobileNavigation(true)"><X /></button>
      <nav aria-label="Hauptnavigation">
        <RouterLink v-for="item in visibleNavigationItems" :key="item.name" :to="item.path" @click="closeMobileNavigation()">
          <component :is="item.icon" :size="19" /><span>{{ item.title }}</span>
        </RouterLink>
      </nav>
      <RouterLink class="sidebar-profile" to="/konto" aria-label="Zu den Kontoeinstellungen" @click="closeMobileNavigation()">
        <div class="avatar">{{ accountInitials(store.account) }}</div>
        <div><strong>{{ store.account.firstName }} {{ store.account.lastName }}</strong><small>{{ store.account.role === 'root' ? 'Inhaber' : 'Mitarbeiter' }}</small></div>
      </RouterLink>
    </aside>

    <div v-if="mobileNavOpen" class="scrim" @click="closeMobileNavigation(true)" />
    <section class="main-area">
      <header class="topbar">
        <button ref="mobileNavTrigger" class="menu-button icon-button" aria-label="Navigation öffnen" @click="openMobileNavigation"><Menu /></button>
        <label class="global-search"><Search :size="18" /><input ref="globalSearchInput" v-model="query" type="search" aria-label="Globale Suche" placeholder="Tiere, Kunden oder Zimmer suchen …" /><kbd>⌘ K</kbd></label>
        <DemoDataControl />
        <RouterLink class="top-avatar" to="/konto" aria-label="Zu den Kontoeinstellungen">{{ accountInitials(store.account) }}</RouterLink>
      </header>

      <main v-if="route.name === 'dashboard'">
        <div class="page-heading">
          <div><p class="eyebrow">Sonntag, 9. August</p><h1>Guten Morgen, {{ store.account.firstName }}</h1><p>Hier ist der Überblick für den heutigen Pensionstag.</p></div>
        </div>

        <section class="metrics" aria-label="Tageskennzahlen">
          <RouterLink class="metric-card" to="/check-in-out" aria-label="Anreisen heute in Check-in und Check-out öffnen"><span class="metric-icon orange"><CalendarDays /></span><div><small>Anreisen heute</small><strong>{{ store.arrivals.value.length }}</strong><p>Nächste um {{ store.arrivals.value[0]?.arrival ?? '–' }} Uhr</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
          <RouterLink class="metric-card" to="/belegung" aria-label="Tiere im Haus in der Belegung öffnen"><span class="metric-icon teal"><Dog /></span><div><small>Tiere im Haus</small><strong>{{ store.checkedIn.value.length }}<em> / {{ store.totalCapacity.value }}</em></strong><p>{{ store.occupancyRate.value }} % der Plätze belegt</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
        </section>

        <div class="dashboard-grid">
          <section class="panel arrivals-panel">
            <header><div><h2>{{ scheduleView === 'arrivals' ? 'Heutige Anreisen' : 'Heutige Abreisen' }}</h2><p>{{ scheduleView === 'arrivals' ? `${filteredArrivals.length} Tiere warten auf ihren Check-in` : `${filteredDepartures.length} Tiere sind abholbereit` }}</p></div><div class="schedule-tabs"><button :class="{ active: scheduleView === 'arrivals' }" @click="scheduleView = 'arrivals'">Anreisen</button><button :class="{ active: scheduleView === 'departures' }" @click="scheduleView = 'departures'">Abreisen</button></div></header>
            <div v-if="scheduleView === 'arrivals' && filteredArrivals.length" class="arrival-list">
              <article v-for="booking in filteredArrivals" :key="booking.id" class="arrival-row">
                <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
                <div class="pet-info"><strong>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</strong><span>{{ booking.pet.name }} · {{ booking.pet.breed }}</span></div>
                <div class="arrival-meta"><strong>{{ booking.arrival }} Uhr</strong><span>{{ booking.room.name }}</span></div>
                <span class="arrival-note-slot">
                  <span v-if="booking.pet.note" class="note-badge">Hinweis</span>
                </span>
                <button class="link-button" @click="selectedBooking = booking">Einchecken</button>
              </article>
            </div>
            <div v-else-if="scheduleView === 'departures' && filteredDepartures.length" class="arrival-list">
              <article v-for="departure in filteredDepartures" :key="departure.id" class="arrival-row departure-row">
                <div class="pet-avatar" :style="{ background: departure.pet.color }">{{ departure.pet.initials }}</div>
                <div class="pet-info"><strong>{{ departure.customer.firstName }} {{ departure.customer.lastName }}</strong><span>{{ departure.pet.name }} · {{ departure.pet.breed }}</span></div>
                <div class="arrival-meta"><strong>Abreise heute</strong><span>{{ departure.room.name }}</span></div>
                <button class="link-button" @click="selectedDeparture = departure"><LogOut :size="16" /> Auschecken</button>
              </article>
            </div>
            <div v-else class="empty-state">
              <span><Search v-if="query.trim()" /><Check v-else /></span>
              <template v-if="query.trim()">
                <strong>Keine Treffer gefunden.</strong>
                <p>Versuche einen anderen Suchbegriff.</p>
              </template>
              <template v-else>
                <strong>{{ scheduleView === 'arrivals' ? 'Alle erwarteten Tiere sind angekommen.' : 'Alle Abreisen sind abgeschlossen.' }}</strong>
                <p>{{ scheduleView === 'arrivals' ? 'Für heute steht kein weiterer Check-in an.' : 'Für heute steht kein weiterer Check-out an.' }}</p>
              </template>
            </div>
            <RouterLink class="panel-navigation" to="/check-in-out">Alle Check-ins und Check-outs <ArrowRight :size="16" /></RouterLink>
          </section>

          <aside class="panel occupancy-panel">
            <header><div><h2>Belegung</h2><p>Aktueller Stand</p></div><span class="occupancy-number">{{ store.occupancyRate.value }} %</span></header>
            <div class="progress"><span :style="{ width: `${store.occupancyRate.value}%` }" /></div>
            <div class="room-summary">
              <div v-for="summary in store.occupancyByCategory.value" :key="summary.category">
                <span class="room-icon" :class="{ cat: summary.category === 'Katzenzimmer' }"><Dog v-if="summary.category === 'Hundezimmer'" :size="19" /><template v-else>K</template></span>
                <p><strong>{{ summary.category }}</strong><small>{{ summary.occupied }} von {{ summary.capacity }} belegt</small></p><span>{{ summary.capacity }} Plätze</span>
              </div>
            </div>
            <div class="occupancy-actions">
              <RouterLink class="accent-button" to="/belegung">Belegung planen <ArrowRight :size="16" /></RouterLink>
              <button class="outline-button" @click="roomDialogOpen = true">Zimmerstatus verwalten</button>
            </div>
          </aside>
        </div>
      </main>
      <CustomersPage v-else-if="route.name === 'customers'" :query="query" />
      <CheckInOutPage v-else-if="route.name === 'check-in-out'" :query="query" @check-in="selectedBooking = $event" @check-out="selectedDeparture = $event" />
      <BookingsPage v-else-if="route.name === 'bookings'" :query="query" />
      <OccupancyPage v-else-if="route.name === 'occupancy'" />
      <RequestsPage v-else-if="route.name === 'requests'" />
      <SettingsPage v-else-if="route.name === 'settings'" />
      <AccountSettingsPage v-else-if="route.name === 'account'" />
      <main v-else class="route-page">
        <div class="route-page-card">
          <span class="route-page-icon"><PawPrint v-if="route.name === 'not-found'" /><component :is="navigationItems.find((item) => item.name === route.name)?.icon ?? CalendarDays" v-else /></span>
          <p class="eyebrow">{{ route.name === 'not-found' ? 'Fehler 404' : 'Tierpension Pro' }}</p>
          <h1>{{ currentPage.title }}</h1>
          <p>{{ currentPage.description }}</p>
          <RouterLink v-if="route.name === 'not-found'" class="primary-button" to="/">Zurück zum Dashboard</RouterLink>
          <RouterLink v-else class="secondary-button" to="/">Zum Tagesdashboard</RouterLink>
        </div>
      </main>
    </section>

    <ToastRegion :notifications="store.toastNotifications" @dismiss="store.dismissToast" />

    <CheckInModal
      v-if="selectedBooking"
      :booking="selectedBooking"
      @close="selectedBooking = null"
      @confirm="confirmCheckIn(selectedBooking)"
    />

    <CheckoutModal
      v-if="selectedDeparture"
      :departure="selectedDeparture"
      :price="selectedDeparturePrice"
      @close="selectedDeparture = null"
      @confirm="confirmCheckout(selectedDeparture)"
    />

    <RoomOccupancyModal
      v-if="roomDialogOpen"
      :rooms="store.roomViews.value"
      @close="roomDialogOpen = false"
      @change-status="store.setRoomOperationalStatus"
    />

  </div>
</template>
