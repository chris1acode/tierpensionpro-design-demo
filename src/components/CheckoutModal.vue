<script setup lang="ts">
import { computed, reactive } from 'vue'
import { LogOut } from '@lucide/vue'
import type { CheckoutChecklist, DepartureView } from '../domain'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  departure: DepartureView
}>()

const emit = defineEmits<{
  close: []
  confirm: [checklist: CheckoutChecklist]
}>()

const checklist = reactive<CheckoutChecklist>({
  belongingsReturned: props.departure.handover.belongingsReturned,
  medicationReturned: props.departure.handover.medicationReturned,
  roomChecked: props.departure.handover.roomChecked
})

const isComplete = computed(() => Object.values(checklist).every(Boolean))

function confirmCheckout() {
  if (isComplete.value) emit('confirm', { ...checklist })
}
</script>

<template>
  <BaseModal labelled-by="checkout-title" @close="emit('close')">
    <span class="modal-icon checkout-icon"><LogOut /></span>
    <p class="eyebrow">Check-out vorbereiten</p>
    <h2 id="checkout-title">{{ departure.pet.name }} übergeben</h2>
    <p>Bestätige die Übergabepunkte. Danach wird <strong>{{ departure.room.name }}</strong> wieder als frei geführt.</p>
    <div class="checkout-list">
      <label><input v-model="checklist.belongingsReturned" type="checkbox" /><span><strong>Persönliche Sachen übergeben</strong><small>Decke, Spielzeug und mitgebrachtes Futter</small></span></label>
      <label><input v-model="checklist.medicationReturned" type="checkbox" /><span><strong>Medikamente übergeben</strong><small>Restbestände und Einnahmehinweise</small></span></label>
      <label><input v-model="checklist.roomChecked" type="checkbox" /><span><strong>Zimmer kontrolliert</strong><small>Zimmer ist leer und kann gereinigt werden</small></span></label>
    </div>
    <div class="modal-actions">
      <button class="secondary-button" @click="emit('close')">Abbrechen</button>
      <button class="primary-button" :disabled="!isComplete" @click="confirmCheckout"><LogOut :size="17" /> Check-out abschließen</button>
    </div>
  </BaseModal>
</template>
