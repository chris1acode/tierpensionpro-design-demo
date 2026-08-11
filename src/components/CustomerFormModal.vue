<script setup lang="ts">
import { ref } from 'vue'
import type { CustomerUpdate, CustomerView } from '../domain'
import { usePensionStore } from '../usePensionStore'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  customer?: CustomerView
}>()

const emit = defineEmits<{
  close: []
  saved: [customerId: string]
}>()

const store = usePensionStore()
const error = ref(false)
const form = ref<CustomerUpdate>(props.mode === 'edit' && props.customer
  ? { firstName: props.customer.firstName, lastName: props.customer.lastName, email: props.customer.email, phone: props.customer.phone }
  : { firstName: '', lastName: '', email: '', phone: '' })

function submit() {
  if (props.mode === 'edit' && props.customer) {
    const saved = store.updateCustomer(props.customer.id, form.value)
    error.value = !saved
    if (saved) emit('saved', props.customer.id)
    return
  }

  const created = store.createCustomer(form.value)
  error.value = !created
  if (!created) return
  const createdCustomer = store.customers.at(-1)!
  emit('saved', createdCustomer.id)
}
</script>

<template>
  <BaseModal labelled-by="customer-form-heading" modal-class="customer-form-modal" @close="$emit('close')">
    <p class="eyebrow">{{ mode === 'edit' ? 'Kundenprofil' : 'Stammdaten' }}</p>
    <h2 id="customer-form-heading">{{ mode === 'edit' ? 'Kontaktdaten bearbeiten' : 'Kunden anlegen' }}</h2>
    <form class="customer-create-form" @submit.prevent="submit">
      <label>Vorname *<input v-model="form.firstName" autocomplete="given-name" /></label>
      <label>Nachname *<input v-model="form.lastName" autocomplete="family-name" /></label>
      <label>E-Mail *<input v-model="form.email" type="email" autocomplete="email" /></label>
      <label>Telefon *<input v-model="form.phone" autocomplete="tel" inputmode="tel" /></label>
      <p v-if="error" class="form-error" role="alert">Bitte vollständige Namen sowie eine gültige, noch nicht verwendete E-Mail-Adresse und Telefonnummer angeben.</p>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="$emit('close')">Abbrechen</button><button class="primary-button" type="submit">{{ mode === 'edit' ? 'Kontaktdaten speichern' : 'Kundenprofil speichern' }}</button></div>
    </form>
  </BaseModal>
</template>
