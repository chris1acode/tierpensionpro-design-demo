<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import LogoIcon from './LogoIcon.vue'

const store = usePensionStore()
const router = useRouter()
const email = ref('')
const password = ref('')

function submitLogin() {
  store.logIn()
  void router.push({ name: 'dashboard' })
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-[#f8f6f3] px-4 py-10">
    <section class="w-full max-w-[430px] rounded-2xl border border-app-border bg-white p-7 shadow-[0_14px_38px_rgba(36,33,31,.09)] sm:p-9" aria-labelledby="login-title">
      <RouterLink class="mb-8 flex w-fit items-center gap-2 text-[19px] font-bold text-app-text no-underline [font-family:'Manrope',sans-serif]" to="/">
        <span class="grid size-9 place-items-center text-primary"><LogoIcon :size="24" color="white" /></span>
        Tierpension <span class="text-primary">Pro</span>
      </RouterLink>
      <p class="mb-2 text-xs font-bold uppercase tracking-[.12em] text-primary">Willkommen zurück</p>
      <h1 id="login-title" class="m-0 font-['Manrope'] text-[28px] font-bold text-app-text">Anmelden</h1>
      <p class="mb-2 mt-2 text-sm leading-6 text-app-muted">Melde dich an, um deine Pension zu verwalten.</p>
      <form class="mt-7 grid gap-4" @submit.prevent="submitLogin">
        <label class="grid gap-2 text-sm font-bold text-app-text">E-Mail-Adresse<input v-model="email" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal outline-none placeholder:text-[#9d9893] focus:border-primary focus:ring-2 focus:ring-[#f8d9c8]" type="email" autocomplete="email" placeholder="name@tierpension.de" /></label>
        <label class="grid gap-2 text-sm font-bold text-app-text">Passwort<input v-model="password" class="min-h-11 rounded-lg border border-app-border px-3 text-sm font-normal outline-none placeholder:text-[#9d9893] focus:border-primary focus:ring-2 focus:ring-[#f8d9c8]" type="password" autocomplete="current-password" placeholder="Passwort eingeben" /></label>
        <AppButton class="mt-2" variant="primary" type="submit">Anmelden <ArrowRight :size="17" /></AppButton>
      </form>
      <p class="mb-0 mt-7 text-center text-sm text-app-muted">Noch kein Konto? <RouterLink class="font-bold text-primary" to="/register">Jetzt registrieren</RouterLink></p>
    </section>
  </main>
</template>
