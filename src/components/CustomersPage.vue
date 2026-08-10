<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowLeft, Cat, Dog, Download, Mail, Pencil, Phone, Plus, Search, ShieldAlert, Stethoscope, Trash2, Users, X } from '@lucide/vue'
import type { CustomerUpdate, CustomerView, EmergencyContact, PetSpecies } from '../domain'
import { bookingStatusLabels } from '../presentation/bookingStatus'
import { toTelephoneHref } from '../presentation/phoneLink'
import { usePagination } from '../composables/usePagination'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { downloadCsv } from '../shared/csvExport'
import { usePensionStore } from '../usePensionStore'
import { MAX_ALLERGY_NOTE_LENGTH, MAX_FEEDING_PLAN_LENGTH, MAX_MEDICATION_PLAN_LENGTH, MAX_PET_NOTE_LENGTH, MAX_VACCINATION_STATUS_LENGTH } from '../domain/petProfile'

const store = usePensionStore()
const localQuery = ref('')
const selectedCustomerId = ref<string | null>(store.customerViews.value[0]?.id ?? null)
const detailsOpen = ref(false)
const petFormOpen = ref(false)
const petFormError = ref(false)
const customerFormOpen = ref(false)
const customerFormError = ref(false)
const newCustomer = ref({ firstName: '', lastName: '', email: '', phone: '' })
const customerEditOpen = ref(false)
const customerEditError = ref(false)
const editedCustomer = ref<CustomerUpdate>({ firstName: '', lastName: '', email: '', phone: '' })
const newPet = ref({ name: '', species: 'dog' as PetSpecies, breed: '', note: '', feedingPlan: '', medicationPlan: '', allergyNote: '', vaccinationStatus: '', veterinaryPracticeName: '', veterinaryPhone: '' })
const editingPetId = ref<string | null>(null)
const petEditError = ref(false)
const editedPet = ref({ name: '', breed: '', note: '', feedingPlan: '', medicationPlan: '', allergyNote: '', vaccinationStatus: '', veterinaryPracticeName: '', veterinaryPhone: '' })
const petRemovalId = ref<string | null>(null)
const veterinaryContactRemovalId = ref<string | null>(null)
const emergencyContactOpen = ref(false)
const emergencyContactError = ref(false)
const emergencyContact = ref<EmergencyContact>({ name: '', phone: '' })
const emergencyContactRemovalOpen = ref(false)
const pageSize = 5
const isCompactPagination = ref(false)
const compactPaginationQuery = typeof window === 'undefined' ? null : window.matchMedia('(max-width: 680px)')

const searchTerm = computed(() => resolveSearchTerm(localQuery.value))
const filteredCustomers = computed(() => store.customerViews.value.filter((customer) =>
  matchesSearchTerm(searchTerm.value, [customer.firstName, customer.lastName, customer.email, customer.phone, ...customer.pets.flatMap((pet) => [pet.name, pet.breed])])))
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

function selectPage(page: number) {
  selectPaginationPage(page)
  selectedCustomerId.value = pagedCustomers.value[0]?.id ?? null
  detailsOpen.value = false
}

function selectCustomer(customerId: string) {
  selectedCustomerId.value = customerId
  detailsOpen.value = true
  emergencyContactOpen.value = false
  emergencyContactError.value = false
  emergencyContactRemovalOpen.value = false
  veterinaryContactRemovalId.value = null
  customerEditOpen.value = false
  customerEditError.value = false
}

function openCustomerEdit() {
  if (!selectedCustomer.value) return
  const { firstName, lastName, email, phone } = selectedCustomer.value
  editedCustomer.value = { firstName, lastName, email, phone }
  customerEditError.value = false
  customerEditOpen.value = true
}

function closeCustomerEdit() {
  customerEditOpen.value = false
  customerEditError.value = false
}

function submitCustomerEdit() {
  if (!selectedCustomer.value) return
  const saved = store.updateCustomer(selectedCustomer.value.id, editedCustomer.value)
  customerEditError.value = !saved
  if (saved) closeCustomerEdit()
}

