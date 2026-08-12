<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Check, ClipboardCheck } from '@lucide/vue'
import type { BookingView } from '../domain'
import { toTelephoneHref } from '../presentation/phoneLink'
import { usePensionStore } from '../usePensionStore'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  booking: BookingView
}>()

const emit = defineEmits<{
  close: []
  confirm: [allowOverbooking: boolean]
}>()

const store = usePensionStore()
const allowOverbooking = ref(false)

const roomOccupancy = computed(() => {
  const room = store.roomViews.value.find(r => r.id === props.booking.roomId)
  return {
    capacity: room?.capacity ?? 0,
    occupied: room?.guests.length ?? 0
  }
})

const isRoomFull = computed(() => roomOccupancy.value.occupied >= roomOccupancy.value.capacity)
</script>

<template>
  <BaseModal labelled-by="checkin-title" @close="$emit('close')">
    <span class="modal-icon"><ClipboardCheck /></span>
    <p class="eyebrow">Check-in bestätigen</p>
    <h2 id="checkin-title">Check-in für <RouterLink class="customer-profile-link" :to="{ name: 'customers', query: { customerId: booking.customer.id } }">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</RouterLink></h2>
    <p>
      Ist {{ booking.pet.name }} angekommen? Mit der Bestätigung wird {{ booking.pet.name }} dem Zimmer
      <strong>{{ booking.room.name }}</strong> zugewiesen.
    </p>
    <div v-if="booking.pet.note || booking.pet.specialFood || booking.bookingNote" class="pet-note" aria-label="Operative Hinweise">
      <div v-if="booking.pet.note">
        <strong>Hinweis zum Tier</strong>
        <span>{{ booking.pet.note }}</span>
      </div>
      <div v-if="booking.bookingNote">
        <strong>Hinweis zum Aufenthalt</strong>
        <span>{{ booking.bookingNote }}</span>
      </div>
      <div v-if="booking.pet.specialFood">
        <strong>Besonderes Futter</strong>
        <span>Tier benötigt von zu Hause mitgebrachtes Futter statt Standardfutter.</span>
      </div>
    </div>
    <dl>
      <div><dt>Tier</dt><dd>{{ booking.pet.name }}</dd></div>
      <div><dt>Abreise</dt><dd>{{ booking.departure }}</dd></div>
    </dl>
    <label v-if="isRoomFull" class="overbooking-warning">
      <input v-model="allowOverbooking" type="checkbox" />
      <span><strong>Überbuchung bewusst durchführen</strong> · Das Zimmer {{ booking.room.name }} ist bereits mit {{ roomOccupancy.occupied }} Tieren voll belegt.</span>
    </label>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="primary-button" :disabled="isRoomFull && !allowOverbooking" @click="$emit('confirm', allowOverbooking)"><Check :size="17" /> Jetzt einchecken</button>
    </div>
  </BaseModal>
</template>
