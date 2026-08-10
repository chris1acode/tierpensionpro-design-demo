<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { X } from '@lucide/vue'

defineProps<{
  labelledBy: string
  modalClass?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const closeButton = ref<HTMLButtonElement | null>(null)
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
  <div class="modal-backdrop" @click.self="$emit('close')">
    <section
      ref="dialog"
      class="modal"
      :class="modalClass"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledBy"
    >
      <button ref="closeButton" class="modal-close icon-button" aria-label="Dialog schließen" @click="$emit('close')">
        <X />
      </button>
      <slot />
    </section>
  </div>
</template>
