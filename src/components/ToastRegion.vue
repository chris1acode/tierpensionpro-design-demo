<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { Check, X } from '@lucide/vue'
import type { ToastNotification } from '../domain'
import AppIconButton from './AppIconButton.vue'

const props = defineProps<{ notifications: readonly ToastNotification[] }>()
const emit = defineEmits<{ dismiss: [toastId: string] }>()

const timers = new Map<string, ReturnType<typeof setTimeout>>()

function dismiss(toastId: string) {
  const timer = timers.get(toastId)
  if (timer) clearTimeout(timer)
  timers.delete(toastId)
  emit('dismiss', toastId)
}

watch(
  () => props.notifications.map((toast) => toast.id),
  (ids) => {
    for (const toast of props.notifications) {
      if (!timers.has(toast.id)) timers.set(toast.id, setTimeout(() => dismiss(toast.id), 5000))
    }
    for (const [id, timer] of timers) {
      if (!ids.includes(id)) {
        clearTimeout(timer)
        timers.delete(id)
      }
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => timers.forEach((timer) => clearTimeout(timer)))
</script>

<template>
  <section class="pointer-events-none fixed z-[60] bottom-4 right-4 grid w-[min(390px,calc(100vw-32px))] gap-[9px] sm:bottom-6 sm:right-6" aria-label="Statusmeldungen" aria-live="polite" aria-relevant="additions">
    <TransitionGroup
      enter-active-class="transition duration-[180ms] ease-out"
      leave-active-class="transition duration-[180ms] ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-for="toast in notifications" :key="toast.id" class="pointer-events-auto grid grid-cols-[auto_1fr_auto] items-center gap-[9px] rounded-[9px] border border-[#c8dfd0] bg-[#e7f2eb] py-3 pl-[15px] pr-2.5 text-[13px] font-semibold text-[#315f48] shadow-[0_10px_30px_rgba(36,33,31,0.16)]" role="status">
        <Check :size="18" aria-hidden="true" />
        <span>{{ toast.message }}</span>
        <AppIconButton class="p-[5px] text-[#315f48]" :aria-label="`Meldung schließen: ${toast.message}`" @click="dismiss(toast.id)"><X :size="16" /></AppIconButton>
      </div>
    </TransitionGroup>
  </section>
</template>
