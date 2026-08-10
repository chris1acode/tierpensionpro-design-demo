<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import type { DepartureView, StayPrice } from '../domain'
import { formatEuroCents } from '../presentation/currencyFormat'
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
  <BaseModal labelled-by="checkout-title" @close="$emit('close')">
    <span class="modal-icon checkout-icon"><LogOut /></span>
    <p class="eyebrow">Check-out bestätigen</p>
    <h2 id="checkout-title">Check-out für {{ departure.customer.firstName }} {{ departure.customer.lastName }}</h2>
    <p>
      Wird {{ departure.pet.name }} von {{ departure.customer.firstName }} {{ departure.customer.lastName }} abgeholt?
      Mit der Bestätigung wird <strong>{{ departure.room.name }}</strong> wieder als frei geführt.
    </p>
    <dl>
      <div><dt>Tier</dt><dd>{{ departure.pet.name }} · {{ departure.pet.breed }}</dd></div>
      <div><dt>Zimmer</dt><dd>{{ departure.room.name }}</dd></div>
      <div v-if="departure.pickupTime"><dt>Vereinbarte Abholung</dt><dd>{{ departure.pickupTime }} Uhr</dd></div>
    </dl>
    <section v-if="props.price" class="checkout-price" aria-label="Preisberechnung">
      <p>Preisberechnung</p>
      <span>{{ props.price.billableDays }} {{ props.price.billableDays === 1 ? 'Betreuungstag' : 'Betreuungstage' }} × {{ formatEuroCents(props.price.dailyRateCents) }}</span>
      <strong>{{ formatEuroCents(props.price.totalCents) }}</strong>
      <small>Der Abreisetag wird nicht berechnet.</small>
    </section>
    <p v-else class="checkout-price-unavailable">Für diesen Aufenthalt ist kein gültiger Tagespreis hinterlegt.</p>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="primary-button" @click="$emit('confirm')"><LogOut :size="17" /> Jetzt auschecken</button>
    </div>
  </BaseModal>
</template>
