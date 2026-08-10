<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowLeft, CalendarDays, Cat, Dog, Download, Phone, Plus, Search, Users, X } from '@lucide/vue'
import type { CustomerView, PetSpecies } from '../domain'
import { bookingStatusLabels } from '../presentation/bookingStatus'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { usePensionStore } from '../usePensionStore'

const props = defineProps<{ query: string }>()
const store = usePensionStore()
const localQuery = ref('')
const selectedCustomerId = ref<string | null>(store.customerViews.value[0]?.id ?? null)
const currentPage = ref(1)
const detailsOpen = ref(false)
const petFormOpen = ref(false)
const petFormError = ref(false)
const customerFormOpen = ref(false)
const customerFormError = ref(false)
const newCustomer = ref({ firstName: '', lastName: '', phone: '' })
const newPet = ref({ name: '', species: 'dog' as PetSpecies, breed: '', note: '' })
const pageSize = 5

const searchTerm = computed(() => resolveSearchTerm(localQuery.value, props.query))
const filteredCustomers = computed(() => store.customerViews.value.filter((customer) =>
  matchesSearchTerm(searchTerm.value, [customer.firstName, customer.lastName, customer.phone, ...customer.pets.flatMap((pet) => [pet.name, pet.breed])])))
const pageCount = computed(() => Math.ceil(filteredCustomers.value.length / pageSize))
const visiblePageNumbers = computed(() => {
  const windowSize = 5
  if (pageCount.value <= windowSize) return Array.from({ length: pageCount.value }, (_, index) => index + 1)

  const firstPage = Math.min(Math.max(currentPage.value - Math.floor(windowSize / 2), 1), pageCount.value - windowSize + 1)
  return Array.from({ length: windowSize }, (_, index) => firstPage + index)
})
const pagedCustomers = computed(() => filteredCustomers.value.slice(
  (currentPage.value - 1) * pageSize,
  currentPage.value * pageSize
))
const selectedCustomer = computed<CustomerView | undefined>(() =>
  pagedCustomers.value.find((customer) => customer.id === selectedCustomerId.value) ?? pagedCustomers.value[0])

watch(searchTerm, () => {
  currentPage.value = 1
  selectedCustomerId.value = filteredCustomers.value[0]?.id ?? null
  detailsOpen.value = false
})

function selectPage(page: number) {
  if (page < 1 || page > pageCount.value) return
  currentPage.value = page
  selectedCustomerId.value = pagedCustomers.value[0]?.id ?? null
  detailsOpen.value = false
}

function selectCustomer(customerId: string) {
  selectedCustomerId.value = customerId
  detailsOpen.value = true
}

function closePetForm() {
  petFormOpen.value = false
  petFormError.value = false
  newPet.value = { name: '', species: 'dog', breed: '', note: '' }
}

function submitPet() {
  if (!selectedCustomer.value) return
  const created = store.createPet({ customerId: selectedCustomer.value.id, ...newPet.value })
  petFormError.value = !created
  if (created) closePetForm()
}

function closeCustomerForm() {
  customerFormOpen.value = false
  customerFormError.value = false
  newCustomer.value = { firstName: '', lastName: '', phone: '' }
}

function submitCustomer() {
  const created = store.createCustomer(newCustomer.value)
  customerFormError.value = !created
  if (!created) return

  const createdCustomer = store.customers.at(-1)!
  const sortedIndex = store.customerViews.value.findIndex((customer) => customer.id === createdCustomer.id)
  currentPage.value = Math.floor(sortedIndex / pageSize) + 1
  selectedCustomerId.value = createdCustomer.id
  detailsOpen.value = true
  closeCustomerForm()
}

function exportCustomers() {
  downloadCsv({
    fileName: 'kunden-und-tiere.csv',
    columns: ['Kund:in', 'Telefon', 'Tier', 'Tierart', 'Rasse', 'Hinweis'],
    rows: filteredCustomers.value.flatMap((customer) => customer.pets.length
      ? customer.pets.map((pet) => [
        `${customer.firstName} ${customer.lastName}`, customer.phone, pet.name,
        pet.species === 'dog' ? 'Hund' : 'Katze', pet.breed, pet.note
      ])
      : [[`${customer.firstName} ${customer.lastName}`, customer.phone, '', '', '', '']])
  })
}

</script>

