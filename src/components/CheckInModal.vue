<script setup lang="ts">
import { Check, ClipboardCheck } from '@lucide/vue'
import type { BookingView } from '../domain'
import { toTelephoneHref } from '../presentation/phoneLink'
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
    <div v-if="booking.pet.note || booking.pet.feedingPlan || booking.pet.specialFood || booking.pet.medicationPlan || booking.pet.allergyNote || booking.pet.vaccinationStatus || booking.bookingNote" class="pet-note" aria-label="Operative Hinweise">
      <div v-if="booking.pet.note">
        <strong>Hinweis zum Tier</strong>
        <span>{{ booking.pet.note }}</span>
      </div>
      <div v-if="booking.bookingNote">
        <strong>Hinweis zum Aufenthalt</strong>
        <span>{{ booking.bookingNote }}</span>
      </div>
      <div v-if="booking.pet.feedingPlan">
        <strong>Fütterungsplan</strong>
        <span>{{ booking.pet.feedingPlan }}</span>
      </div>
      <div v-if="booking.pet.specialFood">
        <strong>Besonderes Futter</strong>
        <span>Tier benötigt von zu Hause mitgebrachtes Futter statt Standardfutter.</span>
      </div>
      <div v-if="booking.pet.medicationPlan">
        <strong>Medikationsplan</strong>
        <span>{{ booking.pet.medicationPlan }}</span>
      </div>
      <div v-if="booking.pet.allergyNote">
        <strong>Allergien & Unverträglichkeiten</strong>
        <span>{{ booking.pet.allergyNote }}</span>
      </div>
      <div v-if="booking.pet.vaccinationStatus">
        <strong>Impfstatus</strong>
        <span>{{ booking.pet.vaccinationStatus }}</span>
      </div>
    </div>
    <dl>
      <div><dt>Tier</dt><dd>{{ booking.pet.name }} · {{ booking.pet.breed }}</dd></div>
      <div><dt>Abreise</dt><dd>{{ booking.departure }}</dd></div>
      <div v-if="booking.pet.veterinaryContact"><dt>Tierarztpraxis</dt><dd><a :href="toTelephoneHref(booking.pet.veterinaryContact.phone)">{{ booking.pet.veterinaryContact.practiceName }} · {{ booking.pet.veterinaryContact.phone }}</a></dd></div>
    </dl>
    <div class="modal-actions">
      <button class="secondary-button" @click="$emit('close')">Abbrechen</button>
      <button class="primary-button" @click="$emit('confirm')"><Check :size="17" /> Jetzt einchecken</button>
    </div>
  </BaseModal>
</template>
