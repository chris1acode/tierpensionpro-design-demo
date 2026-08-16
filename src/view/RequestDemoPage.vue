<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CheckCircle2, Plus, Trash2 } from '@lucide/vue'
import type { NewBookingRequest } from '../domain'
import { usePensionStore } from '../usePensionStore'
import { calculateTariffReservationPrice } from '../domain/stayPrice'
import { formatEuroCents } from '../presentation/currencyFormat'

const store = usePensionStore()
const sent = ref(false)
const error = ref('')
const form = reactive<NewBookingRequest>({
  customerFirstName: '', customerLastName: '', contactEmail: '', phone: '', petName: '',
  species: 'dog', animals: [{ name: '', species: 'dog' }], tariffId: store.settings.tariffs[0]?.id ?? '',
  arrivalDate: '', arrival: store.settings.checkInFrom, departure: '', note: ''
})

const pricePreview = computed(() => calculateTariffReservationPrice(
  { arrivalDate: form.arrivalDate, arrival: form.arrival, departure: form.departure },
  (form.animals ?? []).map((animal, index) => ({ id: `preview-${index}` })),
  store.settings.tariffs.find((tariff) => tariff.id === form.tariffId)
))

function addAnimal(): void {
  form.animals!.push({ name: '', species: 'dog' })
}

function removeAnimal(index: number): void {
  if (form.animals!.length > 1) form.animals!.splice(index, 1)
}

