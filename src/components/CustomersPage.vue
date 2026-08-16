<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Cat, Dog, Download, Mail, Pencil, Phone, Plus, Search, Trash2, Utensils } from '@lucide/vue'
import type { CustomerView } from '../domain'
import { bookingStatusLabels } from '../presentation/bookingStatus'
import { toTelephoneHref } from '../presentation/phoneLink'
import { usePagination } from '../composables/usePagination'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppContainer from './AppContainer.vue'
import AppEmptyState from './AppEmptyState.vue'
import AppPageHeading from './AppPageHeading.vue'
import AppPagination from './AppPagination.vue'
import CustomerFormModal from './CustomerFormModal.vue'
import PetFormModal from './PetFormModal.vue'

const store = usePensionStore()
const route = useRoute()
const router = useRouter()
const localQuery = ref('')
const selectedCustomerId = ref<string | null>(store.customerViews.value[0]?.id ?? null)
const detailsOpen = ref(false)
const petModalMode = ref<'create' | 'edit' | null>(null)
const petModalTarget = ref<CustomerView['pets'][number] | null>(null)
const customerModalMode = ref<'create' | 'edit' | null>(null)
const customerRemovalOpen = ref(false)
const petRemovalId = ref<string | null>(null)
const veterinaryContactRemovalId = ref<string | null>(null)
const pageSize = 5
const isCompactPagination = ref(false)
const compactPaginationQuery = typeof window === 'undefined' ? null : window.matchMedia('(max-width: 680px)')

const searchTerm = computed(() => resolveSearchTerm(localQuery.value))
const filteredCustomers = computed(() => store.customerViews.value.filter((customer) =>
  matchesSearchTerm(searchTerm.value, [customer.firstName, customer.lastName, customer.email, customer.phone, ...customer.pets.flatMap((pet) => [pet.name])])))
const { currentPage, pageCount, pagedItems: pagedCustomers, resetPage, selectPage: selectPaginationPage } = usePagination(filteredCustomers, pageSize)
const visiblePageItems = computed<Array<number | 'ellipsis-left' | 'ellipsis-right'>>(() => {
  if (isCompactPagination.value && pageCount.value > 3) {
    const middlePage = Math.min(Math.max(currentPage.value, 2), pageCount.value - 1)
    const pages: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [1]
    if (middlePage > 2) pages.push('ellipsis-left')
    pages.push(middlePage)
    if (middlePage < pageCount.value - 1) pages.push('ellipsis-right')
    pages.push(pageCount.value)
    return pages
  }

  const maxPageButtons = 10
  if (pageCount.value <= maxPageButtons) return Array.from({ length: pageCount.value }, (_, index) => index + 1)

  const surroundingPages = 3
  const start = Math.max(2, Math.min(currentPage.value - 1, pageCount.value - surroundingPages - 1))
  const end = Math.min(pageCount.value - 1, Math.max(currentPage.value + 1, surroundingPages + 2))
  const pages: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [1]

  if (start > 2) pages.push('ellipsis-left')
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < pageCount.value - 1) pages.push('ellipsis-right')

  pages.push(pageCount.value)
  return pages
})

function updateCompactPagination(event?: MediaQueryListEvent) {
  isCompactPagination.value = event?.matches ?? compactPaginationQuery?.matches ?? false
}

onMounted(() => {
  updateCompactPagination()
  compactPaginationQuery?.addEventListener('change', updateCompactPagination)
})

onBeforeUnmount(() => {
  compactPaginationQuery?.removeEventListener('change', updateCompactPagination)
})
const selectedCustomer = computed<CustomerView | undefined>(() =>
  pagedCustomers.value.find((customer) => customer.id === selectedCustomerId.value) ?? pagedCustomers.value[0])

watch(searchTerm, () => {
  resetPage()
  selectedCustomerId.value = filteredCustomers.value[0]?.id ?? null
  detailsOpen.value = false
})

watch(() => route.query.customerId, (customerId) => {
  if (typeof customerId !== 'string') return
  const index = store.customerViews.value.findIndex((customer) => customer.id === customerId)
  if (index < 0) return
  currentPage.value = Math.floor(index / pageSize) + 1
  selectedCustomerId.value = customerId
  detailsOpen.value = true
}, { immediate: true })

function selectPage(page: number) {
  selectPaginationPage(page)
  selectedCustomerId.value = pagedCustomers.value[0]?.id ?? null
  detailsOpen.value = false
}

function goBack() {
  detailsOpen.value = false
  const query = { ...route.query }
  delete query.customerId
  void router.replace({ name: 'customers', query })
}

function selectCustomer(customerId: string) {
  selectedCustomerId.value = customerId
  detailsOpen.value = true
  veterinaryContactRemovalId.value = null
  customerRemovalOpen.value = false
  void router.replace({ name: 'customers', query: { ...route.query, customerId } })
}

function removeCustomer() {
  if (!selectedCustomer.value) return
  if (store.removeCustomer(selectedCustomer.value.id)) {
    selectedCustomerId.value = filteredCustomers.value[0]?.id ?? null
    detailsOpen.value = false
    customerRemovalOpen.value = false
  }
}

