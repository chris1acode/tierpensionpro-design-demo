<script setup lang="ts">
import AppPanel from './AppPanel.vue'
import { computed, ref } from 'vue'
import { AlertTriangle, Save, ShieldCheck, Undo2, UserRound } from '@lucide/vue'
import type { AccountUpdate } from '../domain'
import { useSynchronizedDraft } from '../composables/useSynchronizedDraft'
import { areAccountUpdatesEqual } from '../domain/account'
import { formatCancellationDate } from '../presentation/dateFormat'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppContainer from './AppContainer.vue'
import AppFormError from './AppFormError.vue'
import AppPageHeading from './AppPageHeading.vue'
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

const hasUnsavedChanges = computed(() => !areAccountUpdatesEqual(draft.value, accountDraft()))

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
  <AppContainer class="settings-page account-page">
    <AppPageHeading eyebrow="Persönlicher Bereich" title="Konto" description="Verwalte deine persönlichen Zugangsdaten." />

    <div v-if="store.account.cancelledAt" class="flex items-center justify-between gap-4 rounded-[10px] border border-[#ecc6c6] bg-[#fdf2f2] px-[22px] py-4 text-[#7a2b2b] max-[680px]:flex-col max-[680px]:items-start">
      <div><strong class="block text-[15px]">Diese Pension ist gekündigt.</strong><small class="mt-[3px] block text-[13px] text-[#8a4141]">Der Zugang bleibt bis zum Ende der Vertragslaufzeit bestehen. Kündigung eingereicht am {{ formatCancellationDate(store.account.cancelledAt) }}.</small></div>
      <AppButton variant="secondary" class="max-[680px]:w-full" @click="store.reactivateAccount()"><Undo2 :size="16" /> Kündigung zurücknehmen</AppButton>
    </div>

    <form class="mb-[30px] grid gap-[22px]" @submit.prevent="save">
      <AppPanel >
        <header class="!justify-start gap-3"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#fbe8dd] text-[var(--primary-dark)]"><UserRound :size="20" /></span><div><h2>Persönliche Daten</h2><p>Diese Angaben verwenden wir für Anmeldung und Benachrichtigungen.</p></div></header>
        <div class="grid grid-cols-2 gap-[17px] p-[22px] max-[680px]:grid-cols-1 max-[680px]:p-4">
          <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Vorname<input v-model.trim="draft.firstName" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" required /></label>
          <label class="grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Nachname<input v-model.trim="draft.lastName" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" required /></label>
          <label class="col-span-full grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">E-Mail<input v-model.trim="draft.email" class="h-[42px] w-full rounded-lg border border-[var(--border)] bg-white px-[11px] text-[15px] text-[var(--text)] focus:border-[var(--primary)] focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]" type="email" required /></label>
          <label class="col-span-full grid gap-[7px] text-[13px] font-bold text-[var(--muted)]">Rolle<span class="inline-flex w-fit items-center gap-[5px] rounded-full bg-[#e4eff0] px-[10px] py-1 text-xs font-bold text-[var(--petrol)]"><ShieldCheck :size="13" /> {{ store.account.role === 'root' ? 'Inhaber-Account' : 'Mitarbeiter-Account' }}</span></label>
        </div>
      </AppPanel>

      <AppFormError v-if="error" class="rounded-lg border border-[#ebcaca] bg-[#fdf2f2] p-[12px_14px]">{{ error }}</AppFormError>
      <div class="flex justify-end gap-[9px] max-[680px]:flex-col-reverse max-[680px]:[&>*]:w-full"><AppButton variant="secondary" :disabled="!hasUnsavedChanges" type="button" @click="discard">Änderungen verwerfen</AppButton><AppButton variant="primary" :disabled="!hasUnsavedChanges" type="submit"><Save :size="16" /> Konto speichern</AppButton></div>
    </form>

    <AppPanel v-if="store.account.role === 'root' && !store.account.cancelledAt" class="!border-[#ecc6c6]">
      <header class="!justify-start gap-3 !border-b-[#f4dede]"><span class="grid size-[42px] flex-none place-items-center rounded-[10px] bg-[#fbe3e3] text-[#c23a3a]"><AlertTriangle :size="20" /></span><div><h2>Vertrag kündigen</h2><p>Nur als Inhaber-Account sichtbar.</p></div></header>
      <div class="flex items-center justify-between gap-4 p-[22px] max-[680px]:flex-col max-[680px]:items-start">
        <div><strong class="text-[15px]">Pension kündigen</strong><p class="mt-1 max-w-[420px] text-sm text-[var(--muted)]">Der Zugang für dein gesamtes Team wird zum Ende der Vertragslaufzeit deaktiviert. Diese Aktion kann bis dahin zurückgenommen werden.</p></div>
        <AppButton variant="danger" class="max-[680px]:w-full" @click="cancelDialogOpen = true"><AlertTriangle :size="16" /> Pension kündigen</AppButton>
      </div>
    </AppPanel>

    <CancelAccountModal
      v-if="cancelDialogOpen"
      :business-name="store.settings.businessName"
      @close="cancelDialogOpen = false"
      @confirm="confirmCancellation"
    />
  </AppContainer>
</template>
