<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import LogoIcon from './LogoIcon.vue'

const store = usePensionStore()
const router = useRouter()
const email = ref(store.registrationRequest.email)
const error = ref('')

function submitRegistration() {
  if (!store.startRegistration(email.value)) {
    error.value = 'Bitte gib eine gültige E-Mail-Adresse ein.'
    return
  }

  error.value = ''
  void router.push({ name: 'register-verify', query: { email: store.registrationRequest.email } })
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-[#f8f6f3] px-4 py-10">
    <section class="w-full max-w-[430px] rounded-2xl border border-app-border bg-white p-7 shadow-[0_14px_38px_rgba(36,33,31,.09)] sm:p-9" aria-labelledby="register-title">
      <RouterLink class="mb-8 flex w-fit items-center gap-2 text-[19px] font-bold text-app-text no-underline [font-family:'Manrope',sans-serif]" to="/">
        <span class="grid size-9 place-items-center text-primary"><LogoIcon :size="24" color="white" /></span>
        Tierpension <span class="text-primary">Pro</span>
      </RouterLink>
      <p class="mb-2 text-xs font-bold uppercase tracking-[.12em] text-primary">Schritt 1 von 3</p>
      <h1 id="register-title" class="m-0 font-['Manrope'] text-[28px] font-bold text-app-text">Konto registrieren</h1>
      <p class="mb-7 mt-2 text-sm leading-6 text-app-muted">Wir senden dir einen Registrierungscode an deine E-Mail-Adresse.</p>
      <form class="grid gap-4" @submit.prevent="submitRegistration">
        <label class="grid gap-2 text-sm font-bold text-app-text">E-Mail-Adresse
          <input v-model="email" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal outline-none placeholder:text-[#9d9893] focus:border-primary focus:ring-2 focus:ring-[#f8d9c8]" type="email" autocomplete="email" placeholder="name@tierpension.de" required @input="error = ''">
        </label>
        <p v-if="error" class="-mt-2 mb-0 text-xs font-semibold text-[#a13d1e]" role="alert">{{ error }}</p>
        <AppButton class="mt-2" variant="primary" type="submit">Code anfordern <ArrowRight :size="17" /></AppButton>
      </form>
      <p class="mb-0 mt-7 text-center text-sm text-app-muted">Schon registriert? <RouterLink class="font-bold text-primary" to="/login">Jetzt anmelden</RouterLink></p>
    </section>
  </main>
</template>