function onCustomerSaved(customerId: string) {
  const wasCreate = customerModalMode.value === 'create'
  customerModalMode.value = null
  if (!wasCreate) return

  const sortedIndex = store.customerViews.value.findIndex((customer) => customer.id === customerId)
  currentPage.value = Math.floor(sortedIndex / pageSize) + 1
  selectedCustomerId.value = customerId
  detailsOpen.value = true
}

function openPetCreate() {
  petModalTarget.value = null
  petModalMode.value = 'create'
}

function openPetEdit(pet: CustomerView['pets'][number]) {
  petModalTarget.value = pet
  petModalMode.value = 'edit'
}

function closePetModal() {
  petModalMode.value = null
  petModalTarget.value = null
}

function canRemovePet(petId: string) {
  return !store.bookingViews.value.some((booking) => booking.pet.id === petId)
}

function removePet(petId: string) {
  if (store.removePet(petId)) petRemovalId.value = null
}

function removeVeterinaryContact(petId: string) {
  // Not supported by store
}

function exportCustomers() {
  downloadCsv({
    fileName: 'kunden-und-tiere.csv',
    columns: ['Kunde', 'E-Mail', 'Telefon', 'Tier', 'Tierart', 'Hinweis', 'Besonderes Futter'],
    rows: filteredCustomers.value.flatMap((customer) => customer.pets.length
      ? customer.pets.map((pet) => [
        `${customer.firstName} ${customer.lastName}`, customer.email, customer.phone, pet.name,
        pet.species === 'dog' ? 'Hund' : 'Katze', pet.note, pet.specialFood ? 'Ja' : 'Nein'
      ])
      : [[`${customer.firstName} ${customer.lastName}`, customer.email, customer.phone, '', '', '', '']])
  })
}

</script>

