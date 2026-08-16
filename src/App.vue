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
import AppEyebrow from './components/AppEyebrow.vue'
import AppMetricCard from './components/AppMetricCard.vue'
import AppNoteBadge from './components/AppNoteBadge.vue'
import AppPetAvatar from './components/AppPetAvatar.vue'
import AppPageHeading from './components/AppPageHeading.vue'
import AppRoomIcon from './components/AppRoomIcon.vue'
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
  <div v-else class="flex min-h-screen">
    <aside ref="mobileNavigation" class="fixed inset-y-0 left-0 z-20 flex w-[250px] flex-col border-r border-[var(--border)] bg-white px-4 pb-[18px] pt-[25px] transition-[width,transform,visibility] duration-[250ms] max-[920px]:invisible max-[920px]:pointer-events-none max-[920px]:-translate-x-full" :class="[{ 'visible pointer-events-auto translate-x-0 shadow-[15px_0_45px_rgba(36,33,31,.15)] max-[920px]:delay-0': mobileNavOpen }, sidebarCollapsed ? 'min-[921px]:w-[72px]' : 'min-[921px]:w-[250px]']" :role="mobileNavOpen ? 'dialog' : undefined" :aria-modal="mobileNavOpen ? 'true' : undefined" aria-label="Seitennavigation">
      <RouterLink class="flex items-center gap-[10px] px-[9px] pb-8 pt-0 text-[19px] font-bold text-[var(--text)] no-underline transition-[padding] duration-[250ms] [font-family:'Manrope',sans-serif]" :class="sidebarCollapsed ? 'min-[921px]:justify-center min-[921px]:pb-[22px]' : ''" to="/dashboard" @click="closeMobileNavigation()">
        <span class="grid size-9 shrink-0 place-items-center text-[var(--primary)]">
          <LogoIcon :size="24" color="white" />
        </span>
        <span :class="sidebarCollapsed ? 'min-[921px]:hidden' : ''">Tierpension <span class="text-[var(--primary)]">Pro</span></span>
      </RouterLink>
      <AppIconButton ref="mobileNavClose" class="hidden absolute right-[10px] top-[21px] max-[920px]:grid" aria-label="Navigation schließen" @click="closeMobileNavigation(true)"><X /></AppIconButton>
      <nav class="grid gap-[6px]" aria-label="Hauptnavigation">
        <RouterLink v-for="item in visibleNavigationItems" :key="item.name" :to="item.path" class="relative flex min-h-[45px] items-center gap-3 rounded-[9px] px-[13px] text-left font-semibold text-[#5e5955] no-underline hover:bg-[#f6f3ef] [&.router-link-exact-active]:bg-[#fff3eb] [&.router-link-exact-active]:text-[#a74613] [&.router-link-exact-active]:before:absolute [&.router-link-exact-active]:before:-left-4 [&.router-link-exact-active]:before:h-[26px] [&.router-link-exact-active]:before:w-[3px] [&.router-link-exact-active]:before:rounded-r [&.router-link-exact-active]:before:bg-[var(--primary)]" :class="[{ 'router-link-exact-active': item.name === 'settings' && isSettingsRoute }, sidebarCollapsed ? 'min-[921px]:justify-center min-[921px]:px-[10px]' : '']" :title="sidebarCollapsed ? item.title : undefined" @click="closeMobileNavigation()">
          <component :is="item.icon" :size="19" /><span :class="sidebarCollapsed ? 'min-[921px]:hidden' : ''">{{ item.title }}</span><span v-if="item.name === 'requests' && store.pendingRequests.value.length" class="ml-auto inline-flex size-5 items-center justify-center rounded-[10px] bg-[#faf0d9] px-[6px] text-[10px] font-bold leading-none text-[#84601c] [&.router-link-exact-active]:bg-[#fbe8dd] [&.router-link-exact-active]:text-[#a74613]" :class="sidebarCollapsed ? 'min-[921px]:hidden' : ''" aria-hidden="true">{{ store.pendingRequests.value.length }}</span>
        </RouterLink>
      </nav>
      <RouterLink class="relative mt-auto flex items-center gap-[10px] rounded-lg border-t border-[#ebe7e2] px-2 pb-0 pt-[15px] text-inherit no-underline hover:bg-[#f5f2ee]" :class="sidebarCollapsed ? 'min-[921px]:justify-center min-[921px]:px-0' : ''" to="/account" aria-label="Zu den Kontoeinstellungen" :title="sidebarCollapsed ? 'Kontoeinstellungen' : undefined" @click="closeMobileNavigation()">
        <div class="grid size-[38px] shrink-0 place-items-center rounded-full bg-[#dceae7] text-xs font-bold text-[var(--petrol)]">{{ accountInitials(store.account) }}</div>
        <div :class="sidebarCollapsed ? 'min-[921px]:hidden' : ''"><strong class="block text-[13px]">{{ store.account.firstName }} {{ store.account.lastName }}</strong><small class="mt-[2px] block text-[11px] text-[var(--muted)]">{{ store.account.role === 'root' ? 'Inhaber' : 'Mitarbeiter' }}</small></div>
      </RouterLink>
      <button class="relative mt-[10px] hidden w-full items-center justify-center gap-[6px] rounded-lg border-0 bg-transparent px-2 py-[9px] text-center text-[11px] font-bold text-[var(--muted)] hover:bg-[#f5f2ee] hover:text-[var(--text)] min-[921px]:flex" :title="sidebarCollapsed ? 'Navigation ausklappen' : 'Navigation einklappen'" @click="sidebarCollapsed = !sidebarCollapsed">
        <ChevronRight v-if="sidebarCollapsed" :size="16" />
        <ChevronLeft v-else :size="16" />
        <span :class="sidebarCollapsed ? 'hidden' : ''">{{ sidebarCollapsed ? 'Ausklappen' : 'Einklappen' }}</span>
      </button>
    </aside>

    <div v-if="mobileNavOpen" class="fixed inset-0 z-[15] bg-[rgba(36,33,31,.35)] min-[921px]:hidden" @click="closeMobileNavigation(true)" />
    <section class="w-full transition-[margin,width] duration-[250ms] min-[921px]:ml-[250px] min-[921px]:w-[calc(100%-250px)]" :class="sidebarCollapsed ? 'min-[921px]:ml-[72px] min-[921px]:w-[calc(100%-72px)]' : ''">
      <header class="flex h-[70px] items-center gap-2 border-b border-[var(--border)] bg-white px-[15px] sm:gap-[18px] sm:px-[28px]">
        <AppIconButton ref="mobileNavTrigger" class="hidden max-[920px]:grid" aria-label="Navigation öffnen" @click="openMobileNavigation"><Menu /></AppIconButton>
        <DemoDataControl />
        <RouterLink class="grid size-[35px] flex-none place-items-center rounded-full bg-[#dceae7] text-xs font-bold text-[var(--petrol)] no-underline sm:size-[38px]" to="/account" aria-label="Zu den Kontoeinstellungen">{{ accountInitials(store.account) }}</RouterLink>
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

        <div class="grid grid-cols-1 gap-[22px] min-[921px]:grid-cols-[minmax(0,1.75fr)_minmax(280px,.75fr)]">
          <section class="panel">
            <header><div><h2>{{ scheduleView === 'arrivals' ? 'Heutige Anreisen' : 'Heutige Abreisen' }}</h2><p>{{ scheduleView === 'arrivals' ? `${filteredArrivals.length} Tiere warten auf ihren Check-in` : `${filteredDepartures.length} Tiere sind abholbereit` }}</p></div><AppTabs><AppTab :active="scheduleView === 'arrivals'" @click="scheduleView = 'arrivals'">Anreisen</AppTab><AppTab :active="scheduleView === 'departures'" @click="scheduleView = 'departures'">Abreisen</AppTab></AppTabs></header>
            <div v-if="scheduleView === 'arrivals' && filteredArrivals.length">
              <article v-for="booking in filteredArrivals" :key="booking.id" class="grid grid-cols-[auto_minmax(155px,1fr)_110px_61px_max-content] items-center gap-[13px] border-b border-b-[#eeeae6] px-[22px] py-4 last:border-b-0 max-[680px]:grid-cols-[auto_1fr_auto] max-[680px]:p-[15px]">
                <AppPetAvatar :initials="booking.pet.initials" :color="booking.pet.color" />
                <div><strong class="block text-sm">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</strong><span class="mt-[3px] block text-[11px] text-[var(--muted)]">{{ booking.pet.name }}</span></div>
                <div class="max-[680px]:col-start-2"><strong class="block text-[13px]">{{ booking.arrival }} Uhr</strong><span class="mt-[3px] block text-[11px] text-[var(--muted)]">{{ booking.room.name }}</span></div>
                <span class="min-w-0 max-[680px]:col-start-3 max-[680px]:row-start-1">
                  <AppNoteBadge v-if="booking.pet.note">Hinweis</AppNoteBadge>
                </span>
                <AppButton variant="link" @click="selectedBooking = booking">Einchecken</AppButton>
              </article>
            </div>
            <div v-else-if="scheduleView === 'departures' && filteredDepartures.length">
              <article v-for="departure in filteredDepartures" :key="departure.id" class="grid grid-cols-[auto_minmax(155px,1fr)_110px_auto] items-center gap-[13px] border-b border-b-[#eeeae6] px-[22px] py-4 last:border-b-0 max-[680px]:grid-cols-[auto_1fr_auto] max-[680px]:p-[15px]">
                <AppPetAvatar :initials="departure.pet.initials" :color="departure.pet.color" />
                <div><strong class="block text-sm">{{ departure.customer.firstName }} {{ departure.customer.lastName }}</strong><span class="mt-[3px] block text-[11px] text-[var(--muted)]">{{ departure.pet.name }}</span></div>
                <div class="max-[680px]:col-start-2"><strong class="block text-[13px]">Abreise heute</strong><span class="mt-[3px] block text-[11px] text-[var(--muted)]">{{ departure.room.name }}</span></div>
                <AppButton variant="link" @click="selectedDeparture = departure"><LogOut :size="16" /> Auschecken</AppButton>
              </article>
            </div>
            <AppEmptyState v-else>
              <template #icon><Check /></template>
              <template #title>{{ scheduleView === 'arrivals' ? 'Alle erwarteten Tiere sind angekommen.' : 'Alle Abreisen sind abgeschlossen.' }}</template>
              <template #description>{{ scheduleView === 'arrivals' ? 'Für heute steht kein weiterer Check-in an.' : 'Für heute steht kein weiterer Check-out an.' }}</template>
            </AppEmptyState>
            <RouterLink class="flex items-center justify-end gap-[7px] border-t border-t-[#eeeae6] px-[22px] py-[13px] text-xs font-bold text-[var(--primary)] hover:underline" to="/check-in-out">Alle Check-ins und Check-outs <ArrowRight :size="16" /></RouterLink>
          </section>

          <aside class="panel">
            <header><div><h2><RouterLink class="text-inherit no-underline hover:text-[var(--primary)] hover:underline" to="/occupancy">Belegung ansehen</RouterLink></h2><p>Aktueller Stand</p></div><span class="text-[20px] font-bold [font-family:'Manrope',sans-serif] text-[var(--primary)]">{{ store.occupancyRate.value }} %</span></header>
            <div class="mx-[22px] mt-[23px] h-2 overflow-hidden rounded-full bg-[#eeeae6]"><span class="block h-full rounded-[inherit] bg-[var(--primary)] transition-[width] duration-[350ms]" :style="{ width: `${store.occupancyRate.value}%` }" /></div>
            <div class="px-[22px] py-[10px]">
              <div v-for="summary in store.occupancyByCategory.value" :key="summary.category" class="grid grid-cols-[auto_1fr_auto] items-center gap-[10px] border-b border-b-[#eeeae6] py-[15px]">
                <AppRoomIcon :category="summary.category" />
                <p class="m-0"><strong class="block text-xs">{{ summary.category }}</strong><small class="mt-[2px] block text-[10px] text-[var(--muted)]">{{ summary.occupied }} von {{ summary.capacity }} belegt</small></p><span class="mt-[2px] block text-[10px] text-[var(--muted)]">{{ summary.capacity }} Plätze</span>
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
      <AppContainer v-else-if="route.name !== 'intro'" class="grid min-h-[calc(100vh-70px)] place-items-center">
        <div class="w-full max-w-[520px] rounded-[14px] border border-[var(--border)] bg-white p-12 text-center">
          <span class="mx-auto mb-[19px] grid size-[58px] place-items-center rounded-[15px] bg-[#fbe8dd] text-[var(--primary-dark)]">
            <LogoIcon v-if="route.name === 'not-found'" :size="32" />
            <component :is="navigationItems.find((item) => item.name === route.name)?.icon ?? CalendarDays" v-else />
          </span>
          <AppEyebrow>{{ route.name === 'not-found' ? 'Fehler 404' : 'Tierpension Pro' }}</AppEyebrow>
          <h1 class="my-[6px] text-[28px] font-bold [font-family:'Manrope',sans-serif]">{{ currentPage.title }}</h1>
          <p class="mb-[25px] mt-0 text-[var(--muted)]">{{ currentPage.description }}</p>
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
