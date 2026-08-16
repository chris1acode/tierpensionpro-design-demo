<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import BaseModal from './BaseModal.vue'

defineProps<{
  businessName: string
}>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <BaseModal labelled-by="cancel-account-title" modal-class="max-w-[470px]" @close="$emit('close')">
    <span class="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-[#fbe3e3] text-[#c23a3a]"><AlertTriangle /></span>
    <AppEyebrow>Kündigung bestätigen</AppEyebrow>
    <h2 id="cancel-account-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ businessName }} wirklich kündigen?</h2>
    <p class="text-[14px] leading-[1.55] text-app-muted">
      Mit der Kündigung wird dein Zugang zu Tierpension Pro zum Ende der aktuellen Vertragslaufzeit beendet.
      Du kannst die Kündigung bis dahin jederzeit zurücknehmen.
    </p>
    <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
      <AppButton variant="secondary" @click="$emit('close')">Abbrechen</AppButton>
      <AppButton variant="danger" @click="$emit('confirm')"><AlertTriangle :size="16" /> Jetzt kündigen</AppButton>
    </div>
  </BaseModal>
</template>
