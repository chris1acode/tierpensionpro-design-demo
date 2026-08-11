<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Banknote, Building2, Cat, Clock3, Dog, Inbox, Pencil, Plus, Save, Trash2 } from '@lucide/vue'
import type { PensionSettingsUpdate, PetSpecies, Room } from '../domain'
import { useSynchronizedDraft } from '../composables/useSynchronizedDraft'
import { arePensionSettingsEqual } from '../domain/pensionSettings'
import { usePensionStore } from '../usePensionStore'
import RoomFormModal from './RoomFormModal.vue'

const store = usePensionStore()
const route = useRoute()
const error = ref('')
const roomError = ref('')
const roomModalMode = ref<'create' | 'edit' | null>(null)
const roomBeingEdited = ref<Room | null>(null)

const activeTab = computed<'general' | 'rates' | 'rooms'>(() => {
  if (route.name === 'settings-rates') return 'rates'
  if (route.name === 'settings-rooms') return 'rooms'
  return 'general'
})

function settingsDraft(): PensionSettingsUpdate {
  const { id: _id, ...values } = store.settings
  return { ...values, dailyPetRates: values.dailyPetRates.map((rate) => ({ ...rate })) }
}

const { draft, resetDraft } = useSynchronizedDraft(
  settingsDraft,
  () => ({ ...store.settings }),
  () => { error.value = '' }
)

const hasUnsavedSettings = computed(() => !arePensionSettingsEqual(draft.value, settingsDraft()))

function save() {
  error.value = ''
  if (!store.updateSettings(draft.value)) {
    error.value = 'Bitte prüfe Kontaktdaten und Zeiten. Das Check-in-Fenster muss vor der Check-out-Zeit liegen.'
  }
}

function discard() {
  resetDraft()
  error.value = ''
}

function openRoomCreate(): void {
  roomBeingEdited.value = null
  roomModalMode.value = 'create'
}

function openRoomEdit(room: Room): void {
  roomBeingEdited.value = room
  roomModalMode.value = 'edit'
}

function closeRoomModal(): void {
  roomModalMode.value = null
  roomBeingEdited.value = null
}

function removeRoom(room: Room): void {
  roomError.value = ''
  if (!store.deleteRoom(room.id)) {
    roomError.value = 'Zimmer mit bestehenden Buchungen können nicht entfernt werden.'
  }
}

function roomHasBookings(roomId: string): boolean {
  return store.bookingViews.value.some((booking) => booking.roomId === roomId)
}

function dailyRate(species: PetSpecies) {
  return draft.value.dailyPetRates.find((rate) => rate.species === species)
}

function rateInEuros(species: PetSpecies): string {
  const amountCents = dailyRate(species)?.amountCents ?? 0
  return (amountCents / 100).toFixed(2)
}

function updateRate(species: PetSpecies, value: string) {
  const rate = dailyRate(species)
  if (!rate) return

  const parsed = Number(value.replace(',', '.'))
  rate.amountCents = Number.isFinite(parsed) ? Math.round(parsed * 100) : 0
}
</script>

