<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import type { DepartureView, StayPrice } from '../domain'
import { formatEuroCents } from '../presentation/currencyFormat'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import AppCustomerLink from './AppCustomerLink.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  departure: DepartureView
  price: StayPrice | null
}>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <BaseModal labelled-by="checkout-title" modal-class="max-w-[470px]" @close="$emit('close')">
    <span class="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-[#e4eff0] text-petrol"><LogOut /></span>
    <AppEyebrow>Check-out bestätigen</AppEyebrow>
    <h2 id="checkout-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Check-out für <AppCustomerLink :customer-id="departure.customer.id">{{ departure.customer.firstName }} {{ departure.customer.lastName }}</AppCustomerLink></h2>
    <p class="text-[14px] leading-[1.55] text-app-muted">
      Wird {{ departure.pet.name }} von {{ departure.customer.firstName }} {{ departure.customer.lastName }} abgeholt?
      Mit der Bestätigung wird <strong>{{ departure.room.name }}</strong> wieder als frei geführt.
    </p>
    <dl class="my-[18px]">
      <div class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-app-muted">Tier</dt><dd class="m-0 font-bold">{{ departure.pet.name }}</dd></div>
      <div class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-app-muted">Zimmer</dt><dd class="m-0 font-bold">{{ departure.room.name }}</dd></div>
      <div v-if="departure.pickupTime" class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-app-muted">Vereinbarte Abholung</dt><dd class="m-0 font-bold">{{ departure.pickupTime }} Uhr</dd></div>
    </dl>
    <section v-if="props.price" class="mt-[18px] grid grid-cols-[1fr_auto] gap-x-3 gap-y-[5px] rounded-[9px] bg-[#eef6f5] px-[14px] py-[13px] text-petrol" aria-label="Preisberechnung">
      <p class="col-span-full m-0 text-[11px] font-extrabold uppercase tracking-[.06em]">Preisberechnung</p>
      <span class="text-[13px]">{{ props.price.billableDays }} {{ props.price.billableDays === 1 ? 'Betreuungstag' : 'Betreuungstage' }} × {{ formatEuroCents(props.price.dailyRateCents) }}</span>
      <strong class="text-[19px] font-extrabold [font-family:'Manrope',sans-serif]">{{ formatEuroCents(props.price.totalCents) }}</strong>
      <small class="col-span-full text-[11px] text-[#4a6865]">Der Abreisetag wird nicht berechnet.</small>
    </section>
    <p v-else class="mt-[18px] rounded-lg bg-[#faf0d9] px-3 py-[11px] text-[12px] leading-[1.55] text-[#6f5018]">Für diesen Aufenthalt ist kein gültiger Tagespreis hinterlegt.</p>
    <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
      <AppButton variant="secondary" @click="$emit('close')">Abbrechen</AppButton>
      <AppButton variant="primary" @click="$emit('confirm')"><LogOut :size="17" /> Jetzt auschecken</AppButton>
    </div>
  </BaseModal>
</template>
