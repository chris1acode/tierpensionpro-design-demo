<script setup lang="ts">
import { ref } from 'vue'
import { ThumbsDown } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import BaseModal from './BaseModal.vue'

defineProps<{
  request: BookingRequest
}>()

const emit = defineEmits<{
  close: []
  confirm: [reason: string]
}>()

const reason = ref('')

function confirm() {
  const trimmedReason = reason.value.trim()
  if (!trimmedReason) return
  emit('confirm', trimmedReason)
}
</script>

<template>
  <BaseModal labelled-by="decline-request-title" modal-class="decline-request-modal" @close="emit('close')">
    <span class="modal-icon cancel-icon"><ThumbsDown /></span>
    <p class="eyebrow">Anfrage ablehnen</p>
    <h2 id="decline-request-title">Anfrage von {{ request.customerFirstName }} {{ request.customerLastName }} ablehnen?</h2>
    <p>{{ request.petName }} bleibt ohne Reservierung. Der Grund wird im Anfrageverlauf dokumentiert.</p>
    <p class="modal-notification-hint" role="status">Nach der Ablehnung wird {{ request.customerFirstName }} {{ request.customerLastName }} per E-Mail an {{ request.contactEmail }} über die Stornierung benachrichtigt.</p>
    <form class="decline-request-form" @submit.prevent="confirm">
      <label for="decline-request-reason">Ablehnungsgrund</label>
      <textarea id="decline-request-reason" v-model="reason" rows="3" required placeholder="z. B. Zeitraum bereits ausgebucht"></textarea>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="emit('close')">Abbrechen</button>
        <button class="danger-button" type="submit" :disabled="!reason.trim()"><ThumbsDown :size="16" /> Anfrage ablehnen</button>
      </div>
    </form>
  </BaseModal>
</template>
