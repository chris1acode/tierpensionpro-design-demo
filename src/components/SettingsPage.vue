<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Banknote, Building2, Cat, Clock3, Dog, Inbox, Info, Pencil, Plus, Save, Trash2 } from '@lucide/vue'
import type { PensionSettingsUpdate, PetSpecies, Room } from '../domain'
import { useSynchronizedDraft } from '../composables/useSynchronizedDraft'
import { arePensionSettingsEqual } from '../domain/pensionSettings'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppContainer from './AppContainer.vue'
import AppEmptyState from './AppEmptyState.vue'
import AppIconButton from './AppIconButton.vue'
import AppPageHeading from './AppPageHeading.vue'
import AppTab from './AppTab.vue'
import AppTabs from './AppTabs.vue'
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
  <AppContainer class="settings-page">
    <AppPageHeading eyebrow="Betrieb konfigurieren" title="Einstellungen" description="Kontaktdaten, Tarife und Zimmer zentral verwalten." />

    <AppTabs class="mb-[22px] max-sm:w-full" grow-mobile aria-label="Einstellungsbereiche">
      <AppTab to="/settings/general" size="lg" grow-mobile>Allgemein</AppTab>
      <AppTab to="/settings/rates" size="lg" grow-mobile>Tarife</AppTab>
      <AppTab to="/settings/rooms" size="lg" grow-mobile>Unterbringung</AppTab>
    </AppTabs>

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
        <div class="mb-6 flex items-start gap-3 rounded-[10px] border border-[#c9e1dc] bg-[#eef5f3] p-4 text-sm leading-relaxed text-[var(--petrol)]">
          <Info :size="20" class="mt-0.5 shrink-0" />
          <p>Ein ausführlichere Tarifkonfiguration ist noch in der Entwicklung (Bsp. Rabatt für mehrere Tiere, Einzelzimmer etc)</p>
        </div>
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
      <div class="settings-actions"><AppButton variant="secondary" :disabled="!hasUnsavedSettings" type="button" @click="discard">Änderungen verwerfen</AppButton><AppButton variant="primary" :disabled="!hasUnsavedSettings" type="submit"><Save :size="16" /> Einstellungen speichern</AppButton></div>
    </form>

    <section v-else class="panel settings-panel room-settings-panel">
      <header>
        <div><h2>Zimmer</h2><p>Zimmernamen, Tierart und Platzanzahl für Belegung und Buchungen verwalten.</p></div>
        <AppButton variant="primary" type="button" @click="openRoomCreate"><Plus :size="15" /> Zimmer anlegen</AppButton>
      </header>
      <AppEmptyState v-if="!store.rooms.length">Keine Zimmer angelegt.</AppEmptyState>
      <ul v-else class="room-list">
        <li v-for="room in store.rooms" :key="room.id">
          <span class="room-icon" :class="{ cat: room.category === 'Katzenzimmer' }"><Dog v-if="room.category === 'Hundezimmer'" :size="18" /><Cat v-else :size="18" /></span>
          <div><strong>{{ room.name }}</strong><span>{{ room.category === 'Katzenzimmer' ? 'Katzen' : 'Hunde' }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }}</span></div>
          <div class="room-list-actions">
            <AppIconButton type="button" :aria-label="`${room.name} bearbeiten`" @click="openRoomEdit(room)"><Pencil :size="15" /></AppIconButton>
            <AppIconButton variant="danger" type="button" :aria-label="`${room.name} entfernen`" :disabled="roomHasBookings(room.id)" @click="removeRoom(room)"><Trash2 :size="15" /></AppIconButton>
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
  </AppContainer>
</template>
