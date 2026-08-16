<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { X } from '@lucide/vue'
import AppIconButton from './AppIconButton.vue'

defineProps<{
  labelledBy: string
  modalClass?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const closeButton = ref<InstanceType<typeof AppIconButton> | null>(null)
const dialog = ref<HTMLElement | null>(null)
let previouslyFocusedElement: HTMLElement | null = null

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return

  const focusableElements = Array.from(dialog.value.querySelectorAll<HTMLElement>(
    'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => !element.hasAttribute('hidden'))
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)
  if (!firstElement || !lastElement) return

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  } else if (!dialog.value.contains(document.activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(async () => {
  previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  window.addEventListener('keydown', handleKeydown)
  await nextTick()
  closeButton.value?.focus()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  previouslyFocusedElement?.focus()
})
</script>

<template>
  <div class="fixed inset-0 z-50 grid items-start justify-items-center overflow-y-auto bg-[rgba(36,33,31,.48)] p-5" @click.self="$emit('close')">
    <section
      ref="dialog"
      class="relative w-full rounded-[14px] bg-white p-[24px] shadow-[0_20px_60px_rgba(36,33,31,.18)] sm:p-[29px]"
      :class="modalClass"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledBy"
    >
      <AppIconButton ref="closeButton" class="absolute right-[15px] top-[15px]" aria-label="Dialog schließen" @click="$emit('close')">
        <X />
      </AppIconButton>
      <slot />
    </section>
  </div>
</template>
