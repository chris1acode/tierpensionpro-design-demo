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

    <form v-if="activeTab !== 'rooms'" class="grid gap-[22px]" @submit.prevent="save">
      <template v-if="activeTab === 'general'">
        <section class="panel">
          <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#fbe8dd] text-[var(--primary-dark)]"><Building2 :size="20" /></span><div><h2>Pensionsprofil</h2><p>Diese Angaben dienen als betriebliche Stammdaten.</p></div></header>
          <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
            <label class="col-span-full grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Name der Pension<input v-model.trim="draft.businessName" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">E-Mail<input v-model.trim="draft.contactEmail" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="email" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Telefon<input v-model.trim="draft.contactPhone" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="tel" required /></label>
          </div>
        </section>

        <section class="panel">
          <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#e4eff0] text-[var(--petrol)]"><Clock3 :size="20" /></span><div><h2>An- und Abreisezeiten</h2><p>Das Zeitfenster gilt für die tägliche Übergabeplanung.</p></div></header>
          <div class="grid grid-cols-3 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
            <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Check-in ab<input v-model="draft.checkInFrom" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="time" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Check-in bis<input v-model="draft.checkInUntil" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="time" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Check-out bis<input v-model="draft.checkOutUntil" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="time" required /></label>
          </div>
        </section>

        <section class="panel">
          <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#e4eff0] text-[var(--petrol)]"><Inbox :size="20" /></span><div><h2>Anfragen</h2><p>Externe Buchungsanfragen empfangen und im Menü anzeigen.</p></div></header>
          <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
            <label class="col-span-full checkbox-field"><input v-model="draft.requestsEnabled" type="checkbox" /> Anfragen aktivieren</label>
          </div>
        </section>
      </template>

      <section v-else class="panel">
        <div class="mb-6 flex items-start gap-3 rounded-[10px] border border-[#c9e1dc] bg-[#eef5f3] p-4 text-sm leading-relaxed text-[var(--petrol)]">
          <Info :size="20" class="mt-0.5 shrink-0" />
          <p>Ein ausführlichere Tarifkonfiguration ist noch in der Entwicklung (Bsp. Rabatt für mehrere Tiere, Einzelzimmer etc)</p>
        </div>
        <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#faf0d9] text-[#84601c]"><Banknote :size="20" /></span><div><h2>Preisliste</h2><p>Grundpreis je Tier und angefangenen Betreuungstag. Alle Beträge inklusive Mehrwertsteuer.</p></div></header>
        <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
          <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Hund pro Tag
            <span class="grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-lg border border-[var(--border)] bg-white"><input :value="rateInEuros('dog')" class="h-[42px] w-full border-0 bg-white px-[11px] text-[15px] text-[var(--text)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" inputmode="decimal" min="0.01" step="0.01" type="number" required aria-label="Tagespreis für Hunde in Euro" @input="updateRate('dog', ($event.target as HTMLInputElement).value)" /><span class="px-[13px] text-[13px] text-[var(--muted)]">€</span></span>
          </label>
          <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Katze pro Tag
            <span class="grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-lg border border-[var(--border)] bg-white"><input :value="rateInEuros('cat')" class="h-[42px] w-full border-0 bg-white px-[11px] text-[15px] text-[var(--text)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" inputmode="decimal" min="0.01" step="0.01" type="number" required aria-label="Tagespreis für Katzen in Euro" @input="updateRate('cat', ($event.target as HTMLInputElement).value)" /><span class="px-[13px] text-[13px] text-[var(--muted)]">€</span></span>
          </label>
        </div>
      </section>

      <p v-if="error" class="form-error rounded-lg border border-[#ebcaca] bg-[#fdf2f2] p-[12px_14px]" role="alert">{{ error }}</p>
      <div class="flex justify-end gap-[9px] max-[680px]:flex-col-reverse max-[680px]:[&>*]:w-full"><AppButton variant="secondary" :disabled="!hasUnsavedSettings" type="button" @click="discard">Änderungen verwerfen</AppButton><AppButton variant="primary" :disabled="!hasUnsavedSettings" type="submit"><Save :size="16" /> Einstellungen speichern</AppButton></div>
    </form>

    <section v-else class="panel mt-[22px]">
      <header class="max-[680px]:flex-wrap">
        <div><h2>Zimmer</h2><p>Zimmernamen, Tierart und Platzanzahl für Belegung und Buchungen verwalten.</p></div>
        <AppButton variant="primary" type="button" class="max-[680px]:w-full" @click="openRoomCreate"><Plus :size="15" /> Zimmer anlegen</AppButton>
      </header>
      <AppEmptyState v-if="!store.rooms.length">Keine Zimmer angelegt.</AppEmptyState>
      <ul v-else class="m-0 list-none p-0">
        <li v-for="room in store.rooms" :key="room.id" class="flex items-center gap-[14px] border-t border-t-[var(--border)] px-[22px] py-[14px] first:border-t-0">
          <span class="room-icon" :class="{ cat: room.category === 'Katzenzimmer' }"><Dog v-if="room.category === 'Hundezimmer'" :size="18" /><Cat v-else :size="18" /></span>
          <div class="min-w-0 flex-1"><strong class="block">{{ room.name }}</strong><span class="mt-[3px] block text-xs text-[var(--muted)]">{{ room.category === 'Katzenzimmer' ? 'Katzen' : 'Hunde' }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }}</span></div>
          <div class="flex items-center gap-[6px] max-[680px]:flex-col">
            <AppIconButton type="button" :aria-label="`${room.name} bearbeiten`" @click="openRoomEdit(room)"><Pencil :size="15" /></AppIconButton>
            <AppIconButton variant="danger" type="button" :aria-label="`${room.name} entfernen`" :disabled="roomHasBookings(room.id)" @click="removeRoom(room)"><Trash2 :size="15" /></AppIconButton>
          </div>
        </li>
      </ul>
      <p v-if="roomError" class="form-error px-[22px] py-[12px]" role="alert">{{ roomError }}</p>
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
