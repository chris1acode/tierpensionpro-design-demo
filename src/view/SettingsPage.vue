<script setup lang="ts">
import AppPanel from '../components/AppPanel.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Banknote, Building2, Clock3, Inbox, Info, Pencil, Plus, Save, Trash2 } from '@lucide/vue'
import type { PensionSettingsUpdate, PetSpecies, PriceTierTariff, Room } from '../domain'
import { useSynchronizedDraft } from '../composables/useSynchronizedDraft'
import { arePensionSettingsEqual } from '../domain/pensionSettings'
import { usePensionStore } from '../usePensionStore'
import AppButton from '../components/AppButton.vue'
import AppCheckboxField from '../components/AppCheckboxField.vue'
import AppContainer from '../components/AppContainer.vue'
import AppEmptyState from '../components/AppEmptyState.vue'
import AppFormError from '../components/AppFormError.vue'
import AppIconButton from '../components/AppIconButton.vue'
import AppPageHeading from '../components/AppPageHeading.vue'
import AppRoomIcon from '../components/AppRoomIcon.vue'
import AppTab from '../components/AppTab.vue'
import AppTabs from '../components/AppTabs.vue'
import RoomFormModal from '../components/RoomFormModal.vue'

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
  return { ...values, dailyPetRates: values.dailyPetRates.map((rate) => ({ ...rate })), tariffs: values.tariffs.map((tariff) => ({ ...tariff, tiers: tariff.tiers.map((tier) => ({ ...tier })) })) }
}

const { draft, resetDraft } = useSynchronizedDraft(
  settingsDraft,
  () => ({ ...store.settings }),
  () => { error.value = '' }
)

const hasUnsavedSettings = computed(() => !arePensionSettingsEqual(draft.value, settingsDraft()))

