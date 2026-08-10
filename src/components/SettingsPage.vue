<script setup lang="ts">
import { ref } from 'vue'
import { Banknote, Building2, Clock3, Inbox, Plus, Save, Trash2 } from '@lucide/vue'
import type { PensionSettingsUpdate, PetSpecies, RoomInput } from '../domain'
import { useSynchronizedDraft } from '../composables/useSynchronizedDraft'
import { usePensionStore } from '../usePensionStore'

const store = usePensionStore()
const error = ref('')
const roomError = ref('')
const newRoom = ref<RoomInput>({ name: '', category: 'Hundezimmer', capacity: 1 })

function settingsDraft(): PensionSettingsUpdate {
  const { id: _id, ...values } = store.settings
  return { ...values }
}

const { draft, resetDraft } = useSynchronizedDraft(
  settingsDraft,
  () => ({ ...store.settings }),
  () => { error.value = '' }
)

const { draft: roomDraft, resetDraft: resetRoomDraft } = useSynchronizedDraft(
  () => store.rooms.map((room) => ({ ...room })),
  () => store.rooms,
  () => { roomError.value = '' }
)

function save() {
  error.value = ''
  if (!store.updateSettings(draft.value)) {
    error.value = 'Bitte prüfe Kontaktdaten und Zeiten. Das Check-in-Fenster muss vor der Check-out-Zeit liegen.'
  }
}

function discard() {
  resetDraft()
  resetRoomDraft()
  error.value = ''
}

function saveRoom(index: number) {
  roomError.value = ''
  const room = roomDraft.value[index]
  if (!store.updateRoom(room.id, room)) {
    roomError.value = 'Zimmer konnten nicht gespeichert werden. Namen müssen eindeutig sein; Kapazität und bestehende Buchungen müssen weiterhin zusammenpassen.'
  }
}

function addRoom() {
  roomError.value = ''
  if (!store.createRoom(newRoom.value)) {
    roomError.value = 'Bitte vergib einen eindeutigen Namen (mindestens 2 Zeichen) und eine Kapazität von 1 bis 20 Plätzen.'
    return
  }
  newRoom.value = { name: '', category: 'Hundezimmer', capacity: 1 }
}

function removeRoom(roomId: string) {
  roomError.value = ''
  if (!store.deleteRoom(roomId)) {
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
      <div><p class="eyebrow">Betrieb konfigurieren</p><h1>Einstellungen</h1><p>Kontaktdaten und verbindliche Übergabezeiten zentral verwalten.</p></div>
    </div>

    <form class="settings-layout" @submit.prevent="save">
      <section class="panel settings-panel">
        <header><span class="settings-icon"><Building2 :size="20" /></span><div><h2>Pensionsprofil</h2><p>Diese Angaben dienen als betriebliche Stammdaten.</p></div></header>
        <div class="settings-fields">
          <label class="wide">Name der Pension<input v-model.trim="draft.businessName" required /></label>
          <label>E-Mail<input v-model.trim="draft.contactEmail" type="email" required /></label>
          <label>Telefon<input v-model.trim="draft.contactPhone" type="tel" required /></label>
        </div>
      </section>

      <section class="panel settings-panel room-settings-panel">
        <header><span class="settings-icon teal"><Building2 :size="20" /></span><div><h2>Zimmer</h2><p>Zimmernamen, Tierart und Platzanzahl für Belegung und Buchungen verwalten.</p></div></header>
        <div class="room-configuration-list">
          <article v-for="(room, index) in roomDraft" :key="room.id" class="room-configuration-row">
            <label>Zimmername<input v-model.trim="room.name" :aria-label="`Name von ${store.rooms[index]?.name ?? 'Zimmer'}`" required /></label>
            <label>Tierart
              <select v-model="room.category" :disabled="roomHasBookings(room.id)" :aria-label="`Tierart von ${room.name}`">
                <option value="Hundezimmer">Hunde</option>
                <option value="Katzenzimmer">Katzen</option>
              </select>
            </label>
            <label>Plätze<input v-model.number="room.capacity" min="1" max="20" step="1" type="number" required /></label>
            <div class="room-configuration-actions">
              <small v-if="roomHasBookings(room.id)">Tierart durch Buchungen geschützt</small>
              <button class="secondary-button" type="button" @click="saveRoom(index)">Zimmer speichern</button>
              <button class="icon-button danger-icon-button" :aria-label="`${room.name} entfernen`" :disabled="roomHasBookings(room.id)" type="button" @click="removeRoom(room.id)"><Trash2 :size="16" /></button>
            </div>
          </article>
          <div class="room-create-row">
            <label>Neues Zimmer<input v-model.trim="newRoom.name" placeholder="z. B. Waldzimmer 3" /></label>
            <label>Tierart<select v-model="newRoom.category"><option value="Hundezimmer">Hunde</option><option value="Katzenzimmer">Katzen</option></select></label>
            <label>Plätze<input v-model.number="newRoom.capacity" min="1" max="20" step="1" type="number" /></label>
            <button class="secondary-button" type="button" @click="addRoom"><Plus :size="16" /> Zimmer anlegen</button>
          </div>
        </div>
        <p v-if="roomError" class="form-error room-form-error" role="alert">{{ roomError }}</p>
      </section>

      <section class="panel settings-panel">
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

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="settings-actions"><button class="secondary-button" type="button" @click="discard">Änderungen verwerfen</button><button class="primary-button" type="submit"><Save :size="16" /> Einstellungen speichern</button></div>
    </form>
  </main>
</template>
