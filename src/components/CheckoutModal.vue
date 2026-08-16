<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import type { DepartureView, StayPrice } from '../domain'
import { formatEuroCents } from '../presentation/currencyFormat'
import AppButton from './AppButton.vue'
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
    <span class="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-[#e4eff0] text-[var(--petrol)]"><LogOut /></span>
    <p class="eyebrow">Check-out bestätigen</p>
    <h2 id="checkout-title" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">Check-out für <RouterLink class="customer-profile-link" :to="{ name: 'customers', query: { customerId: departure.customer.id } }">{{ departure.customer.firstName }} {{ departure.customer.lastName }}</RouterLink></h2>
    <p class="text-[14px] leading-[1.55] text-[var(--muted)]">
      Wird {{ departure.pet.name }} von {{ departure.customer.firstName }} {{ departure.customer.lastName }} abgeholt?
      Mit der Bestätigung wird <strong>{{ departure.room.name }}</strong> wieder als frei geführt.
    </p>
    <dl class="my-[18px]">
      <div class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-[var(--muted)]">Tier</dt><dd class="m-0 font-bold">{{ departure.pet.name }}</dd></div>
      <div class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-[var(--muted)]">Zimmer</dt><dd class="m-0 font-bold">{{ departure.room.name }}</dd></div>
      <div v-if="departure.pickupTime" class="flex justify-between border-b border-[#eeeae6] py-[10px] text-[13px]"><dt class="text-[var(--muted)]">Vereinbarte Abholung</dt><dd class="m-0 font-bold">{{ departure.pickupTime }} Uhr</dd></div>
    </dl>
    <section v-if="props.price" class="checkout-price" aria-label="Preisberechnung">
      <p>Preisberechnung</p>
      <span>{{ props.price.billableDays }} {{ props.price.billableDays === 1 ? 'Betreuungstag' : 'Betreuungstage' }} × {{ formatEuroCents(props.price.dailyRateCents) }}</span>
      <strong>{{ formatEuroCents(props.price.totalCents) }}</strong>
      <small>Der Abreisetag wird nicht berechnet.</small>
    </section>
    <p v-else class="checkout-price-unavailable leading-[1.55]">Für diesen Aufenthalt ist kein gültiger Tagespreis hinterlegt.</p>
    <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
      <AppButton variant="secondary" @click="$emit('close')">Abbrechen</AppButton>
      <AppButton variant="primary" @click="$emit('confirm')"><LogOut :size="17" /> Jetzt auschecken</AppButton>
    </div>
  </BaseModal>
</template>
