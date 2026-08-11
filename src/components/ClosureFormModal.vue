<script setup lang="ts">
import { ref } from 'vue'
import type { PensionClosure, PensionClosureUpdate } from '../domain'
import { usePensionStore } from '../usePensionStore'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  closure?: PensionClosure
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = usePensionStore()
const error = ref(false)
const form = ref<PensionClosureUpdate>(props.mode === 'edit' && props.closure
  ? { startDate: props.closure.startDate, endDate: props.closure.endDate, reason: props.closure.reason }
  : { startDate: '', endDate: '', reason: '' })

function submit() {
  const saved = props.mode === 'edit' && props.closure
    ? store.updatePensionClosure(props.closure.id, form.value)
    : store.createPensionClosure(form.value)
  error.value = !saved
  if (saved) emit('saved')
}
</script>

<template>
  <BaseModal labelled-by="closure-form-heading" modal-class="closure-form-modal" @close="$emit('close')">
    <p class="eyebrow">Kapazitätsplanung</p>
    <h2 id="closure-form-heading">{{ mode === 'edit' ? 'Schließzeit bearbeiten' : 'Schließzeit hinterlegen' }}</h2>
    <form class="closure-form-modal-form" @submit.prevent="submit">
      <label>Von<input v-model="form.startDate" aria-label="Schließzeit von" type="date" required /></label>
      <label>Bis<input v-model="form.endDate" aria-label="Schließzeit bis" type="date" :min="form.startDate" required /></label>
      <label>Hinweis <small>optional</small><input v-model="form.reason" aria-label="Hinweis zur Schließzeit" type="text" placeholder="z. B. Betriebsferien" /></label>
      <p v-if="error" class="form-error" role="alert">Bitte einen gültigen Zeitraum für die Schließzeit angeben.</p>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="$emit('close')">Abbrechen</button><button class="primary-button" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Schließzeit hinterlegen' }}</button></div>
    </form>
  </BaseModal>
</template>
