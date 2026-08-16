<script setup lang="ts">
import { ref } from 'vue'
import { ThumbsDown } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
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
  <BaseModal labelled-by="decline-request-title" modal-class="decline-request-modal max-w-[470px]" @close="emit('close')">
    <span class="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-[#fbe3e3] text-[#c23a3a]"><ThumbsDown /></span>
    <AppEyebrow>Anfrage ablehnen</AppEyebrow>
    <h2 id="decline-request-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Anfrage von {{ request.customerFirstName }} {{ request.customerLastName }} ablehnen?</h2>
    <p class="text-[14px] leading-[1.55] text-app-muted">{{ request.petName }} bleibt ohne Reservierung. Der Grund wird im Anfrageverlauf dokumentiert.</p>
    <p class="mt-[14px] rounded-lg bg-[#eef5f3] px-3 py-[10px] text-[14px] leading-[1.55] text-[#466b62]" role="status">Nach der Ablehnung wird {{ request.customerFirstName }} {{ request.customerLastName }} per E-Mail an {{ request.contactEmail }} über die Stornierung benachrichtigt.</p>
    <form class="grid gap-2 mt-5" @submit.prevent="confirm">
      <label for="decline-request-reason" class="text-[11px] font-bold text-app-muted">Ablehnungsgrund</label>
      <textarea id="decline-request-reason" v-model="reason" rows="3" required placeholder="z. B. Zeitraum bereits ausgebucht" class="w-full resize-y rounded-lg border border-app-border bg-white px-[10px] py-[9px] text-app-text [font:inherit] focus:border-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-[#f2c3a7]"></textarea>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
        <AppButton variant="secondary" type="button" @click="emit('close')">Abbrechen</AppButton>
        <AppButton variant="danger" type="submit" :disabled="!reason.trim()"><ThumbsDown :size="16" /> Anfrage ablehnen</AppButton>
      </div>
    </form>
  </BaseModal>
</template>
