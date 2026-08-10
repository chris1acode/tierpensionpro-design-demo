<script setup lang="ts">
import { ref } from 'vue'
import { Building2, Check, Clock3, Save } from '@lucide/vue'
import type { PensionSettingsUpdate } from '../domain'
import { usePensionStore } from '../usePensionStore'

const store = usePensionStore()
const draft = ref<PensionSettingsUpdate>(settingsDraft())
const error = ref('')

function settingsDraft(): PensionSettingsUpdate {
  const { id: _id, ...values } = store.settings
  return { ...values }
}

function save() {
  error.value = ''
  if (!store.updateSettings(draft.value)) {
    error.value = 'Bitte prüfe Kontaktdaten und Zeiten. Das Check-in-Fenster muss vor der Check-out-Zeit liegen.'
  }
}

function discard() {
  draft.value = settingsDraft()
  error.value = ''
}
</script>

<template>
  <main class="settings-page">
    <div class="page-heading">
      <div><p class="eyebrow">Betrieb konfigurieren</p><h1>Einstellungen</h1><p>Kontaktdaten und verbindliche Übergabezeiten zentral verwalten.</p></div>
    </div>

    <div v-if="store.announcement.value === 'Die Einstellungen wurden gespeichert.'" class="toast" role="status"><Check :size="18" />{{ store.announcement.value }}</div>

    <form class="settings-layout" @submit.prevent="save">
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

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="settings-actions"><button class="secondary-button" type="button" @click="discard">Änderungen verwerfen</button><button class="primary-button" type="submit"><Save :size="16" /> Einstellungen speichern</button></div>
    </form>
  </main>
</template>
