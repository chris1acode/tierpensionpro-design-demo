<script setup lang="ts">
import { Database, RotateCcw, X } from '@lucide/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePensionStore } from '../usePensionStore'

const store = usePensionStore()
const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
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
  <aside class="demo-control" aria-label="Demodaten-Steuerung">
    <div v-if="open" ref="demoMenu" class="demo-menu">
      <header>
        <span class="demo-menu-icon"><Database :size="18" /></span>
        <div><strong>{{ store.demoEnvironment.label }}</strong><small>{{ store.demoEnvironment.scenario }}</small></div>
        <button ref="closeButton" class="icon-button" aria-label="Demodaten-Menü schließen" @click="closeMenu(true)"><X :size="18" /></button>
      </header>
      <p>Du arbeitest mit einem sicheren Beispieldatensatz. Änderungen betreffen keine echten Kundendaten.</p>
      <dl>
        <div><dt>Betriebstag</dt><dd>{{ store.demoEnvironment.businessDate }}</dd></div>
        <div><dt>Zurücksetzungen</dt><dd>{{ store.demoEnvironment.resetCount }}</dd></div>
      </dl>
      <button class="secondary-button" @click="store.resetDemo"><RotateCcw :size="16" /> Ausgangsdaten wiederherstellen</button>
    </div>
    <button ref="trigger" class="demo-badge" aria-label="Demodaten-Menü öffnen" :aria-expanded="open" @click="toggleMenu">
      <Database :size="17" /><span>Demodaten</span><i aria-hidden="true" />
    </button>
  </aside>
</template>
