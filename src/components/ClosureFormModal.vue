<script setup lang="ts">
import { ref } from 'vue'
import type { PensionClosure, PensionClosureUpdate } from '../domain'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
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
  <BaseModal labelled-by="closure-form-heading" modal-class="closure-form-modal max-w-[420px]" @close="$emit('close')">
    <AppEyebrow>Kapazitätsplanung</AppEyebrow>
    <h2 id="closure-form-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ mode === 'edit' ? 'Schließzeit bearbeiten' : 'Schließzeit hinterlegen' }}</h2>
    <form class="mt-5 grid gap-[13px]" @submit.prevent="submit">
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Von<input v-model="form.startDate" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" aria-label="Schließzeit von" type="date" required /></label>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Bis<input v-model="form.endDate" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" aria-label="Schließzeit bis" type="date" :min="form.startDate" required /></label>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Hinweis <small>optional</small><input v-model="form.reason" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" aria-label="Hinweis zur Schließzeit" type="text" placeholder="z. B. Betriebsferien" /></label>
      <p v-if="error" class="m-0 text-xs text-[#9b4444]" role="alert">Bitte einen gültigen Zeitraum für die Schließzeit angeben.</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton variant="primary" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Schließzeit hinterlegen' }}</AppButton></div>
    </form>
  </BaseModal>
</template>
