<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Dog, Inbox, LogOut, Menu, X
} from '@lucide/vue'
import AccountSettingsPage from './components/AccountSettingsPage.vue'
import CheckInModal from './components/CheckInModal.vue'
import CheckInOutPage from './components/CheckInOutPage.vue'
import BookingsPage from './components/BookingsPage.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import CustomersPage from './components/CustomersPage.vue'
import DemoDataControl from './components/DemoDataControl.vue'
import IntroPage from './components/IntroPage.vue'
import LogoIcon from './components/LogoIcon.vue'
import OccupancyPage from './components/OccupancyPage.vue'
import RequestsPage from './components/RequestsPage.vue'
import SettingsPage from './components/SettingsPage.vue'
import ToastRegion from './components/ToastRegion.vue'
import type { BookingView, DepartureView } from './domain'
import { accountInitials } from './domain/account'
import { formatLongWeekdayDate } from './presentation/dateFormat'
import { calculateStayPrice } from './domain/stayPrice'
import { navigationItems } from './navigation'
import { usePensionStore } from './usePensionStore'

const store = usePensionStore()
const route = useRoute()
const mobileNavOpen = ref(false)
const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const selectedBooking = ref<BookingView | null>(null)
const selectedDeparture = ref<DepartureView | null>(null)
const scheduleView = ref<'arrivals' | 'departures'>('arrivals')
const mobileNavTrigger = ref<HTMLButtonElement | null>(null)
const mobileNavClose = ref<HTMLButtonElement | null>(null)
const mobileNavigation = ref<HTMLElement | null>(null)

const currentPage = computed(() => ({
  title: String(route.meta.title ?? 'Seite nicht gefunden'),
  description: String(route.meta.description ?? '')
}))

const visibleNavigationItems = computed(() => navigationItems.filter((item) =>
  item.name !== 'requests' || store.settings.requestsEnabled))

const isSettingsRoute = computed(() => route.path.startsWith('/settings'))

const filteredArrivals = computed(() => store.arrivals.value)

const filteredDepartures = computed(() => store.departures.value)

const selectedDeparturePrice = computed(() => selectedDeparture.value
  ? calculateStayPrice(selectedDeparture.value, store.settings.dailyPetRates)
  : null)

function confirmCheckIn(booking: BookingView, allowOverbooking = false) {
  if (store.checkIn(booking.id, allowOverbooking)) selectedBooking.value = null
}

function confirmCheckout(departure: DepartureView) {
  if (store.checkOut(departure.id)) selectedDeparture.value = null
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
  )).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null)
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

watch(sidebarCollapsed, (collapsed) => {
  localStorage.setItem('sidebarCollapsed', String(collapsed))
})

onMounted(() => {
  window.addEventListener('keydown', closeMobileNavigationWithEscape)
  window.addEventListener('keydown', keepFocusInMobileNavigation)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeMobileNavigationWithEscape)
  window.removeEventListener('keydown', keepFocusInMobileNavigation)
})
</script>

