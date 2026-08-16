<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Check } from '@lucide/vue'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import LogoIcon from './LogoIcon.vue'

const store = usePensionStore()
const router = useRouter()
const isReady = computed(() => ['code-verified', 'completed'].includes(store.registrationRequest.status))
const completed = ref(store.registrationRequest.status === 'completed')
const error = ref('')
const form = reactive({
  firstName: store.registrationRequest.profile?.firstName ?? '', lastName: store.registrationRequest.profile?.lastName ?? '',
  businessName: store.registrationRequest.profile?.businessName ?? '', street: store.registrationRequest.profile?.street ?? '',
  postalCode: store.registrationRequest.profile?.postalCode ?? '', city: store.registrationRequest.profile?.city ?? ''
})

function submit() {
  if (!store.completeRegistration(form)) {
    error.value = 'Bitte fülle alle Felder aus und gib eine fünfstellige Postleitzahl ein.'
    return
  }
  error.value = ''
  completed.value = true
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-[#f8f6f3] px-4 py-10">
    <section class="w-full max-w-[520px] rounded-2xl border border-app-border bg-white p-7 shadow-[0_14px_38px_rgba(36,33,31,.09)] sm:p-9" aria-labelledby="pension-title">
      <RouterLink class="mb-8 flex w-fit items-center gap-2 text-[19px] font-bold text-app-text no-underline [font-family:'Manrope',sans-serif]" to="/"><span class="grid size-9 place-items-center text-primary"><LogoIcon :size="24" color="white" /></span>Tierpension <span class="text-primary">Pro</span></RouterLink>
      <template v-if="!isReady"><p class="mb-2 text-xs font-bold uppercase tracking-[.12em] text-primary">Registrierung</p><h1 id="pension-title" class="m-0 font-['Manrope'] text-[28px] font-bold text-app-text">Code zuerst bestätigen</h1><p class="mb-7 mt-2 text-sm leading-6 text-app-muted">Bitte bestätige zuerst deinen Registrierungscode.</p><AppButton variant="primary" to="/register/verify">Zum Bestätigungscode</AppButton></template>
      <template v-else-if="!completed">
        <p class="mb-2 text-xs font-bold uppercase tracking-[.12em] text-primary">Schritt 3 von 3</p><h1 id="pension-title" class="m-0 font-['Manrope'] text-[28px] font-bold text-app-text">Pension einrichten</h1><p class="mb-7 mt-2 text-sm leading-6 text-app-muted">Deine E-Mail-Adresse <strong class="text-app-text">{{ store.registrationRequest.email }}</strong> ist bereits bestätigt.</p>
        <form class="grid gap-4" @submit.prevent="submit">
          <div class="grid gap-4 sm:grid-cols-2"><label class="grid gap-2 text-sm font-bold text-app-text">Vorname<input v-model="form.firstName" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal" autocomplete="given-name" required></label><label class="grid gap-2 text-sm font-bold text-app-text">Nachname<input v-model="form.lastName" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal" autocomplete="family-name" required></label></div>
          <label class="grid gap-2 text-sm font-bold text-app-text">Name der Tierpension<input v-model="form.businessName" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal" autocomplete="organization" required></label><label class="grid gap-2 text-sm font-bold text-app-text">Straße und Hausnummer<input v-model="form.street" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal" autocomplete="street-address" required></label>
          <div class="grid gap-4 sm:grid-cols-[130px_1fr]"><label class="grid gap-2 text-sm font-bold text-app-text">PLZ<input v-model="form.postalCode" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal" inputmode="numeric" autocomplete="postal-code" maxlength="5" required></label><label class="grid gap-2 text-sm font-bold text-app-text">Ort<input v-model="form.city" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal" autocomplete="address-level2" required></label></div>
          <p v-if="error" class="-mt-2 mb-0 text-xs font-semibold text-[#a13d1e]" role="alert">{{ error }}</p><AppButton class="mt-2" variant="primary" type="submit">Registrierung abschließen</AppButton>
        </form>
      </template>
      <div v-else class="rounded-lg bg-[#edf7f3] px-4 py-4 text-sm leading-6 text-[#28624e]" role="status"><Check class="mr-2 inline" :size="17" />Deine Pension <strong>{{ store.registrationRequest.profile?.businessName }}</strong> ist eingerichtet.<AppButton class="mt-4" variant="primary" @click="router.push({ name: 'login' })">Zur Anmeldung</AppButton></div>
    </section>
  </main>
</template>
