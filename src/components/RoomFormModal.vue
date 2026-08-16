<script setup lang="ts">
import { ref } from 'vue'
import type { Room, RoomInput } from '../domain'
import { usePensionStore } from '../usePensionStore'
import AppButton from './AppButton.vue'
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
  ? { name: props.room.name, category: props.room.category, capacity: props.room.capacity }
  : { name: '', category: 'Hundezimmer', capacity: 1 })

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
    <p class="eyebrow">Zimmerverwaltung</p>
    <h2 id="room-form-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ mode === 'edit' ? 'Zimmer bearbeiten' : 'Zimmer anlegen' }}</h2>
    <form class="mt-5 grid gap-[13px]" @submit.prevent="submit">
      <label class="grid gap-[6px] text-[11px] font-bold text-[var(--muted)]">Zimmername<input v-model.trim="form.name" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" aria-label="Zimmername" type="text" placeholder="z. B. Waldzimmer 3" required /></label>
      <label class="grid gap-[6px] text-[11px] font-bold text-[var(--muted)]">Tierart
        <select v-model="form.category" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" :disabled="categoryLocked" aria-label="Tierart">
          <option value="Hundezimmer">Hunde</option>
          <option value="Katzenzimmer">Katzen</option>
        </select>
      </label>
      <small v-if="categoryLocked" class="-mt-[6px] text-[10px] text-[var(--muted)]">Tierart durch bestehende Buchungen geschützt</small>
      <label class="grid gap-[6px] text-[11px] font-bold text-[var(--muted)]">Plätze<input v-model.number="form.capacity" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" aria-label="Plätze" min="1" max="20" step="1" type="number" required /></label>
      <p v-if="error" class="form-error" role="alert">Zimmer konnte nicht gespeichert werden. Namen müssen eindeutig sein; Kapazität und bestehende Buchungen müssen weiterhin zusammenpassen.</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton variant="primary" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Zimmer anlegen' }}</AppButton></div>
    </form>
  </BaseModal>
</template>
