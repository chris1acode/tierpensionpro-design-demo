<script setup lang="ts">
import { Check, ClipboardCheck } from '@lucide/vue'
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
  <BaseModal labelled-by="checkin-title" @close="$emit('close')">
    <span class="modal-icon"><ClipboardCheck /></span>
    <p class="eyebrow">Check-in bestätigen</p>
    <h2 id="checkin-title">Check-in für {{ booking.customer.firstName }} {{ booking.customer.lastName }}</h2>
    <p>
      Ist {{ booking.pet.name }} angekommen? Mit der Bestätigung wird {{ booking.pet.name }} dem Zimmer
      <strong>{{ booking.room.name }}</strong> zugewiesen.
    </p>
    <div v-if="booking.pet.note" class="pet-note">
      <strong>Wichtiger Hinweis</strong>
      <span>{{ booking.pet.note }}</span>
    </div>
    <dl>
      <div><dt>Tier</dt><dd>{{ booking.pet.name }} · {{ booking.pet.breed }}</dd></div>
      <div><dt>Abreise</dt><dd>{{ booking.departure }}</dd></div>
    </dl>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="primary-button" @click="$emit('confirm')"><Check :size="17" /> Jetzt einchecken</button>
    </div>
  </BaseModal>
</template>