<template>
  <main class="customers-page">
    <div class="page-heading">
      <div><p class="eyebrow">Stammdaten</p><h1>Kunden & Tiere</h1><p>Kontaktdaten, Tierprofile und Aufenthalte an einem Ort.</p></div>
      <span class="page-count"><Users :size="17" /> {{ store.customerViews.value.length }} Kund:innen</span>
    </div>

    <div class="customer-layout" :class="{ 'details-open': detailsOpen }">
      <section class="panel customer-directory">
        <header>
          <div><h2>Kundenverzeichnis</h2><p>{{ filteredCustomers.length }} Treffer</p></div>
          <div class="list-header-actions"><button class="text-button" type="button" aria-label="Kunden und Tiere als CSV exportieren" @click="exportCustomers"><Download :size="15" /> Exportieren</button><button class="text-button" @click="customerFormOpen ? closeCustomerForm() : customerFormOpen = true"><X v-if="customerFormOpen" :size="15" /><Plus v-else :size="15" /> {{ customerFormOpen ? 'Abbrechen' : 'Kund:in anlegen' }}</button></div>
        </header>
        <form v-if="customerFormOpen" class="customer-create-form" @submit.prevent="submitCustomer">
          <label>Vorname *<input v-model="newCustomer.firstName" autocomplete="given-name" /></label>
          <label>Nachname *<input v-model="newCustomer.lastName" autocomplete="family-name" /></label>
          <label>Telefon *<input v-model="newCustomer.phone" autocomplete="tel" inputmode="tel" /></label>
          <p v-if="customerFormError" class="form-error">Bitte vollständige Namen und eine gültige, noch nicht verwendete Telefonnummer angeben.</p>
          <button class="primary-button" type="submit">Kundenprofil speichern</button>
        </form>
        <label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Kundenname oder Tiername suchen …" /></label>
        <div v-if="filteredCustomers.length" class="customer-list">
          <button v-for="customer in pagedCustomers" :key="customer.id" :class="{ active: selectedCustomer?.id === customer.id }" @click="selectCustomer(customer.id)">
            <span class="customer-avatar">{{ customer.firstName[0] }}{{ customer.lastName[0] }}</span>
            <span><strong>{{ customer.firstName }} {{ customer.lastName }}</strong><small>{{ customer.pets.map((pet) => pet.name).join(', ') }}</small></span>
            <span class="pet-count">{{ customer.pets.length }}</span>
          </button>
        </div>
        <div v-else class="empty-state compact"><span><Search /></span><strong>Keine passenden Stammdaten.</strong><p>Versuche einen anderen Suchbegriff.</p></div>
        <nav v-if="pageCount > 1" class="pagination" aria-label="Seiten im Kundenverzeichnis">
          <button :disabled="currentPage === 1" aria-label="Vorherige Seite" @click="selectPage(currentPage - 1)">‹</button>
          <button v-for="page in visiblePageNumbers" :key="page" :class="{ active: page === currentPage }" :aria-current="page === currentPage ? 'page' : undefined" @click="selectPage(page)">{{ page }}</button>
          <button :disabled="currentPage === pageCount" aria-label="Nächste Seite" @click="selectPage(currentPage + 1)">›</button>
        </nav>
      </section>

      <section v-if="selectedCustomer" class="panel customer-details">
        <button class="customer-details-back" @click="detailsOpen = false"><ArrowLeft :size="17" /> Zurück zum Kundenverzeichnis</button>
        <header class="customer-profile-header">
          <span class="customer-avatar large">{{ selectedCustomer.firstName[0] }}{{ selectedCustomer.lastName[0] }}</span>
          <div><p class="eyebrow">Kundenprofil</p><h2>{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</h2><a :href="`tel:${selectedCustomer.phone.replaceAll(' ', '')}`"><Phone :size="14" /> {{ selectedCustomer.phone }}</a></div>
        </header>
        <div class="detail-section">
          <div class="section-title"><div><h3>Tiere</h3><p>{{ selectedCustomer.pets.length }} hinterlegte Tierprofile</p></div><button class="text-button" @click="petFormOpen ? closePetForm() : petFormOpen = true"><X v-if="petFormOpen" :size="15" /><Plus v-else :size="15" /> {{ petFormOpen ? 'Abbrechen' : 'Tier anlegen' }}</button></div>
          <form v-if="petFormOpen" class="pet-create-form" @submit.prevent="submitPet">
            <label>Name *<input v-model="newPet.name" autocomplete="off" /></label>
            <label>Tierart *<select v-model="newPet.species"><option value="dog">Hund</option><option value="cat">Katze</option></select></label>
            <label>Rasse *<input v-model="newPet.breed" autocomplete="off" /></label>
            <label class="wide">Hinweis<textarea v-model="newPet.note" rows="2" /></label>
            <p v-if="petFormError" class="form-error">Bitte Name und Rasse vollständig angeben.</p>
            <button class="primary-button" type="submit">Tierprofil speichern</button>
          </form>
          <div class="pet-profile-grid">
            <article v-for="pet in selectedCustomer.pets" :key="pet.id">
              <span class="pet-avatar" :style="{ background: pet.color }">{{ pet.initials }}</span>
              <div><strong>{{ pet.name }}</strong><span><Dog v-if="pet.species === 'dog'" :size="13" /><Cat v-else :size="13" /> {{ pet.breed }}</span></div>
              <p v-if="pet.note">{{ pet.note }}</p>
            </article>
          </div>
        </div>
        <div class="detail-section booking-history">
          <div class="section-title"><div><h3>Aufenthalte</h3><p>Aktuelle und vergangene Buchungen</p></div><CalendarDays :size="19" /></div>
          <article v-for="booking in selectedCustomer.bookings" :key="booking.id">
            <div><strong>{{ booking.pet.name }}</strong><span>{{ booking.room.name }}</span></div>
            <div><strong>{{ booking.arrival }} Uhr</strong><span>bis {{ booking.departure }}</span></div>
            <span class="booking-status" :class="booking.status">{{ bookingStatusLabels[booking.status] }}</span>
          </article>
          <div v-if="!selectedCustomer.bookings.length" class="empty-state compact"><strong>Noch keine Aufenthalte.</strong></div>
        </div>
      </section>
    </div>
  </main>
</template>
