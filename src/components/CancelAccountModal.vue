<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
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
  <BaseModal labelled-by="cancel-account-title" @close="$emit('close')">
    <span class="modal-icon cancel-icon"><AlertTriangle /></span>
    <p class="eyebrow">Kündigung bestätigen</p>
    <h2 id="cancel-account-title">{{ businessName }} wirklich kündigen?</h2>
    <p>
      Mit der Kündigung wird dein Zugang zu Tierpension Pro zum Ende der aktuellen Vertragslaufzeit beendet.
      Du kannst die Kündigung bis dahin jederzeit zurücknehmen.
    </p>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="danger-button" @click="$emit('confirm')"><AlertTriangle :size="16" /> Jetzt kündigen</button>
    </div>
  </BaseModal>
</template>
