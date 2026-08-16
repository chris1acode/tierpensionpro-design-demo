<script setup lang="ts">
import { ref } from 'vue'
import type { CustomerView, PetSpecies } from '../domain'
import { usePensionStore } from '../usePensionStore'
import { MAX_PET_NOTE_LENGTH } from '../domain/petProfile'
import AppButton from './AppButton.vue'
import AppCheckboxField from './AppCheckboxField.vue'
import AppFormField from './AppFormField.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  customerId?: string
  pet?: CustomerView['pets'][number]
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = usePensionStore()
const error = ref(false)
const form = ref(props.mode === 'edit' && props.pet
  ? {
    name: props.pet.name, species: props.pet.species, note: props.pet.note ?? '',
    specialFood: props.pet.specialFood ?? false
  }
  : { name: '', species: 'dog' as PetSpecies, note: '', specialFood: false })

function submit() {
  const { species, ...input } = form.value

  if (props.mode === 'edit' && props.pet) {
    const saved = store.updatePet(props.pet.id, { ...input })
    error.value = !saved
    if (saved) emit('saved')
    return
  }

  if (!props.customerId) return
  const created = store.createPet({ customerId: props.customerId, species, ...input })
  error.value = !created
  if (created) emit('saved')
}
</script>

<template>
  <BaseModal labelled-by="pet-form-heading" modal-class="pet-form-modal max-w-[600px]" @close="$emit('close')">
    <p class="eyebrow">{{ mode === 'edit' ? 'Tierprofil' : 'Stammdaten' }}</p>
    <h2 id="pet-form-heading" class="mb-[10px] mt-[5px] text-[22px] font-bold [font-family:'Manrope',sans-serif]">{{ mode === 'edit' ? `${pet?.name} bearbeiten` : 'Tier anlegen' }}</h2>
    <form class="mt-5 grid grid-cols-2 gap-[13px] max-[680px]:grid-cols-1" @submit.prevent="submit">
      <AppFormField label="Name *"><input v-model="form.name" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)]" autocomplete="off" /></AppFormField>
      <AppFormField v-if="mode === 'create'" label="Tierart *"><select v-model="form.species" class="h-10 min-w-0 rounded-lg border border-[var(--border)] bg-white px-[10px] text-[var(--text)] [font:inherit]"><option value="dog">Hund</option><option value="cat">Katze</option></select></AppFormField>
      <AppCheckboxField v-model="form.specialFood" class="col-span-full">
        Besonderes Futter
        <template #description>Tier benötigt von zu Hause mitgebrachtes Futter statt Standardfutter</template>
      </AppCheckboxField>
      <AppFormField label="Notizen & Hinweise" class="col-span-full"><template #default><small>max. {{ MAX_PET_NOTE_LENGTH }} Zeichen</small><textarea v-model="form.note" class="min-w-0 resize-y rounded-lg border border-[var(--border)] bg-white px-[10px] py-[9px] text-[var(--text)] [font:inherit]" :maxlength="MAX_PET_NOTE_LENGTH" rows="6" placeholder="" /></template></AppFormField>
      <p v-if="error" class="col-span-full m-0 text-xs text-[#9b4444]">Bitte gib einen Namen an.</p>
      <div class="mt-[23px] flex flex-col-reverse gap-[9px] [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto"><AppButton type="button" variant="secondary" @click="$emit('close')">Abbrechen</AppButton><AppButton variant="primary" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Tierprofil speichern' }}</AppButton></div>
    </form>
  </BaseModal>
</template>
