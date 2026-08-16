<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ClipboardCheck } from '@lucide/vue'
import type { BookingView } from '../domain'
import { toTelephoneHref } from '../presentation/phoneLink'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import AppCustomerLink from './AppCustomerLink.vue'
import AppOverbookingWarning from './AppOverbookingWarning.vue'
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
  <BaseModal labelled-by="checkin-title" modal-class="max-w-[470px]" @close="$emit('close')">
    <span class="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-[#fbe8dd] text-[var(--primary-dark)]"><ClipboardCheck /></span>
    <AppEyebrow>Check-in bestätigen</AppEyebrow>
    <h2 id="checkin-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Check-in für <AppCustomerLink :customer-id="booking.customer.id">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</AppCustomerLink></h2>
    <p class="text-[14px] leading-[1.55] text-[var(--muted)]">
      Ist {{ booking.pet.name }} angekommen? Mit der Bestätigung wird {{ booking.pet.name }} dem Zimmer
      <strong>{{ booking.room.name }}</strong> zugewiesen.
    </p>
    <div v-if="booking.pet.note || booking.pet.specialFood || booking.bookingNote" class="my-[18px] grid gap-[4px] rounded-lg bg-[#faf0d9] p-3 text-xs text-[#6f5018]" aria-label="Operative Hinweise">
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
    <dl class="my-[18px]">
      <div class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-[var(--muted)]">Tier</dt><dd class="m-0 font-bold">{{ booking.pet.name }}</dd></div>
      <div class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-[var(--muted)]">Abreise</dt><dd class="m-0 font-bold">{{ booking.departure }}</dd></div>
    </dl>
    <AppOverbookingWarning v-if="isRoomFull" v-model="allowOverbooking"><template #title>Überbuchung bewusst durchführen</template>· Das Zimmer {{ booking.room.name }} ist bereits mit {{ roomOccupancy.occupied }} Tieren voll belegt.</AppOverbookingWarning>
    <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
      <AppButton variant="secondary" @click="$emit('close')">Abbrechen</AppButton>
      <AppButton variant="primary" :disabled="isRoomFull && !allowOverbooking" @click="$emit('confirm', allowOverbooking)"><Check :size="17" /> Jetzt einchecken</AppButton>
    </div>
  </BaseModal>
</template>