<template>
  <AppContainer class="customers-page">
    <AppPageHeading eyebrow="Stammdaten" title="Kunden & Tiere" description="Kontaktdaten, Tierprofile und Aufenthalte an einem Ort.">
      <AppButton variant="primary" type="button" @click="customerModalMode = 'create'"><Plus :size="18" /> Kunden anlegen</AppButton>
    </AppPageHeading>

    <div class="grid grid-cols-1 items-start gap-[22px] min-[1050px]:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <section class="panel customer-directory max-h-none min-[1050px]:max-h-[680px]" :class="{ 'hidden min-[1050px]:block': detailsOpen }">
        <header>
          <div><h2>Kundenverzeichnis</h2><p>{{ filteredCustomers.length }} Treffer</p></div>
          <div class="list-header-actions"><AppButton variant="text" type="button" aria-label="Kunden und Tiere als CSV exportieren" @click="exportCustomers"><Download :size="15" /> Exportieren</AppButton></div>
        </header>
        <label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Kundenname oder Tiername suchen …" /></label>
        <div v-if="filteredCustomers.length" class="customer-list max-h-none min-[1050px]:max-h-[540px]">
          <button v-for="customer in pagedCustomers" :key="customer.id" :class="{ active: selectedCustomer?.id === customer.id }" @click="selectCustomer(customer.id)">
            <span class="customer-avatar">{{ customer.firstName[0] }}{{ customer.lastName[0] }}</span>
            <span><strong>{{ customer.firstName }} {{ customer.lastName }}</strong><small>{{ customer.pets.map((pet) => pet.name).join(', ') }}</small></span>
            <span class="pet-count">{{ customer.pets.length }}</span>
          </button>
        </div>
        <AppEmptyState v-else>
          <template #icon><Search /></template>
          <template #title>Keine passenden Stammdaten.</template>
          <template #description>Versuche einen anderen Suchbegriff.</template>
        </AppEmptyState>
        <AppPagination
          :current-page="currentPage"
          :page-count="pageCount"
          :page-items="visiblePageItems"
          ariaLabel="Seiten im Kundenverzeichnis"
          @select="selectPage"
        />
      </section>

      <section v-if="selectedCustomer" class="panel customer-details" :class="{ 'hidden min-[1050px]:block': !detailsOpen }">
        <button class="customer-details-back flex items-center gap-[7px] min-[1050px]:hidden" @click="goBack"><ArrowLeft :size="17" /> Zurück zum Kundenverzeichnis</button>
        <header class="flex flex-col items-center justify-start gap-[14px] pb-[21px] sm:flex-row">
          <div class="grid min-w-0 gap-[4px]">
            <p class="eyebrow">Kundenprofil</p>
            <h2 class="my-0 mb-[5px] mt-[2px] text-[20px]">{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</h2>
            <div class="flex flex-wrap gap-x-[16px] gap-y-[8px]">
              <a class="inline-flex items-center gap-[5px] text-[12px] font-semibold text-[var(--petrol)] no-underline" :href="`mailto:${selectedCustomer.email}`"><Mail :size="14" /> {{ selectedCustomer.email }}</a>
              <a class="inline-flex items-center gap-[5px] text-[12px] font-semibold text-[var(--petrol)] no-underline" :href="toTelephoneHref(selectedCustomer.phone)"><Phone :size="14" /> {{ selectedCustomer.phone }}</a>
            </div>
          </div>
          <div class="ml-0 flex flex-wrap items-center justify-start gap-[12px] sm:ml-auto sm:justify-end">
            <AppButton variant="link" type="button" @click="customerModalMode = 'edit'"><Pencil :size="15" /> Kontaktdaten bearbeiten</AppButton>
            <AppButton v-if="!selectedCustomer.pets.length && !selectedCustomer.bookings.length" variant="text" class="text-[#a63d3d]" type="button" @click="customerRemovalOpen = true"><Trash2 :size="15" /> Entfernen</AppButton>
          </div>
        </header>
        <div v-if="customerRemovalOpen" class="emergency-contact-removal" role="alert">
          <p><strong>{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }} entfernen?</strong> Das Profil enthält keine Tiere und keine Aufenthalte.</p>
          <div><AppButton variant="secondary" type="button" @click="customerRemovalOpen = false">Behalten</AppButton><AppButton variant="danger" type="button" @click="removeCustomer">Jetzt entfernen</AppButton></div>
        </div>
        <div class="detail-section">
          <div class="section-title"><div><h3>Tiere</h3><p>{{ selectedCustomer.pets.length }} hinterlegte Tierprofile</p></div><AppButton variant="text" class="gap-[5px] text-[11px] text-[var(--primary-dark)]" type="button" @click="openPetCreate"><Plus :size="15" /> Tier anlegen</AppButton></div>
          <div class="grid grid-cols-1 gap-[12px]">
            <article v-for="pet in selectedCustomer.pets" :key="pet.id" class="pet-profile-card" :class="pet.species">
              <span class="pet-profile-avatar" :style="{ background: pet.color }" aria-hidden="true">
                <Dog v-if="pet.species === 'dog'" :size="20" />
                <Cat v-else :size="20" />
              </span>
              <div class="pet-profile-summary">
                <strong>{{ pet.name }}</strong>
                <span v-if="pet.specialFood" class="pet-special-food-badge"><Utensils :size="12" /> Besonderes Futter</span>
              </div>
              <div class="pet-card-actions">
                <button class="pet-edit-button" type="button" :aria-label="`${pet.name} bearbeiten`" @click="openPetEdit(pet)"><Pencil :size="14" /> Bearbeiten</button>
                <button v-if="canRemovePet(pet.id)" class="pet-remove-button" type="button" :aria-label="`${pet.name} entfernen`" @click="petRemovalId = pet.id"><Trash2 :size="14" /> Entfernen</button>
              </div>
              <div v-if="petRemovalId === pet.id" class="pet-removal-confirmation" role="alert">
                <p><strong>{{ pet.name }} entfernen?</strong> Für dieses Tier gibt es noch keine Aufenthalte.</p>
                <div><AppButton variant="secondary" type="button" @click="petRemovalId = null">Behalten</AppButton><AppButton variant="danger" class="min-h-[34px] px-[10px] text-[11px]" type="button" @click="removePet(pet.id)">Jetzt entfernen</AppButton></div>
              </div>
              <p v-if="pet.note" class="pet-note-display">{{ pet.note }}</p>
            </article>
          </div>
        </div>
        <div class="detail-section booking-history">
          <div class="section-title"><div><h3>Aufenthalte</h3><p>Aktuelle und vergangene Buchungen</p></div><AppButton variant="text" class="whitespace-nowrap gap-[5px] text-[11px] text-[var(--primary-dark)]" :to="{ path: '/bookings', query: { customerId: selectedCustomer.id } }"><Plus :size="15" /> Jetzt Buchung anlegen</AppButton></div>
          <article v-for="booking in selectedCustomer.bookings" :key="booking.id">
            <div><strong>{{ booking.pet.name }}</strong><span>{{ booking.room.name }}</span></div>
            <div><strong>{{ booking.arrival }} Uhr</strong><span>bis {{ booking.departure }}</span></div>
            <span class="booking-status" :class="booking.status">{{ bookingStatusLabels[booking.status] }}</span>
          </article>
          <AppEmptyState v-if="!selectedCustomer.bookings.length">
            <template #title>Noch keine Aufenthalte.</template>
          </AppEmptyState>
        </div>
      </section>
    </div>

    <CustomerFormModal
      v-if="customerModalMode"
      :mode="customerModalMode"
      :customer="customerModalMode === 'edit' ? selectedCustomer : undefined"
      @close="customerModalMode = null"
      @saved="onCustomerSaved"
    />

    <PetFormModal
      v-if="petModalMode && selectedCustomer"
      :mode="petModalMode"
      :customer-id="selectedCustomer.id"
      :pet="petModalMode === 'edit' ? petModalTarget ?? undefined : undefined"
      @close="closePetModal"
      @saved="closePetModal"
    />
  </AppContainer>
</template>
