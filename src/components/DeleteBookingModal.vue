<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import type { BookingView } from '../domain'
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
  <BaseModal labelled-by="delete-booking-title" @close="$emit('close')">
    <span class="modal-icon cancel-icon"><AlertTriangle /></span>
    <p class="eyebrow">Buchung löschen</p>
    <h2 id="delete-booking-title">Buchung für {{ booking.pet.name }} löschen?</h2>
    <p>Die Reservierung von {{ booking.customer.firstName }} {{ booking.customer.lastName }} wird entfernt. Auch ein bereits erfolgter Check-in oder Check-out samt Verlauf wird gelöscht. Dieser Schritt ist im Clickdummy nicht rückgängig zu machen.</p>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="danger-button" @click="$emit('confirm')"><AlertTriangle :size="16" /> Buchung löschen</button>
    </div>
  </BaseModal>
</template>