function openEmergencyContactForm() {
  if (!selectedCustomer.value) return
  emergencyContact.value = selectedCustomer.value.emergencyContact
    ? { ...selectedCustomer.value.emergencyContact }
    : { name: '', phone: '' }
  emergencyContactError.value = false
  emergencyContactOpen.value = true
}

function submitEmergencyContact() {
  if (!selectedCustomer.value) return
  const saved = store.updateCustomerEmergencyContact(selectedCustomer.value.id, emergencyContact.value)
  emergencyContactError.value = !saved
  if (saved) emergencyContactOpen.value = false
}

function removeEmergencyContact() {
  if (!selectedCustomer.value) return
  if (store.removeCustomerEmergencyContact(selectedCustomer.value.id)) {
    emergencyContactRemovalOpen.value = false
  }
}

function closePetForm() {
  petFormOpen.value = false
  petFormError.value = false
  newPet.value = { name: '', species: 'dog', breed: '', note: '', feedingPlan: '', medicationPlan: '', allergyNote: '', vaccinationStatus: '', veterinaryPracticeName: '', veterinaryPhone: '' }
}

function openPetEdit(pet: CustomerView['pets'][number]) {
  editingPetId.value = pet.id
  editedPet.value = { name: pet.name, breed: pet.breed, note: pet.note ?? '', feedingPlan: pet.feedingPlan ?? '', medicationPlan: pet.medicationPlan ?? '', allergyNote: pet.allergyNote ?? '', vaccinationStatus: pet.vaccinationStatus ?? '', veterinaryPracticeName: pet.veterinaryContact?.practiceName ?? '', veterinaryPhone: pet.veterinaryContact?.phone ?? '' }
  petEditError.value = false
}

function closePetEdit() {
  editingPetId.value = null
  petEditError.value = false
}

function canRemovePet(petId: string) {
  return !store.bookingViews.value.some((booking) => booking.pet.id === petId)
}

function removePet(petId: string) {
  if (store.removePet(petId)) petRemovalId.value = null
}

function removeVeterinaryContact(petId: string) {
  if (store.removePetVeterinaryContact(petId)) veterinaryContactRemovalId.value = null
}

function submitPetEdit(petId: string) {
  const { veterinaryPracticeName, veterinaryPhone, ...input } = editedPet.value
  const saved = store.updatePet(petId, {
    ...input,
    ...(veterinaryPracticeName || veterinaryPhone ? { veterinaryContact: { practiceName: veterinaryPracticeName, phone: veterinaryPhone } } : {})
  })
  petEditError.value = !saved
  if (saved) closePetEdit()
}

function submitPet() {
  if (!selectedCustomer.value) return
  const { veterinaryPracticeName, veterinaryPhone, ...input } = newPet.value
  const created = store.createPet({
    customerId: selectedCustomer.value.id,
    ...input,
    ...(veterinaryPracticeName || veterinaryPhone ? { veterinaryContact: { practiceName: veterinaryPracticeName, phone: veterinaryPhone } } : {})
  })
  petFormError.value = !created
  if (created) closePetForm()
}