<template>
  <main class="settings-page">
    <div class="page-heading">
      <div><p class="eyebrow">Betrieb konfigurieren</p><h1>Einstellungen</h1><p>Kontaktdaten, Tarife und Zimmer zentral verwalten.</p></div>
    </div>

    <nav class="settings-tabs" aria-label="Einstellungsbereiche">
      <RouterLink to="/einstellungen/allgemein">Allgemein</RouterLink>
      <RouterLink to="/einstellungen/tarife">Tarife</RouterLink>
      <RouterLink to="/einstellungen/unterbringung">Unterbringung</RouterLink>
    </nav>

    <form v-if="activeTab !== 'rooms'" class="settings-layout" @submit.prevent="save">
      <template v-if="activeTab === 'general'">
        <section class="panel settings-panel">
          <header><span class="settings-icon"><Building2 :size="20" /></span><div><h2>Pensionsprofil</h2><p>Diese Angaben dienen als betriebliche Stammdaten.</p></div></header>
          <div class="settings-fields">
            <label class="wide">Name der Pension<input v-model.trim="draft.businessName" required /></label>
            <label>E-Mail<input v-model.trim="draft.contactEmail" type="email" required /></label>
            <label>Telefon<input v-model.trim="draft.contactPhone" type="tel" required /></label>
          </div>
        </section>

        <section class="panel settings-panel">
          <header><span class="settings-icon teal"><Clock3 :size="20" /></span><div><h2>An- und Abreisezeiten</h2><p>Das Zeitfenster gilt für die tägliche Übergabeplanung.</p></div></header>
          <div class="settings-fields time-fields">
            <label>Check-in ab<input v-model="draft.checkInFrom" type="time" required /></label>
            <label>Check-in bis<input v-model="draft.checkInUntil" type="time" required /></label>
            <label>Check-out bis<input v-model="draft.checkOutUntil" type="time" required /></label>
          </div>
        </section>

        <section class="panel settings-panel">
          <header><span class="settings-icon teal"><Inbox :size="20" /></span><div><h2>Anfragen</h2><p>Externe Buchungsanfragen empfangen und im Menü anzeigen.</p></div></header>
          <div class="settings-fields">
            <label class="wide checkbox-field"><input v-model="draft.requestsEnabled" type="checkbox" /> Anfragen aktivieren</label>
          </div>
        </section>
      </template>

      <section v-else class="panel settings-panel">
        <header><span class="settings-icon amber"><Banknote :size="20" /></span><div><h2>Preisliste</h2><p>Grundpreis je Tier und angefangenen Betreuungstag. Alle Beträge inklusive Mehrwertsteuer.</p></div></header>
        <div class="settings-fields price-fields">
          <label>Hund pro Tag
            <span class="currency-input"><input :value="rateInEuros('dog')" inputmode="decimal" min="0.01" step="0.01" type="number" required aria-label="Tagespreis für Hunde in Euro" @input="updateRate('dog', ($event.target as HTMLInputElement).value)" /><span>€</span></span>
          </label>
          <label>Katze pro Tag
            <span class="currency-input"><input :value="rateInEuros('cat')" inputmode="decimal" min="0.01" step="0.01" type="number" required aria-label="Tagespreis für Katzen in Euro" @input="updateRate('cat', ($event.target as HTMLInputElement).value)" /><span>€</span></span>
          </label>
        </div>
      </section>

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="settings-actions"><button class="secondary-button" :disabled="!hasUnsavedSettings" type="button" @click="discard">Änderungen verwerfen</button><button class="primary-button" :disabled="!hasUnsavedSettings" type="submit"><Save :size="16" /> Einstellungen speichern</button></div>
    </form>

    <section v-else class="panel settings-panel room-settings-panel">
      <header>
        <span class="settings-icon teal"><Building2 :size="20" /></span>
        <div><h2>Zimmer</h2><p>Zimmernamen, Tierart und Platzanzahl für Belegung und Buchungen verwalten.</p></div>
        <button class="secondary-button" type="button" @click="openRoomCreate"><Plus :size="15" /> Zimmer anlegen</button>
      </header>
      <p v-if="!store.rooms.length" class="empty-state">Keine Zimmer angelegt.</p>
      <ul v-else class="room-list">
        <li v-for="room in store.rooms" :key="room.id">
          <span class="room-icon" :class="{ cat: room.category === 'Katzenzimmer' }"><Dog v-if="room.category === 'Hundezimmer'" :size="18" /><Cat v-else :size="18" /></span>
          <div><strong>{{ room.name }}</strong><span>{{ room.category === 'Katzenzimmer' ? 'Katzen' : 'Hunde' }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }}</span></div>
          <div class="room-list-actions">
            <button class="icon-button" type="button" :aria-label="`${room.name} bearbeiten`" @click="openRoomEdit(room)"><Pencil :size="15" /></button>
            <button class="icon-button danger-icon-button" type="button" :aria-label="`${room.name} entfernen`" :disabled="roomHasBookings(room.id)" @click="removeRoom(room)"><Trash2 :size="15" /></button>
          </div>
        </li>
      </ul>
      <p v-if="roomError" class="form-error room-form-error" role="alert">{{ roomError }}</p>
    </section>

    <RoomFormModal
      v-if="roomModalMode"
      :mode="roomModalMode"
      :room="roomBeingEdited ?? undefined"
      :category-locked="roomModalMode === 'edit' && roomBeingEdited ? roomHasBookings(roomBeingEdited.id) : false"
      @close="closeRoomModal"
      @saved="closeRoomModal"
    />
  </main>
</template>
