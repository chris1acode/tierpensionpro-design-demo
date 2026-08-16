<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Check } from '@lucide/vue'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import LogoIcon from './LogoIcon.vue'

const store = usePensionStore()
const route = useRoute()
const queryEmail = computed(() => typeof route.query.email === 'string' ? route.query.email : '')
const code = ref(typeof route.query.code === 'string' ? route.query.code : '')
const error = ref('')
const verified = ref(store.registrationRequest.status === 'code-verified')

watch(queryEmail, (email) => {
  if (email && !store.registrationRequest.email) store.startRegistration(email)
}, { immediate: true })

function confirmCode() {
  if (!store.verifyRegistrationCode(code.value)) {
    error.value = 'Bitte gib einen Registrierungscode mit mindestens vier Zeichen ein.'
    return
  }
  error.value = ''
  verified.value = true
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-[#f8f6f3] px-4 py-10">
    <section class="w-full max-w-[430px] rounded-2xl border border-app-border bg-white p-7 shadow-[0_14px_38px_rgba(36,33,31,.09)] sm:p-9" aria-labelledby="verify-title">
      <RouterLink class="mb-8 flex w-fit items-center gap-2 text-[19px] font-bold text-app-text no-underline [font-family:'Manrope',sans-serif]" to="/">
        <span class="grid size-9 place-items-center text-primary"><LogoIcon :size="24" color="white" /></span>
        Tierpension <span class="text-primary">Pro</span>
      </RouterLink>
      <p class="mb-2 text-xs font-bold uppercase tracking-[.12em] text-primary">Schritt 2 von 3</p>
      <h1 id="verify-title" class="m-0 font-['Manrope'] text-[28px] font-bold text-app-text">E-Mail bestätigen</h1>
      <p class="mb-7 mt-2 text-sm leading-6 text-app-muted">Wir haben einen Registrierungscode an <strong class="text-app-text">{{ store.registrationRequest.email || queryEmail || 'deine E-Mail-Adresse' }}</strong> gesendet.</p>
      <form v-if="!verified" class="grid gap-4" @submit.prevent="confirmCode">
        <label class="grid gap-2 text-sm font-bold text-app-text">Registrierungscode
          <input v-model="code" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal outline-none placeholder:text-[#9d9893] focus:border-primary focus:ring-2 focus:ring-[#f8d9c8]" autocomplete="one-time-code" placeholder="z. B. TP-2026" required @input="error = ''">
        </label>
        <p v-if="error" class="-mt-2 mb-0 text-xs font-semibold text-[#a13d1e]" role="alert">{{ error }}</p>
        <AppButton class="mt-2" variant="primary" type="submit">Code bestätigen</AppButton>
      </form>
      <div v-else class="rounded-lg bg-[#edf7f3] px-4 py-4 text-sm leading-6 text-[#28624e]" role="status">
        <Check class="mr-2 inline" :size="17" />Code bestätigt. Im nächsten Schritt richtest du deine Pension ein.
      </div>
      <p class="mb-0 mt-7 text-center text-sm text-app-muted">Keine E-Mail erhalten? <RouterLink class="font-bold text-primary" to="/register">Adresse ändern</RouterLink></p>
    </section>
  </main>
</template>
