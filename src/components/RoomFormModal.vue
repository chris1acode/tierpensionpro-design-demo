<script setup lang="ts">
import { ref } from 'vue'
import type { Room, RoomInput } from '../domain'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
import AppEyebrow from './AppEyebrow.vue'
import AppFormError from './AppFormError.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  room?: Room
  categoryLocked?: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = usePensionStore()
const error = ref(false)
const form = ref<RoomInput>(props.mode === 'edit' && props.room
  ? { name: props.room.name, category: props.room.category, capacity: props.room.capacity, tariffId: props.room.tariffId }
  : { name: '', category: 'Hundezimmer', capacity: 1, tariffId: store.settings.tariffs[0]?.id ?? '' })

function submit() {
  const saved = props.mode === 'edit' && props.room
    ? store.updateRoom(props.room.id, form.value)
    : store.createRoom(form.value)
  error.value = !saved
  if (saved) emit('saved')
}
</script>

<template>
  <BaseModal labelled-by="room-form-heading" modal-class="room-form-modal max-w-[420px]" @close="$emit('close')">
    <AppEyebrow>Zimmerverwaltung</AppEyebrow>
    <h2 id="room-form-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ mode === 'edit' ? 'Zimmer bearbeiten' : 'Zimmer anlegen' }}</h2>
    <form class="mt-5 grid gap-[13px]" @submit.prevent="submit">
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Zimmername<input v-model.trim="form.name" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" aria-label="Zimmername" type="text" placeholder="z. B. Waldzimmer 3" required /></label>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Tierart
        <select v-model="form.category" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" :disabled="categoryLocked" aria-label="Tierart">
          <option value="Hundezimmer">Hunde</option>
          <option value="Katzenzimmer">Katzen</option>
        </select>
      </label>
      <small v-if="categoryLocked" class="-mt-[6px] text-[10px] text-app-muted">Tierart durch bestehende Buchungen geschützt</small>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Plätze<input v-model.number="form.capacity" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" aria-label="Plätze" min="1" max="20" step="1" type="number" required /></label>
      <label class="grid gap-[6px] text-[11px] font-bold text-app-muted">Tarif
        <select v-model="form.tariffId" class="h-10 min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text" aria-label="Tarif" required>
          <option value="" disabled>Tarif auswählen</option>
          <option v-for="tariff in store.settings.tariffs" :key="tariff.id" :value="tariff.id">{{ tariff.name }}</option>
        </select>
      </label>
      <AppFormError v-if="error">Zimmer konnte nicht gespeichert werden. Namen müssen eindeutig sein; Kapazität und bestehende Buchungen müssen weiterhin zusammenpassen.</AppFormError>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton variant="primary" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Zimmer anlegen' }}</AppButton></div>
    </form>
  </BaseModal>
</template>
