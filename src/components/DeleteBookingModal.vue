<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import type { BookingView } from '../domain'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import BaseModal from './BaseModal.vue'

defineProps<{
  booking: BookingView
}>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <BaseModal labelled-by="delete-booking-title" modal-class="max-w-[470px]" @close="$emit('close')">
    <span class="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-[#fbe3e3] text-[#c23a3a]"><AlertTriangle /></span>
    <AppEyebrow>Buchung löschen</AppEyebrow>
    <h2 id="delete-booking-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Buchung für {{ booking.pet.name }} löschen?</h2>
    <p class="text-[14px] leading-[1.55] text-app-muted">Die Reservierung von {{ booking.customer.firstName }} {{ booking.customer.lastName }} wird entfernt. Auch ein bereits erfolgter Check-in oder Check-out samt Verlauf wird gelöscht. Dieser Schritt ist im Clickdummy nicht rückgängig zu machen.</p>
    <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
      <AppButton variant="secondary" @click="$emit('close')">Abbrechen</AppButton>
      <AppButton variant="danger" @click="$emit('confirm')"><AlertTriangle :size="16" /> Buchung löschen</AppButton>
    </div>
  </BaseModal>
</template>
