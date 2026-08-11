<script setup lang="ts">
import { ref } from 'vue'
import type { CustomerView, PetSpecies } from '../domain'
import { usePensionStore } from '../usePensionStore'
import { MAX_PET_NOTE_LENGTH } from '../domain/petProfile'
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
  <BaseModal labelled-by="pet-form-heading" modal-class="pet-form-modal" @close="$emit('close')">
    <p class="eyebrow">{{ mode === 'edit' ? 'Tierprofil' : 'Stammdaten' }}</p>
    <h2 id="pet-form-heading">{{ mode === 'edit' ? `${pet?.name} bearbeiten` : 'Tier anlegen' }}</h2>
    <form class="pet-form" @submit.prevent="submit">
      <label>Name *<input v-model="form.name" autocomplete="off" /></label>
      <label v-if="mode === 'create'">Tierart *<select v-model="form.species"><option value="dog">Hund</option><option value="cat">Katze</option></select></label>
      <label class="wide checkbox-field"><input v-model="form.specialFood" type="checkbox" /> Besonderes Futter <small>Tier benötigt von zu Hause mitgebrachtes Futter statt Standardfutter</small></label>
      <label class="wide">Notizen & Hinweise <small>max. {{ MAX_PET_NOTE_LENGTH }} Zeichen</small><textarea v-model="form.note" :maxlength="MAX_PET_NOTE_LENGTH" rows="6" placeholder="" /></label>
      <p v-if="error" class="form-error">Bitte gib einen Namen an.</p>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="$emit('close')">Abbrechen</button><button class="primary-button" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Tierprofil speichern' }}</button></div>
    </form>
  </BaseModal>
</template>
