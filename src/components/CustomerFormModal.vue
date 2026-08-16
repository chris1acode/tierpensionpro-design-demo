<script setup lang="ts">
import { ref } from 'vue'
import type { CustomerUpdate, CustomerView } from '../domain'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppFormField from './AppFormField.vue'
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
  <BaseModal labelled-by="customer-form-heading" modal-class="customer-form-modal max-w-[480px]" @close="$emit('close')">
    <p class="eyebrow">{{ mode === 'edit' ? 'Kundenprofil' : 'Stammdaten' }}</p>
    <h2 id="customer-form-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ mode === 'edit' ? 'Kontaktdaten bearbeiten' : 'Kunden anlegen' }}</h2>
    <form class="mt-5 grid gap-[13px]" @submit.prevent="submit">
      <AppFormField label="Vorname *"><input v-model="form.firstName" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" autocomplete="given-name" /></AppFormField>
      <AppFormField label="Nachname *"><input v-model="form.lastName" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" autocomplete="family-name" /></AppFormField>
      <AppFormField label="E-Mail *"><input v-model="form.email" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" type="email" autocomplete="email" /></AppFormField>
      <AppFormField label="Telefon *"><input v-model="form.phone" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" autocomplete="tel" inputmode="tel" /></AppFormField>
      <p v-if="error" class="m-0 text-xs text-[#9b4444]" role="alert">Bitte vollständige Namen sowie eine gültige, noch nicht verwendete E-Mail-Adresse und Telefonnummer angeben.</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton variant="primary" type="submit">{{ mode === 'edit' ? 'Kontaktdaten speichern' : 'Kundenprofil speichern' }}</AppButton></div>
    </form>
  </BaseModal>
</template>
