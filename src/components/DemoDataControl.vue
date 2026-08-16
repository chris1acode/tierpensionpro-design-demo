<script setup lang="ts">
import { Database, ExternalLink, RotateCcw, X } from '@lucide/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppIconButton from './AppIconButton.vue'

const store = usePensionStore()
const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const closeButton = ref<InstanceType<typeof AppIconButton> | null>(null)
const demoMenu = ref<HTMLDivElement | null>(null)

async function openMenu() {
  open.value = true
  await nextTick()
  closeButton.value?.focus()
}

function closeMenu(restoreFocus = false) {
  open.value = false
  if (restoreFocus) nextTick(() => trigger.value?.focus())
}

function toggleMenu() {
  if (open.value) closeMenu()
  else openMenu()
}

function closeWithEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) return
  event.preventDefault()
  closeMenu(true)
}

function handleClickOutside(event: MouseEvent) {
  if (!open.value) return
  const target = event.target as Node
  if (demoMenu.value && !demoMenu.value.contains(target) && !trigger.value?.contains(target)) {
    closeMenu(true)
  }
}

onMounted(() => {
  window.addEventListener('keydown', closeWithEscape)
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeWithEscape)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <aside class="relative z-40 ml-auto flex flex-none items-center gap-[10px]" aria-label="Demodaten-Steuerung">
    <div v-if="open" ref="demoMenu" class="absolute right-0 top-[calc(100%+8px)] w-[264px] rounded-[13px] border border-app-border bg-white p-[17px] shadow-[0_14px_40px_rgba(36,33,31,0.18)]">
      <header class="grid grid-cols-[auto_1fr_auto] items-center gap-[10px]">
        <span class="inline-grid h-9 w-9 place-items-center rounded-[9px] bg-[#f3efff] text-[#5b4a8c]"><Database :size="20" /></span>
        <div><strong class="block">{{ store.demoEnvironment.label }}</strong><small class="mt-[2px] block text-[10px] text-app-muted">{{ store.demoEnvironment.scenario }}</small></div>
        <AppIconButton ref="closeButton" aria-label="Demodaten-Menü schließen" @click="closeMenu(true)"><X :size="20" /></AppIconButton>
      </header>
      <p class="my-4 text-sm leading-[1.6] text-app-text">Du arbeitest mit einem sicheren Beispieldatensatz. Änderungen betreffen keine echten Kundendaten.</p>
      <AppButton variant="secondary" class="mt-2 h-auto w-full whitespace-normal px-[15px] py-[10px] text-left" @click="store.resetDemo"><RotateCcw :size="16" /> Ausgangsdaten wiederherstellen</AppButton>
    </div>
    <button ref="trigger" class="relative flex min-h-[42px] w-11 items-center justify-center gap-2 rounded-full border border-[#b6a1e5] bg-[#f3efff] p-0 text-xs font-bold text-[#5b4a8c] shadow-[0_4px_14px_rgba(91,74,140,0.2)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(91,74,140,0.28)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(147,112,219,0.35)] sm:w-auto sm:justify-start sm:px-[14px]" aria-label="Demodaten-Menü öffnen" :aria-expanded="open" @click="toggleMenu">
      <Database :size="17" /><span class="hidden sm:inline">Demodaten</span><i aria-hidden="true" class="absolute right-px top-px h-[7px] w-[7px] shrink-0 rounded-full bg-[#8a74cc] shadow-[0_0_0_3px_#e5dcfb] sm:static sm:right-auto sm:top-auto" />
    </button>
    <RouterLink :to="{ name: 'request-demo' }" class="inline-flex items-center gap-1 text-xs font-bold text-[#5b4a8c] underline decoration-[#b6a1e5] underline-offset-2 transition-colors duration-150 hover:text-[#4a3b73] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(147,112,219,0.35)]">
      <ExternalLink :size="14" /><span>Beispiel Integration in deine Webseite</span>
    </RouterLink>
  </aside>
</template>
