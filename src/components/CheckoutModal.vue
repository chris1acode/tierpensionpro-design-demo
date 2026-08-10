<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import type { DepartureView, StayPrice } from '../domain'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  departure: DepartureView
  price: StayPrice | null
}>()

const euroFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
const formatEuro = (amountCents: number) => euroFormatter.format(amountCents / 100)

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
    </dl>
    <section v-if="props.price" class="checkout-price" aria-label="Preisberechnung">
      <p>Preisberechnung</p>
      <span>{{ props.price.billableDays }} {{ props.price.billableDays === 1 ? 'Betreuungstag' : 'Betreuungstage' }} × {{ formatEuro(props.price.dailyRateCents) }}</span>
      <strong>{{ formatEuro(props.price.totalCents) }}</strong>
      <small>Der Abreisetag wird nicht berechnet.</small>
    </section>
    <p v-else class="checkout-price-unavailable">Für diesen Aufenthalt ist kein gültiger Tagespreis hinterlegt.</p>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="primary-button" @click="$emit('confirm')"><LogOut :size="17" /> Jetzt auschecken</button>
    </div>
  </BaseModal>
</template>