function save() {
  error.value = ''
  const roomWithMissingTariff = store.rooms.find((room) => !draft.value.tariffs.some((tariff) => tariff.id === room.tariffId))
  if (roomWithMissingTariff) {
    error.value = `Tarif kann nicht entfernt werden: „${roomWithMissingTariff.name}“ ist ihm noch zugeordnet.`
    return
  }
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

function tariffName(tariffId: string): string {
  return store.settings.tariffs.find((tariff) => tariff.id === tariffId)?.name ?? '–'
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

function centsInEuros(amountCents: number): string { return (amountCents / 100).toFixed(2) }
function updateTierPrice(tariff: PriceTierTariff, index: number, value: string): void {
  const parsed = Number(value.replace(',', '.'))
  tariff.tiers[index].amountCents = Number.isFinite(parsed) ? Math.round(parsed * 100) : 0
}
function addTier(tariff: PriceTierTariff): void {
  const last = tariff.tiers.at(-1)
  tariff.tiers.push({ id: `tier-${Date.now()}-${tariff.tiers.length}`, startsAtAnimal: (last?.startsAtAnimal ?? 0) + 1, amountCents: last?.amountCents ?? 3000 })
}
function removeTier(tariff: PriceTierTariff, index: number): void { if (index > 0) tariff.tiers.splice(index, 1) }
function addTariff(): void {
  const stamp = Date.now()
  draft.value.tariffs.push({ id: `tariff-${stamp}`, name: `Neuer Tarif ${draft.value.tariffs.length + 1}`, type: 'price-tier', tiers: [{ id: `tier-${stamp}-1`, startsAtAnimal: 1, amountCents: 3000 }] })
}
function removeTariff(index: number): void { if (draft.value.tariffs.length > 1) draft.value.tariffs.splice(index, 1) }
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
        <AppPanel >
          <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#fbe8dd] text-primary-dark"><Building2 :size="20" /></span><div><h2>Pensionsprofil</h2><p>Diese Angaben dienen als betriebliche Stammdaten.</p></div></header>
          <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
            <label class="col-span-full grid gap-[7px] text-[13px] font-bold text-app-muted">Name der Pension<input v-model.trim="draft.businessName" class="h-[42px] w-full rounded-lg border border-app-border bg-white px-[11px] text-[15px] text-app-text focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">E-Mail<input v-model.trim="draft.contactEmail" class="h-[42px] w-full rounded-lg border border-app-border bg-white px-[11px] text-[15px] text-app-text focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="email" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">Telefon<input v-model.trim="draft.contactPhone" class="h-[42px] w-full rounded-lg border border-app-border bg-white px-[11px] text-[15px] text-app-text focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="tel" required /></label>
          </div>
        </AppPanel>

        <AppPanel >
          <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#e4eff0] text-petrol"><Clock3 :size="20" /></span><div><h2>An- und Abreisezeiten</h2><p>Das Zeitfenster gilt für die tägliche Übergabeplanung.</p></div></header>
          <div class="grid grid-cols-3 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
            <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">Check-in ab<input v-model="draft.checkInFrom" class="h-[42px] w-full rounded-lg border border-app-border bg-white px-[11px] text-[15px] text-app-text focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="time" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">Check-in bis<input v-model="draft.checkInUntil" class="h-[42px] w-full rounded-lg border border-app-border bg-white px-[11px] text-[15px] text-app-text focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="time" required /></label>
            <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">Check-out bis<input v-model="draft.checkOutUntil" class="h-[42px] w-full rounded-lg border border-app-border bg-white px-[11px] text-[15px] text-app-text focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="time" required /></label>
          </div>
        </AppPanel>

        <AppPanel >
          <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#e4eff0] text-petrol"><Inbox :size="20" /></span><div><h2>Anfragen</h2><p>Externe Buchungsanfragen empfangen und im Menü anzeigen.</p></div></header>
          <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
            <AppCheckboxField v-model="draft.requestsEnabled" class="col-span-full">Anfragen aktivieren</AppCheckboxField>
            <p class="col-span-full m-0 rounded-lg bg-[#f6f3ef] px-3 py-2.5 text-xs leading-relaxed text-app-muted">Link zu deiner persönlichen Anmeldeseite: <a class="font-bold text-primary hover:underline" href="/request-demo" target="_blank" rel="noopener">/request-demo</a></p>
          </div>
        </AppPanel>
      </template>

      <AppPanel v-else >
        <div class="mb-6 flex items-start gap-3 rounded-[10px] border border-[#c9e1dc] bg-[#eef5f3] p-4 text-sm leading-relaxed text-petrol">
          <Info :size="20" class="mt-0.5 shrink-0" />
          <p>Ein ausführlichere Tarifkonfiguration ist noch in der Entwicklung (Bsp. Rabatt für mehrere Tiere, Einzelzimmer etc)</p>
        </div>
        <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#faf0d9] text-[#84601c]"><Banknote :size="20" /></span><div><h2>Preisliste</h2><p>Grundpreis je Tier und angefangenen Betreuungstag. Alle Beträge inklusive Mehrwertsteuer.</p></div></header>
        <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
          <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">Hund pro Tag
            <span class="grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-lg border border-app-border bg-white"><input :value="rateInEuros('dog')" class="h-[42px] w-full border-0 bg-white px-[11px] text-[15px] text-app-text focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" inputmode="decimal" min="0.01" step="0.01" type="number" required aria-label="Tagespreis für Hunde in Euro" @input="updateRate('dog', ($event.target as HTMLInputElement).value)" /><span class="px-[13px] text-[13px] text-app-muted">€</span></span>
          </label>
          <label class="grid gap-[7px] text-[13px] font-bold text-app-muted">Katze pro Tag
            <span class="grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-lg border border-app-border bg-white"><input :value="rateInEuros('cat')" class="h-[42px] w-full border-0 bg-white px-[11px] text-[15px] text-app-text focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" inputmode="decimal" min="0.01" step="0.01" type="number" required aria-label="Tagespreis für Katzen in Euro" @input="updateRate('cat', ($event.target as HTMLInputElement).value)" /><span class="px-[13px] text-[13px] text-app-muted">€</span></span>
          </label>
        </div>
        <div class="border-t border-app-border p-[22px] max-[680px]:p-4">
          <div class="mb-4 flex items-center justify-between gap-3"><div><h3 class="m-0 text-base">Preisstaffeltarife</h3><p class="mb-0 mt-1 text-xs text-app-muted">Jede Preisstufe gilt ab der angegebenen Tierposition.</p></div><AppButton type="button" variant="secondary" @click="addTariff"><Plus :size="15" /> Tarif anlegen</AppButton></div>
          <section v-for="(tariff, tariffIndex) in draft.tariffs" :key="tariff.id" class="mb-3 rounded-lg border border-app-border bg-[#fcfbfa] p-4 last:mb-0">
            <div class="mb-3 flex items-end gap-3"><label class="grid flex-1 gap-1 text-xs font-bold text-app-muted">Tarifname<input v-model.trim="tariff.name" class="h-[40px] rounded-lg border border-app-border bg-white px-3 text-sm text-app-text" required /></label><AppIconButton variant="danger" type="button" :disabled="draft.tariffs.length === 1" :aria-label="`${tariff.name} entfernen`" @click="removeTariff(tariffIndex)"><Trash2 :size="15" /></AppIconButton></div>
            <div v-for="(tier, tierIndex) in tariff.tiers" :key="tier.id" class="mb-2 grid grid-cols-[minmax(105px,1fr)_minmax(125px,1fr)_auto] items-end gap-3 max-[520px]:grid-cols-[1fr_auto]">
              <label class="grid gap-1 text-xs font-bold text-app-muted">Ab dem Tier<input v-model.number="tier.startsAtAnimal" class="h-[40px] rounded-lg border border-app-border bg-white px-3 text-sm text-app-text" min="1" step="1" type="number" required /></label>
              <label class="grid gap-1 text-xs font-bold text-app-muted">Preis pro Tier/Nacht<span class="grid grid-cols-[1fr_auto] overflow-hidden rounded-lg border border-app-border bg-white"><input :value="centsInEuros(tier.amountCents)" class="h-[40px] min-w-0 border-0 px-3 text-sm text-app-text" inputmode="decimal" min="0.01" step="0.01" type="number" required @input="updateTierPrice(tariff, tierIndex, ($event.target as HTMLInputElement).value)" /><span class="self-center px-3 text-xs text-app-muted">€</span></span></label>
              <AppIconButton variant="danger" type="button" :disabled="tierIndex === 0" :aria-label="`Preisstufe ${tierIndex + 1} entfernen`" @click="removeTier(tariff, tierIndex)"><Trash2 :size="15" /></AppIconButton>
            </div>
            <AppButton class="mt-2" type="button" variant="secondary" @click="addTier(tariff)"><Plus :size="15" /> Preisstufe</AppButton>
          </section>
        </div>
      </AppPanel>

      <AppFormError v-if="error" class="rounded-lg border border-[#ebcaca] bg-[#fdf2f2] p-[12px_14px]">{{ error }}</AppFormError>
      <div class="flex justify-end gap-[9px] max-[680px]:flex-col-reverse max-[680px]:[&>*]:w-full"><AppButton variant="secondary" :disabled="!hasUnsavedSettings" type="button" @click="discard">Änderungen verwerfen</AppButton><AppButton variant="primary" :disabled="!hasUnsavedSettings" type="submit"><Save :size="16" /> Einstellungen speichern</AppButton></div>
    </form>

    <AppPanel v-else class="mt-[22px]">
      <header class="max-[680px]:flex-wrap">
        <div><h2>Zimmer</h2><p>Zimmernamen, Tierart und Platzanzahl für Belegung und Buchungen verwalten.</p></div>
        <AppButton variant="primary" type="button" class="max-[680px]:w-full" @click="openRoomCreate"><Plus :size="15" /> Zimmer anlegen</AppButton>
      </header>
      <AppEmptyState v-if="!store.rooms.length">Keine Zimmer angelegt.</AppEmptyState>
      <ul v-else class="m-0 list-none p-0">
        <li v-for="room in store.rooms" :key="room.id" class="flex items-center gap-[14px] border-t border-t-app-border px-[22px] py-[14px] first:border-t-0">
          <AppRoomIcon :category="room.category" :size="18" />
          <div class="min-w-0 flex-1"><strong class="block">{{ room.name }}</strong><span class="mt-[3px] block text-xs text-app-muted">{{ room.category === 'Katzenzimmer' ? 'Katzen' : 'Hunde' }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }} · {{ tariffName(room.tariffId) }}</span></div>
          <div class="flex items-center gap-[6px] max-[680px]:flex-col">
            <AppIconButton type="button" :aria-label="`${room.name} bearbeiten`" @click="openRoomEdit(room)"><Pencil :size="15" /></AppIconButton>
            <AppIconButton variant="danger" type="button" :aria-label="`${room.name} entfernen`" :disabled="roomHasBookings(room.id)" @click="removeRoom(room)"><Trash2 :size="15" /></AppIconButton>
          </div>
        </li>
      </ul>
      <AppFormError v-if="roomError" class="px-[22px] py-[12px]">{{ roomError }}</AppFormError>
    </AppPanel>

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
