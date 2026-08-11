<script setup lang="ts">
import { computed, ref } from 'vue'
import { DoorOpen } from '@lucide/vue'
import type { BookingView } from '../domain'
import { selectRoomBookingAvailability } from '../domain/roomAvailability'
import { usePensionStore } from '../usePensionStore'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  booking: BookingView
}>()

const emit = defineEmits<{
  close: []
}>()

const store = usePensionStore()
const roomId = ref('')
const error = ref(false)

const roomOptions = computed(() => selectRoomBookingAvailability(
  store.roomViews.value,
  store.bookingViews.value.filter((item) => item.id !== props.booking.id),
  props.booking.pet,
  store.businessDate.value,
  props.booking.arrival,
  props.booking.departure,
  store.pensionClosures
).filter((availability) => !availability.wouldOverbook && availability.room.id !== props.booking.roomId))

function confirm() {
  if (!roomId.value || !store.changeCheckedInBookingRoom(props.booking.id, roomId.value)) {
    error.value = true
    return
  }
  emit('close')
}
</script>

<template>
  <BaseModal labelled-by="room-change-heading" modal-class="room-change-modal" @close="emit('close')">
    <p class="eyebrow">Zimmerwechsel</p>
    <h2 id="room-change-heading">Zimmer wechseln</h2>
    <p>{{ booking.customer.firstName }} {{ booking.customer.lastName }} · {{ booking.pet.name }} · aktuell {{ booking.room.name }}</p>
    <form class="request-assign-form" @submit.prevent="confirm">
      <label for="room-change-room">Neues Zimmer</label>
      <select id="room-change-room" v-model="roomId" required>
        <option value="" disabled>Zimmer auswählen</option>
        <option v-for="availability in roomOptions" :key="availability.room.id" :value="availability.room.id">{{ availability.room.name }} · {{ availability.availablePlaces }} {{ availability.availablePlaces === 1 ? 'Platz frei' : 'Plätze frei' }}</option>
      </select>
      <p v-if="!roomOptions.length" class="form-error" role="alert">Aktuell ist kein anderes passendes Zimmer bis zur geplanten Abreise frei.</p>
      <p v-else-if="error" class="form-error" role="alert">Bitte wähle ein verfügbares Zimmer.</p>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="emit('close')">Abbrechen</button>
        <button class="primary-button" type="submit" :disabled="!roomOptions.length"><DoorOpen :size="16" /> Zimmer wechseln</button>
      </div>
    </form>
  </BaseModal>
</template>