function submit(): void {
  error.value = ''
  const primaryAnimal = form.animals?.[0]
  if (primaryAnimal) {
    form.petName = primaryAnimal.name
    form.species = primaryAnimal.species
  }
  if (store.submitBookingRequest(form)) {
    sent.value = true
    return
  }
  error.value = store.settings.requestsEnabled
    ? 'Bitte prüfe deine Angaben. Anreise, Uhrzeit und Abreise werden benötigt.'
    : 'Die Online-Anfrage ist derzeit nicht verfügbar.'
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f5f2] px-4 py-8 sm:px-6 sm:py-12">
    <div class="mx-auto max-w-[980px]">
      <header class="mb-6 flex items-center gap-3 text-app-text"><span><strong class="block text-lg">{{ store.settings.businessName }}</strong><small class="text-app-muted">Unverbindliche Betreuungsanfrage</small></span></header>
      <div class="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
        <section class="overflow-hidden rounded-2xl border border-app-border bg-white shadow-[0_12px_32px_rgba(36,33,31,.08)]">
          <div class="px-6 py-6 sm:px-9"><h1 class="mb-2 mt-1 text-[28px] font-bold [font-family:'Manrope',sans-serif]">Wir freuen uns auf euch.</h1><p class="m-0 text-sm leading-relaxed text-app-muted">Sende uns deinen Wunschtermin. Wir prüfen die Verfügbarkeit und melden uns persönlich bei dir.</p></div>
          <div v-if="sent" class="px-6 py-12 text-center sm:px-9"><CheckCircle2 class="mx-auto mb-4 text-[#3b776d]" :size="46" /><h2 class="m-0 text-xl font-bold">Anfrage erfolgreich gesendet</h2><p class="mx-auto mb-0 mt-3 max-w-md text-sm leading-relaxed text-app-muted">Vielen Dank! {{ store.settings.businessName }} meldet sich mit einer Rückmeldung bei dir.</p></div>
          <form v-else class="grid gap-5 px-6 py-7 sm:grid-cols-2 sm:px-9" @submit.prevent="submit">
            <h2 class="col-span-full m-0 text-lg font-bold">Deine Kontaktdaten</h2>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Vorname<input v-model.trim="form.customerFirstName" class="field" autocomplete="given-name" required /></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Nachname<input v-model.trim="form.customerLastName" class="field" autocomplete="family-name" required /></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">E-Mail-Adresse<input v-model.trim="form.contactEmail" class="field" type="email" autocomplete="email" required /></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Telefon<input v-model.trim="form.phone" class="field" type="tel" autocomplete="tel" required /></label>
            <div class="col-span-full mt-2 flex items-center justify-between gap-3 border-t border-app-border pt-5"><h2 class="m-0 text-lg font-bold">Deine Tiere und Wunschtermin</h2><button class="inline-flex items-center gap-1 rounded-md border border-app-border bg-white px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-[#fff3eb]" type="button" @click="addAnimal"><Plus :size="15" /> Tier hinzufügen</button></div>
            <fieldset v-for="(animal, index) in form.animals" :key="index" class="col-span-full grid grid-cols-1 gap-5 rounded-xl border border-app-border p-4 sm:grid-cols-2"><legend class="px-1 text-sm font-bold text-app-muted">{{ form.animals!.length === 1 ? 'Tier' : `Tier ${index + 1}` }}</legend><label class="grid gap-1.5 text-sm font-bold text-app-muted">Name des Tieres<input v-model.trim="animal.name" class="field" required /></label><label class="grid gap-1.5 text-sm font-bold text-app-muted">Tierart<select v-model="animal.species" class="field"><option value="dog">Hund</option><option value="cat">Katze</option></select></label><button v-if="form.animals!.length > 1" class="justify-self-start text-xs font-bold text-[#a23838] hover:underline sm:col-span-2" type="button" @click="removeAnimal(index)"><Trash2 class="mr-1 inline" :size="14" />Tier entfernen</button></fieldset>
            <label class="col-span-full grid gap-1.5 text-sm font-bold text-app-muted">Gewünschter Tarif<select v-model="form.tariffId" class="field" required><option value="" disabled>Tarif auswählen</option><option v-for="tariff in store.settings.tariffs" :key="tariff.id" :value="tariff.id">{{ tariff.name }}</option></select></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Anreisedatum<input v-model="form.arrivalDate" class="field" type="date" required /></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Gewünschte Ankunftszeit<input v-model="form.arrival" class="field" type="time" required /></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Abreisedatum<input v-model="form.departure" class="field" type="date" required /></label>
            <label class="grid gap-1.5 text-sm font-bold text-app-muted">Hinweis <span class="font-normal">(optional)</span><textarea v-model.trim="form.note" class="field min-h-[78px] resize-y" maxlength="1000" /></label>
            <p v-if="error" class="col-span-full m-0 rounded-lg bg-[#fdf2f2] px-3 py-2 text-sm text-[#a23838]" role="alert">{{ error }}</p>
            <div class="col-span-full flex flex-wrap items-center justify-between gap-3 border-t border-app-border pt-5"><small class="max-w-md text-xs leading-relaxed text-app-muted">Mit dem Absenden erklärst du dich damit einverstanden, dass wir dich zur Bearbeitung deiner Anfrage kontaktieren.</small><button class="rounded-lg border-0 bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50" :disabled="!store.settings.requestsEnabled" type="submit">Anfrage senden</button></div>
          </form>
        </section>
        <aside v-if="!sent" class="rounded-2xl border border-app-border bg-white p-5 shadow-[0_12px_32px_rgba(36,33,31,.08)] lg:sticky lg:top-8">
          <h2 class="m-0 mb-3 text-sm font-bold text-app-text">Preisübersicht</h2>
          <div v-if="pricePreview" class="grid gap-2">
            <div v-for="(stay, index) in pricePreview.stays" :key="stay.bookingId" class="flex items-center justify-between gap-2 text-xs text-app-muted"><span>{{ form.animals?.[index]?.name || `Tier ${index + 1}` }} · {{ stay.billableDays }} {{ stay.billableDays === 1 ? 'Tag' : 'Tage' }}</span><span class="font-bold text-app-text">{{ formatEuroCents(stay.totalCents) }}</span></div>
            <div class="mt-2 flex items-center justify-between gap-2 border-t border-app-border pt-3"><span class="text-sm font-bold text-app-text">Gesamt</span><span class="text-lg font-bold text-primary">{{ formatEuroCents(pricePreview.totalCents) }}</span></div>
            <small class="text-[11px] leading-relaxed text-app-muted">Unverbindliche Schätzung auf Basis des gewählten Tarifs.</small>
          </div>
          <p v-else class="m-0 text-xs leading-relaxed text-app-muted">Wähle Tarif, Anreise- und Abreisedatum, um die voraussichtlichen Kosten zu sehen.</p>
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>
.field { @apply h-[42px] w-full rounded-lg border border-app-border bg-white px-3 text-[15px] font-normal text-app-text outline-none focus:border-primary focus:ring-2 focus:ring-[#f2c3a7]; }
textarea.field { @apply h-auto py-2; }
</style>
