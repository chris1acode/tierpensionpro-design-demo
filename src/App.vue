<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Dog, Inbox, LogOut, Menu, X
} from '@lucide/vue'
import AccountSettingsPage from './components/AccountSettingsPage.vue'
import AppButton from './components/AppButton.vue'
import AppContainer from './components/AppContainer.vue'
import AppIconButton from './components/AppIconButton.vue'
import AppEmptyState from './components/AppEmptyState.vue'
import AppMetricCard from './components/AppMetricCard.vue'
import AppPageHeading from './components/AppPageHeading.vue'
import AppTab from './components/AppTab.vue'
import AppTabs from './components/AppTabs.vue'
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
const mobileNavTrigger = ref<InstanceType<typeof AppIconButton> | null>(null)
const mobileNavClose = ref<InstanceType<typeof AppIconButton> | null>(null)
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
      <RouterLink class="brand" to="/dashboard" @click="closeMobileNavigation()">
        <span class="brand-mark">
          <LogoIcon :size="24" color="white" />
        </span>
        <span>Tierpension <span>Pro</span></span>
      </RouterLink>
      <AppIconButton ref="mobileNavClose" class="hidden absolute right-[10px] top-[21px] max-[920px]:grid" aria-label="Navigation schließen" @click="closeMobileNavigation(true)"><X /></AppIconButton>
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
        <AppIconButton ref="mobileNavTrigger" class="hidden max-[920px]:grid" aria-label="Navigation öffnen" @click="openMobileNavigation"><Menu /></AppIconButton>
        <DemoDataControl />
        <RouterLink class="top-avatar" to="/account" aria-label="Zu den Kontoeinstellungen">{{ accountInitials(store.account) }}</RouterLink>
      </header>

      <AppContainer v-if="route.name === 'dashboard'">
        <AppPageHeading :eyebrow="formatLongWeekdayDate(store.businessDate.value)" title="Tagesübersicht" description="Hier ist der Überblick für den heutigen Pensionstag." />

        <section v-if="visibleNavigationItems.some(item => item.name === 'requests')" class="grid grid-cols-1 gap-4 mb-[22px] sm:grid-cols-4" aria-label="Tageskennzahlen">
          <AppMetricCard :to="{ path: '/check-in-out', query: { view: 'arrivals' } }" ariaLabel="Anreisen heute in Check-in und Check-out öffnen" :icon="CalendarDays" color="orange" label="Anreisen heute" :hint="`Nächste um ${store.arrivals.value[0]?.arrival ?? '–'} Uhr`">{{ store.arrivals.value.length }}</AppMetricCard>
          <AppMetricCard :to="{ path: '/check-in-out', query: { view: 'departures' } }" ariaLabel="Abreisen heute in Check-in und Check-out öffnen" :icon="LogOut" color="teal" label="Abreisen heute" :hint="store.departures.value.length ? 'Heute abholbereit' : 'Keine Abreise geplant'">{{ store.departures.value.length }}</AppMetricCard>
          <AppMetricCard :to="{ path: '/check-in-out', query: { view: 'checked-in' } }" ariaLabel="Tiere im Haus in Check-in und Check-out öffnen" :icon="Dog" color="teal" label="Tiere im Haus" :hint="`${store.occupancyRate.value} % der Plätze belegt`">{{ store.checkedIn.value.length }}<em class="not-italic"> / {{ store.totalCapacity.value }}</em></AppMetricCard>
          <AppMetricCard to="/requests" ariaLabel="Offene Anfragen öffnen" :icon="Inbox" color="orange" label="Offene Anfragen" :hint="store.pendingRequests.value.length ? 'Bearbeitung ausstehend' : 'Alles erledigt'">{{ store.pendingRequests.value.length }}</AppMetricCard>
        </section>
        <section v-else class="grid grid-cols-1 gap-4 mb-[22px] sm:grid-cols-3" aria-label="Tageskennzahlen">
          <AppMetricCard :to="{ path: '/check-in-out', query: { view: 'arrivals' } }" ariaLabel="Anreisen heute in Check-in und Check-out öffnen" :icon="CalendarDays" color="orange" label="Anreisen heute" :hint="`Nächste um ${store.arrivals.value[0]?.arrival ?? '–'} Uhr`">{{ store.arrivals.value.length }}</AppMetricCard>
          <AppMetricCard :to="{ path: '/check-in-out', query: { view: 'departures' } }" ariaLabel="Abreisen heute in Check-in und Check-out öffnen" :icon="LogOut" color="teal" label="Abreisen heute" :hint="store.departures.value.length ? 'Heute abholbereit' : 'Keine Abreise geplant'">{{ store.departures.value.length }}</AppMetricCard>
          <AppMetricCard :to="{ path: '/check-in-out', query: { view: 'checked-in' } }" ariaLabel="Tiere im Haus in Check-in und Check-out öffnen" :icon="Dog" color="teal" label="Tiere im Haus" :hint="`${store.occupancyRate.value} % der Plätze belegt`">{{ store.checkedIn.value.length }}<em class="not-italic"> / {{ store.totalCapacity.value }}</em></AppMetricCard>
        </section>

        <div class="dashboard-grid">
          <section class="panel arrivals-panel">
            <header><div><h2>{{ scheduleView === 'arrivals' ? 'Heutige Anreisen' : 'Heutige Abreisen' }}</h2><p>{{ scheduleView === 'arrivals' ? `${filteredArrivals.length} Tiere warten auf ihren Check-in` : `${filteredDepartures.length} Tiere sind abholbereit` }}</p></div><AppTabs><AppTab :active="scheduleView === 'arrivals'" @click="scheduleView = 'arrivals'">Anreisen</AppTab><AppTab :active="scheduleView === 'departures'" @click="scheduleView = 'departures'">Abreisen</AppTab></AppTabs></header>
            <div v-if="scheduleView === 'arrivals' && filteredArrivals.length" class="arrival-list">
              <article v-for="booking in filteredArrivals" :key="booking.id" class="arrival-row">
                <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
                <div class="pet-info"><strong>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</strong><span>{{ booking.pet.name }}</span></div>
                <div class="arrival-meta"><strong>{{ booking.arrival }} Uhr</strong><span>{{ booking.room.name }}</span></div>
                <span class="arrival-note-slot">
                  <span v-if="booking.pet.note" class="note-badge">Hinweis</span>
                </span>
                <AppButton variant="link" @click="selectedBooking = booking">Einchecken</AppButton>
              </article>
            </div>
            <div v-else-if="scheduleView === 'departures' && filteredDepartures.length" class="arrival-list">
              <article v-for="departure in filteredDepartures" :key="departure.id" class="arrival-row departure-row">
                <div class="pet-avatar" :style="{ background: departure.pet.color }">{{ departure.pet.initials }}</div>
                <div class="pet-info"><strong>{{ departure.customer.firstName }} {{ departure.customer.lastName }}</strong><span>{{ departure.pet.name }}</span></div>
                <div class="arrival-meta"><strong>Abreise heute</strong><span>{{ departure.room.name }}</span></div>
                <AppButton variant="link" @click="selectedDeparture = departure"><LogOut :size="16" /> Auschecken</AppButton>
              </article>
            </div>
            <AppEmptyState v-else>
              <template #icon><Check /></template>
              <template #title>{{ scheduleView === 'arrivals' ? 'Alle erwarteten Tiere sind angekommen.' : 'Alle Abreisen sind abgeschlossen.' }}</template>
              <template #description>{{ scheduleView === 'arrivals' ? 'Für heute steht kein weiterer Check-in an.' : 'Für heute steht kein weiterer Check-out an.' }}</template>
            </AppEmptyState>
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
      </AppContainer>
      <CustomersPage v-else-if="route.name === 'customers'" />
      <CheckInOutPage v-else-if="route.name === 'check-in-out'" @check-in="selectedBooking = $event" @check-out="selectedDeparture = $event" />
      <BookingsPage v-else-if="route.name === 'bookings'" @check-out="selectedDeparture = $event" />
      <OccupancyPage v-else-if="route.name === 'occupancy'" />
      <RequestsPage v-else-if="route.name === 'requests'" />
      <SettingsPage v-else-if="isSettingsRoute" />
      <AccountSettingsPage v-else-if="route.name === 'account'" />
      <AppContainer v-else-if="route.name !== 'intro'" class="route-page">
        <div class="route-page-card">
          <span class="route-page-icon">
            <LogoIcon v-if="route.name === 'not-found'" :size="32" />
            <component :is="navigationItems.find((item) => item.name === route.name)?.icon ?? CalendarDays" v-else />
          </span>
          <p class="eyebrow">{{ route.name === 'not-found' ? 'Fehler 404' : 'Tierpension Pro' }}</p>
          <h1>{{ currentPage.title }}</h1>
          <p>{{ currentPage.description }}</p>
          <AppButton v-if="route.name === 'not-found'" variant="primary" to="/dashboard">Zurück zum Dashboard</AppButton>
          <AppButton v-else variant="secondary" to="/dashboard">Zum Tagesdashboard</AppButton>
        </div>
      </AppContainer>
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
