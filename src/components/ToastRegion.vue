<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { Check, X } from '@lucide/vue'
import type { ToastNotification } from '../domain'

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
  <section class="toast-region" aria-label="Statusmeldungen" aria-live="polite" aria-relevant="additions">
    <TransitionGroup name="toast">
      <div v-for="toast in notifications" :key="toast.id" class="toast" role="status">
        <Check :size="18" aria-hidden="true" />
        <span>{{ toast.message }}</span>
        <button class="toast-dismiss icon-button" :aria-label="`Meldung schließen: ${toast.message}`" @click="dismiss(toast.id)"><X :size="16" /></button>
      </div>
    </TransitionGroup>
  </section>
</template>