function closeCustomerForm() {
  customerFormOpen.value = false
  customerFormError.value = false
  newCustomer.value = { firstName: '', lastName: '', email: '', phone: '' }
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
    columns: ['Kund:in', 'E-Mail', 'Telefon', 'Notfallkontakt', 'Tier', 'Tierart', 'Rasse', 'Hinweis', 'Fütterungsplan', 'Medikationsplan', 'Allergien & Unverträglichkeiten', 'Impfstatus', 'Tierarztpraxis', 'Tierarzttelefon'],
    rows: filteredCustomers.value.flatMap((customer) => customer.pets.length
      ? customer.pets.map((pet) => [
        `${customer.firstName} ${customer.lastName}`, customer.email, customer.phone, customer.emergencyContact ? `${customer.emergencyContact.name} (${customer.emergencyContact.phone})` : '', pet.name,
        pet.species === 'dog' ? 'Hund' : 'Katze', pet.breed, pet.note, pet.feedingPlan, pet.medicationPlan, pet.allergyNote, pet.vaccinationStatus, pet.veterinaryContact?.practiceName, pet.veterinaryContact?.phone
      ])
      : [[`${customer.firstName} ${customer.lastName}`, customer.email, customer.phone, customer.emergencyContact ? `${customer.emergencyContact.name} (${customer.emergencyContact.phone})` : '', '', '', '', '', '', '', '', '', '', '']])
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
          <label>E-Mail *<input v-model="newCustomer.email" type="email" autocomplete="email" /></label>
          <label>Telefon *<input v-model="newCustomer.phone" autocomplete="tel" inputmode="tel" /></label>
          <p v-if="customerFormError" class="form-error">Bitte vollständige Namen sowie eine gültige, noch nicht verwendete E-Mail-Adresse und Telefonnummer angeben.</p>
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
          <button :disabled="currentPage === 1" aria-label="Erste Seite" @click="selectPage(1)">«</button>
          <button :disabled="currentPage === 1" aria-label="Vorherige Seite" @click="selectPage(currentPage - 1)">‹</button>
          <template v-for="item in visiblePageItems" :key="item">
            <span v-if="typeof item === 'string'" class="pagination-ellipsis" aria-hidden="true">…</span>
            <button v-else :class="{ active: item === currentPage }" :aria-current="item === currentPage ? 'page' : undefined" @click="selectPage(item)">{{ item }}</button>
          </template>
          <button :disabled="currentPage === pageCount" aria-label="Nächste Seite" @click="selectPage(currentPage + 1)">›</button>
          <button :disabled="currentPage === pageCount" aria-label="Letzte Seite" @click="selectPage(pageCount)">»</button>
        </nav>
      </section>

      <section v-if="selectedCustomer" class="panel customer-details">
        <button class="customer-details-back" @click="detailsOpen = false"><ArrowLeft :size="17" /> Zurück zum Kundenverzeichnis</button>
        <header class="customer-profile-header">
          <span class="customer-avatar large">{{ selectedCustomer.firstName[0] }}{{ selectedCustomer.lastName[0] }}</span>
          <div><p class="eyebrow">Kundenprofil</p><h2>{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</h2><a :href="`mailto:${selectedCustomer.email}`"><Mail :size="14" /> {{ selectedCustomer.email }}</a><a :href="toTelephoneHref(selectedCustomer.phone)"><Phone :size="14" /> {{ selectedCustomer.phone }}</a></div>
          <button v-if="!customerEditOpen" class="text-button" type="button" @click="openCustomerEdit"><Pencil :size="15" /> Kontaktdaten bearbeiten</button>
        </header>
        <form v-if="customerEditOpen" class="customer-create-form customer-edit-form" @submit.prevent="submitCustomerEdit">
          <label>Vorname *<input v-model="editedCustomer.firstName" autocomplete="given-name" /></label>
          <label>Nachname *<input v-model="editedCustomer.lastName" autocomplete="family-name" /></label>
          <label>E-Mail *<input v-model="editedCustomer.email" type="email" autocomplete="email" /></label>
          <label>Telefon *<input v-model="editedCustomer.phone" autocomplete="tel" inputmode="tel" /></label>
          <p v-if="customerEditError" class="form-error">Bitte vollständige Namen sowie eine gültige, noch nicht verwendete E-Mail-Adresse und Telefonnummer angeben.</p>
          <div class="pet-edit-actions"><button class="secondary-button" type="button" @click="closeCustomerEdit">Abbrechen</button><button class="primary-button" type="submit">Kontaktdaten speichern</button></div>
        </form>
        <div class="detail-section emergency-contact-section">
          <div class="section-title"><div><h3><ShieldAlert :size="15" /> Notfallkontakt</h3><p>Alternative Ansprechperson während eines Aufenthalts</p></div><div class="emergency-contact-actions"><button v-if="selectedCustomer.emergencyContact" class="text-button danger-text-button" type="button" @click="emergencyContactRemovalOpen = true">Entfernen</button><button class="text-button" type="button" @click="emergencyContactOpen ? emergencyContactOpen = false : openEmergencyContactForm()"><X v-if="emergencyContactOpen" :size="15" /><Plus v-else-if="!selectedCustomer.emergencyContact" :size="15" /> {{ emergencyContactOpen ? 'Abbrechen' : selectedCustomer.emergencyContact ? 'Bearbeiten' : 'Hinterlegen' }}</button></div></div>
          <form v-if="emergencyContactOpen" class="emergency-contact-form" @submit.prevent="submitEmergencyContact">
            <label>Name *<input v-model="emergencyContact.name" autocomplete="name" /></label>
            <label>Telefon *<input v-model="emergencyContact.phone" autocomplete="tel" inputmode="tel" /></label>
            <p v-if="emergencyContactError" class="form-error">Bitte Name und gültige Telefonnummer angeben.</p>
            <button class="primary-button" type="submit">Notfallkontakt speichern</button>
          </form>
          <div v-else-if="emergencyContactRemovalOpen && selectedCustomer.emergencyContact" class="emergency-contact-removal" role="alert">
            <p>Notfallkontakt von {{ selectedCustomer.firstName }} entfernen?</p>
            <div><button class="secondary-button" type="button" @click="emergencyContactRemovalOpen = false">Behalten</button><button class="danger-button" type="button" @click="removeEmergencyContact">Jetzt entfernen</button></div>
          </div>
          <a v-else-if="selectedCustomer.emergencyContact" class="emergency-contact-value" :href="toTelephoneHref(selectedCustomer.emergencyContact.phone)"><Phone :size="15" /><span><strong>{{ selectedCustomer.emergencyContact.name }}</strong><small>{{ selectedCustomer.emergencyContact.phone }}</small></span></a>
          <p v-else class="empty-contact">Noch kein Notfallkontakt hinterlegt.</p>
        </div>
        <div class="detail-section">
          <div class="section-title"><div><h3>Tiere</h3><p>{{ selectedCustomer.pets.length }} hinterlegte Tierprofile</p></div><button class="text-button" @click="petFormOpen ? closePetForm() : petFormOpen = true"><X v-if="petFormOpen" :size="15" /><Plus v-else :size="15" /> {{ petFormOpen ? 'Abbrechen' : 'Tier anlegen' }}</button></div>
          <form v-if="petFormOpen" class="pet-create-form" @submit.prevent="submitPet">
            <label>Name *<input v-model="newPet.name" autocomplete="off" /></label>
            <label>Tierart *<select v-model="newPet.species"><option value="dog">Hund</option><option value="cat">Katze</option></select></label>
            <label>Rasse *<input v-model="newPet.breed" autocomplete="off" /></label>
            <label class="wide">Hinweis <small>optional, max. {{ MAX_PET_NOTE_LENGTH }} Zeichen</small><textarea v-model="newPet.note" :maxlength="MAX_PET_NOTE_LENGTH" rows="2" /></label>
            <label class="wide">Fütterungsplan <small>optional, max. {{ MAX_FEEDING_PLAN_LENGTH }} Zeichen</small><textarea v-model="newPet.feedingPlan" :maxlength="MAX_FEEDING_PLAN_LENGTH" rows="2" placeholder="z. B. Menge, Zeiten und Unverträglichkeiten" /></label>
            <label class="wide">Medikationsplan <small>optional, max. {{ MAX_MEDICATION_PLAN_LENGTH }} Zeichen</small><textarea v-model="newPet.medicationPlan" :maxlength="MAX_MEDICATION_PLAN_LENGTH" rows="2" placeholder="z. B. Medikament, Menge und Uhrzeit" /></label>
            <label class="wide">Allergien & Unverträglichkeiten <small>optional, max. {{ MAX_ALLERGY_NOTE_LENGTH }} Zeichen</small><textarea v-model="newPet.allergyNote" :maxlength="MAX_ALLERGY_NOTE_LENGTH" rows="2" placeholder="z. B. Futtermittel oder Stoffe, die vermieden werden müssen" /></label>
            <label class="wide">Impfstatus <small>optional, max. {{ MAX_VACCINATION_STATUS_LENGTH }} Zeichen</small><textarea v-model="newPet.vaccinationStatus" :maxlength="MAX_VACCINATION_STATUS_LENGTH" rows="2" placeholder="z. B. Impfpass geprüft, gültig bis …" /></label>
            <label>Tierarztpraxis <small>optional</small><input v-model="newPet.veterinaryPracticeName" autocomplete="organization" placeholder="z. B. Tierarztpraxis am Park" /></label>
            <label>Tierarzttelefon <small>optional</small><input v-model="newPet.veterinaryPhone" autocomplete="tel" inputmode="tel" placeholder="z. B. 030 123 45 67" /></label>
            <p v-if="petFormError" class="form-error">Bitte Name und Rasse vollständig angeben; operative Angaben dürfen maximal {{ MAX_PET_NOTE_LENGTH }} Zeichen lang sein.</p>
            <button class="primary-button" type="submit">Tierprofil speichern</button>
          </form>
          <div class="pet-profile-grid">
            <article v-for="pet in selectedCustomer.pets" :key="pet.id" class="pet-profile-card" :class="pet.species">
              <span class="pet-profile-avatar" :style="{ background: pet.color }" aria-hidden="true">
                <Dog v-if="pet.species === 'dog'" :size="20" />
                <Cat v-else :size="20" />
              </span>
              <div class="pet-profile-summary">
                <strong>{{ pet.name }}</strong>
                <span class="pet-breed">{{ pet.breed }}</span>
                <span class="pet-species-badge"><Dog v-if="pet.species === 'dog'" :size="12" /><Cat v-else :size="12" /> {{ pet.species === 'dog' ? 'Hund' : 'Katze' }}</span>
              </div>
              <div v-if="editingPetId !== pet.id" class="pet-card-actions">
                <button class="pet-edit-button" type="button" :aria-label="`${pet.name} bearbeiten`" @click="openPetEdit(pet)"><Pencil :size="14" /> Bearbeiten</button>
                <button v-if="canRemovePet(pet.id)" class="pet-remove-button" type="button" :aria-label="`${pet.name} entfernen`" @click="petRemovalId = pet.id"><Trash2 :size="14" /> Entfernen</button>
              </div>
              <form v-else class="pet-edit-form" @submit.prevent="submitPetEdit(pet.id)">
                <label>Name *<input v-model="editedPet.name" /></label>
                <label>Rasse *<input v-model="editedPet.breed" /></label>
                <label class="wide">Hinweis <small>optional, max. {{ MAX_PET_NOTE_LENGTH }} Zeichen</small><textarea v-model="editedPet.note" :maxlength="MAX_PET_NOTE_LENGTH" rows="2" /></label>
                <label class="wide">Fütterungsplan <small>optional, max. {{ MAX_FEEDING_PLAN_LENGTH }} Zeichen</small><textarea v-model="editedPet.feedingPlan" :maxlength="MAX_FEEDING_PLAN_LENGTH" rows="2" /></label>
                <label class="wide">Medikationsplan <small>optional, max. {{ MAX_MEDICATION_PLAN_LENGTH }} Zeichen</small><textarea v-model="editedPet.medicationPlan" :maxlength="MAX_MEDICATION_PLAN_LENGTH" rows="2" /></label>
                <label class="wide">Allergien & Unverträglichkeiten <small>optional, max. {{ MAX_ALLERGY_NOTE_LENGTH }} Zeichen</small><textarea v-model="editedPet.allergyNote" :maxlength="MAX_ALLERGY_NOTE_LENGTH" rows="2" /></label>
                <label class="wide">Impfstatus <small>optional, max. {{ MAX_VACCINATION_STATUS_LENGTH }} Zeichen</small><textarea v-model="editedPet.vaccinationStatus" :maxlength="MAX_VACCINATION_STATUS_LENGTH" rows="2" /></label>
                <label>Tierarztpraxis <small>optional</small><input v-model="editedPet.veterinaryPracticeName" autocomplete="organization" /></label>
                <label>Tierarzttelefon <small>optional</small><input v-model="editedPet.veterinaryPhone" autocomplete="tel" inputmode="tel" /></label>
                <p v-if="petEditError" class="form-error">Bitte Name und Rasse vollständig angeben; operative Angaben dürfen maximal {{ MAX_PET_NOTE_LENGTH }} Zeichen lang sein.</p>
                <div class="pet-edit-actions"><button class="secondary-button" type="button" @click="closePetEdit">Abbrechen</button><button class="primary-button" type="submit">Änderungen speichern</button></div>
              </form>
              <div v-if="petRemovalId === pet.id" class="pet-removal-confirmation" role="alert">
                <p><strong>{{ pet.name }} entfernen?</strong> Für dieses Tier gibt es noch keine Aufenthalte.</p>
                <div><button class="secondary-button" type="button" @click="petRemovalId = null">Behalten</button><button class="danger-button" type="button" @click="removePet(pet.id)">Jetzt entfernen</button></div>
              </div>
              <p v-if="editingPetId !== pet.id && pet.note">{{ pet.note }}</p>
              <p v-if="editingPetId !== pet.id && pet.feedingPlan" class="pet-medication-plan"><strong>Fütterung</strong>{{ pet.feedingPlan }}</p>
              <p v-if="editingPetId !== pet.id && pet.medicationPlan" class="pet-medication-plan"><strong>Medikation</strong>{{ pet.medicationPlan }}</p>
              <p v-if="editingPetId !== pet.id && pet.allergyNote" class="pet-medication-plan"><strong>Allergien & Unverträglichkeiten</strong>{{ pet.allergyNote }}</p>
              <p v-if="editingPetId !== pet.id && pet.vaccinationStatus" class="pet-medication-plan"><strong>Impfstatus</strong>{{ pet.vaccinationStatus }}</p>
              <template v-if="editingPetId !== pet.id && pet.veterinaryContact">
                <div v-if="veterinaryContactRemovalId === pet.id" class="pet-removal-confirmation" role="alert">
                  <p><strong>Tierarztkontakt von {{ pet.name }} entfernen?</strong> Praxis und Telefonnummer werden aus diesem Tierprofil gelöscht.</p>
                  <div><button class="secondary-button" type="button" @click="veterinaryContactRemovalId = null">Behalten</button><button class="danger-button" type="button" @click="removeVeterinaryContact(pet.id)">Jetzt entfernen</button></div>
                </div>
                <div v-else class="veterinary-contact-row">
                  <a class="pet-medication-plan veterinary-contact" :href="toTelephoneHref(pet.veterinaryContact.phone)"><Stethoscope :size="15" /><span><strong>Tierarztpraxis</strong>{{ pet.veterinaryContact.practiceName }} · {{ pet.veterinaryContact.phone }}</span></a>
                  <button class="pet-remove-button" type="button" :aria-label="`Tierarztkontakt von ${pet.name} entfernen`" @click="veterinaryContactRemovalId = pet.id"><Trash2 :size="14" /> Entfernen</button>
                </div>
              </template>
            </article>
          </div>
        </div>
        <div class="detail-section booking-history">
          <div class="section-title"><div><h3>Aufenthalte</h3><p>Aktuelle und vergangene Buchungen</p></div><RouterLink class="text-button customer-booking-link" :to="{ path: '/buchungen', query: { customerId: selectedCustomer.id } }"><Plus :size="15" /> Jetzt Buchung anlegen</RouterLink></div>
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
