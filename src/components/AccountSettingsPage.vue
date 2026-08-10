<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, Save, ShieldCheck, Undo2, UserRound } from '@lucide/vue'
import type { AccountUpdate } from '../domain'
import { useSynchronizedDraft } from '../composables/useSynchronizedDraft'
import { formatCancellationDate } from '../presentation/dateFormat'
import { usePensionStore } from '../usePensionStore'
import CancelAccountModal from './CancelAccountModal.vue'

const store = usePensionStore()
const error = ref('')
const cancelDialogOpen = ref(false)

function accountDraft(): AccountUpdate {
  const { firstName, lastName, email } = store.account
  return { firstName, lastName, email }
}

const { draft, resetDraft } = useSynchronizedDraft(
  accountDraft,
  () => ({
    firstName: store.account.firstName,
    lastName: store.account.lastName,
    email: store.account.email
  }),
  () => { error.value = '' }
)

function save() {
  error.value = ''
  if (!store.updateAccount(draft.value)) {
    error.value = 'Bitte prüfe Vorname, Nachname und E-Mail-Adresse.'
  }
}

function discard() {
  resetDraft()
  error.value = ''
}

function confirmCancellation() {
  store.cancelAccount()
  cancelDialogOpen.value = false
}

</script>

<template>
  <main class="settings-page account-page">
    <div class="page-heading">
      <div><p class="eyebrow">Persönlicher Bereich</p><h1>Konto</h1><p>Verwalte deine persönlichen Zugangsdaten.</p></div>
    </div>

    <div v-if="store.account.cancelledAt" class="cancellation-notice">
      <div><strong>Diese Pension ist gekündigt.</strong><small>Der Zugang bleibt bis zum Ende der Vertragslaufzeit bestehen. Kündigung eingereicht am {{ formatCancellationDate(store.account.cancelledAt) }}.</small></div>
      <button class="secondary-button" @click="store.reactivateAccount()"><Undo2 :size="16" /> Kündigung zurücknehmen</button>
    </div>

    <form class="settings-layout" @submit.prevent="save">
      <section class="panel settings-panel">
        <header><span class="settings-icon"><UserRound :size="20" /></span><div><h2>Persönliche Daten</h2><p>Diese Angaben verwenden wir für Anmeldung und Benachrichtigungen.</p></div></header>
        <div class="settings-fields">
          <label>Vorname<input v-model.trim="draft.firstName" required /></label>
          <label>Nachname<input v-model.trim="draft.lastName" required /></label>
          <label class="wide">E-Mail<input v-model.trim="draft.email" type="email" required /></label>
          <label class="wide">Rolle<span class="account-role-badge"><ShieldCheck :size="13" /> {{ store.account.role === 'root' ? 'Inhaber-Account' : 'Mitarbeiter-Account' }}</span></label>
        </div>
      </section>

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="settings-actions"><button class="secondary-button" type="button" @click="discard">Änderungen verwerfen</button><button class="primary-button" type="submit"><Save :size="16" /> Konto speichern</button></div>
    </form>

    <section v-if="store.account.role === 'root' && !store.account.cancelledAt" class="panel settings-panel danger-zone">
      <header><span class="settings-icon danger-icon"><AlertTriangle :size="20" /></span><div><h2>Vertrag kündigen</h2><p>Nur als Inhaber-Account sichtbar.</p></div></header>
      <div class="danger-zone-body">
        <div><strong>Pension kündigen</strong><p>Der Zugang für dein gesamtes Team wird zum Ende der Vertragslaufzeit deaktiviert. Diese Aktion kann bis dahin zurückgenommen werden.</p></div>
        <button class="danger-button" @click="cancelDialogOpen = true"><AlertTriangle :size="16" /> Pension kündigen</button>
      </div>
    </section>

    <CancelAccountModal
      v-if="cancelDialogOpen"
      :business-name="store.settings.businessName"
      @close="cancelDialogOpen = false"
      @confirm="confirmCancellation"
    />
  </main>
</template>