<template>
  <IntroPage v-if="route.name === 'intro'" />
  <div v-else class="app-shell">
    <aside ref="mobileNavigation" class="sidebar" :class="{ open: mobileNavOpen, collapsed: sidebarCollapsed }" :role="mobileNavOpen ? 'dialog' : undefined" :aria-modal="mobileNavOpen ? 'true' : undefined" aria-label="Seitennavigation">
      <RouterLink class="brand" to="/" @click="closeMobileNavigation()">
        <span class="brand-mark">
          <LogoIcon :size="24" color="white" />
        </span>
        <span>Tierpension <span>Pro</span></span>
      </RouterLink>
      <button ref="mobileNavClose" class="close-nav icon-button" aria-label="Navigation schließen" @click="closeMobileNavigation(true)"><X /></button>
      <nav aria-label="Hauptnavigation">
        <RouterLink v-for="item in visibleNavigationItems" :key="item.name" :to="item.path" :class="{ 'router-link-exact-active': item.name === 'settings' && isSettingsRoute }" :title="sidebarCollapsed ? item.title : undefined" @click="closeMobileNavigation()">
          <component :is="item.icon" :size="19" /><span>{{ item.title }}</span><span v-if="item.name === 'requests' && store.pendingRequests.value.length" class="nav-badge" aria-hidden="true">{{ store.pendingRequests.value.length }}</span>
        </RouterLink>
      </nav>
      <RouterLink class="sidebar-profile" to="/account" aria-label="Zu den Kontoeinstellungen" :title="sidebarCollapsed ? 'Kontoeinstellungen' : undefined" @click="closeMobileNavigation()">
        <div class="avatar">{{ accountInitials(store.account) }}</div>
        <div><strong>{{ store.account.firstName }} {{ store.account.lastName }}</strong><small>{{ store.account.role === 'root' ? 'Inhaber' : 'Mitarbeiter' }}</small></div>
      </RouterLink>
      <button class="sidebar-toggle-link" :title="sidebarCollapsed ? 'Navigation ausklappen' : 'Navigation einklappen'" @click="sidebarCollapsed = !sidebarCollapsed">
        <ChevronRight v-if="sidebarCollapsed" :size="16" />
        <ChevronLeft v-else :size="16" />
        <span>{{ sidebarCollapsed ? 'Ausklappen' : 'Einklappen' }}</span>
      </button>
    </aside>

    <div v-if="mobileNavOpen" class="scrim" @click="closeMobileNavigation(true)" />
    <section class="main-area">
      <header class="topbar">
        <button ref="mobileNavTrigger" class="menu-button icon-button" aria-label="Navigation öffnen" @click="openMobileNavigation"><Menu /></button>
        <DemoDataControl />
        <RouterLink class="top-avatar" to="/account" aria-label="Zu den Kontoeinstellungen">{{ accountInitials(store.account) }}</RouterLink>
      </header>

      <main v-if="route.name === 'dashboard'">
        <div class="page-heading">
          <div><p class="eyebrow">{{ formatLongWeekdayDate(store.businessDate.value) }}</p><h1>Tagesübersicht</h1><p>Hier ist der Überblick für den heutigen Pensionstag.</p></div>
        </div>

        <section v-if="visibleNavigationItems.some(item => item.name === 'requests')" class="metrics" aria-label="Tageskennzahlen">
          <RouterLink class="metric-card" :to="{ path: '/check-in-out', query: { view: 'arrivals' } }" aria-label="Anreisen heute in Check-in und Check-out öffnen"><span class="metric-icon orange"><CalendarDays /></span><div><small>Anreisen heute</small><strong>{{ store.arrivals.value.length }}</strong><p>Nächste um {{ store.arrivals.value[0]?.arrival ?? '–' }} Uhr</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
          <RouterLink class="metric-card" :to="{ path: '/check-in-out', query: { view: 'departures' } }" aria-label="Abreisen heute in Check-in und Check-out öffnen"><span class="metric-icon teal"><LogOut /></span><div><small>Abreisen heute</small><strong>{{ store.departures.value.length }}</strong><p>{{ store.departures.value.length ? 'Heute abholbereit' : 'Keine Abreise geplant' }}</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
          <RouterLink class="metric-card" :to="{ path: '/check-in-out', query: { view: 'checked-in' } }" aria-label="Tiere im Haus in Check-in und Check-out öffnen"><span class="metric-icon teal"><Dog /></span><div><small>Tiere im Haus</small><strong>{{ store.checkedIn.value.length }}<em> / {{ store.totalCapacity.value }}</em></strong><p>{{ store.occupancyRate.value }} % der Plätze belegt</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
          <RouterLink class="metric-card" to="/requests" aria-label="Offene Anfragen öffnen"><span class="metric-icon orange"><Inbox /></span><div><small>Offene Anfragen</small><strong>{{ store.pendingRequests.value.length }}</strong><p>{{ store.pendingRequests.value.length ? 'Bearbeitung ausstehend' : 'Alles erledigt' }}</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
        </section>
        <section v-else class="metrics three-cols" aria-label="Tageskennzahlen">
          <RouterLink class="metric-card" :to="{ path: '/check-in-out', query: { view: 'arrivals' } }" aria-label="Anreisen heute in Check-in und Check-out öffnen"><span class="metric-icon orange"><CalendarDays /></span><div><small>Anreisen heute</small><strong>{{ store.arrivals.value.length }}</strong><p>Nächste um {{ store.arrivals.value[0]?.arrival ?? '–' }} Uhr</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
          <RouterLink class="metric-card" :to="{ path: '/check-in-out', query: { view: 'departures' } }" aria-label="Abreisen heute in Check-in und Check-out öffnen"><span class="metric-icon teal"><LogOut /></span><div><small>Abreisen heute</small><strong>{{ store.departures.value.length }}</strong><p>{{ store.departures.value.length ? 'Heute abholbereit' : 'Keine Abreise geplant' }}</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
          <RouterLink class="metric-card" :to="{ path: '/check-in-out', query: { view: 'checked-in' } }" aria-label="Tiere im Haus in Check-in und Check-out öffnen"><span class="metric-icon teal"><Dog /></span><div><small>Tiere im Haus</small><strong>{{ store.checkedIn.value.length }}<em> / {{ store.totalCapacity.value }}</em></strong><p>{{ store.occupancyRate.value }} % der Plätze belegt</p></div><ArrowRight class="metric-arrow" :size="18" /></RouterLink>
        </section>

        <div class="dashboard-grid">
          <section class="panel arrivals-panel">
            <header><div><h2>{{ scheduleView === 'arrivals' ? 'Heutige Anreisen' : 'Heutige Abreisen' }}</h2><p>{{ scheduleView === 'arrivals' ? `${filteredArrivals.length} Tiere warten auf ihren Check-in` : `${filteredDepartures.length} Tiere sind abholbereit` }}</p></div><div class="schedule-tabs"><button :class="{ active: scheduleView === 'arrivals' }" @click="scheduleView = 'arrivals'">Anreisen</button><button :class="{ active: scheduleView === 'departures' }" @click="scheduleView = 'departures'">Abreisen</button></div></header>
            <div v-if="scheduleView === 'arrivals' && filteredArrivals.length" class="arrival-list">
              <article v-for="booking in filteredArrivals" :key="booking.id" class="arrival-row">
                <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
                <div class="pet-info"><strong>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</strong><span>{{ booking.pet.name }}</span></div>
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
                <div class="pet-info"><strong>{{ departure.customer.firstName }} {{ departure.customer.lastName }}</strong><span>{{ departure.pet.name }}</span></div>
                <div class="arrival-meta"><strong>Abreise heute</strong><span>{{ departure.room.name }}</span></div>
                <button class="link-button" @click="selectedDeparture = departure"><LogOut :size="16" /> Auschecken</button>
              </article>
            </div>
            <div v-else class="empty-state">
              <span><Check /></span>
              <strong>{{ scheduleView === 'arrivals' ? 'Alle erwarteten Tiere sind angekommen.' : 'Alle Abreisen sind abgeschlossen.' }}</strong>
              <p>{{ scheduleView === 'arrivals' ? 'Für heute steht kein weiterer Check-in an.' : 'Für heute steht kein weiterer Check-out an.' }}</p>
            </div>
            <RouterLink class="panel-navigation" to="/check-in-out">Alle Check-ins und Check-outs <ArrowRight :size="16" /></RouterLink>
          </section>

          <aside class="panel occupancy-panel">
            <header><div><h2><RouterLink class="panel-title-link" to="/occupancy">Belegung ansehen</RouterLink></h2><p>Aktueller Stand</p></div><span class="occupancy-number">{{ store.occupancyRate.value }} %</span></header>
            <div class="progress"><span :style="{ width: `${store.occupancyRate.value}%` }" /></div>
            <div class="room-summary">
              <div v-for="summary in store.occupancyByCategory.value" :key="summary.category">
                <span class="room-icon" :class="{ cat: summary.category === 'Katzenzimmer' }"><Dog v-if="summary.category === 'Hundezimmer'" :size="19" /><template v-else>K</template></span>
                <p><strong>{{ summary.category }}</strong><small>{{ summary.occupied }} von {{ summary.capacity }} belegt</small></p><span>{{ summary.capacity }} Plätze</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <CustomersPage v-else-if="route.name === 'customers'" />
      <CheckInOutPage v-else-if="route.name === 'check-in-out'" @check-in="selectedBooking = $event" @check-out="selectedDeparture = $event" />
      <BookingsPage v-else-if="route.name === 'bookings'" @check-out="selectedDeparture = $event" />
      <OccupancyPage v-else-if="route.name === 'occupancy'" />
      <RequestsPage v-else-if="route.name === 'requests'" />
      <SettingsPage v-else-if="isSettingsRoute" />
      <AccountSettingsPage v-else-if="route.name === 'account'" />
      <main v-else-if="route.name !== 'intro'" class="route-page">
        <div class="route-page-card">
          <span class="route-page-icon">
            <LogoIcon v-if="route.name === 'not-found'" :size="32" />
            <component :is="navigationItems.find((item) => item.name === route.name)?.icon ?? CalendarDays" v-else />
          </span>
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
      @confirm="confirmCheckIn(selectedBooking, $event)"
    />

    <CheckoutModal
      v-if="selectedDeparture"
      :departure="selectedDeparture"
      :price="selectedDeparturePrice"
      @close="selectedDeparture = null"
      @confirm="confirmCheckout(selectedDeparture)"
    />
  </div>
</template>
