<script setup lang="ts">
import { ref } from 'vue'
import type { CustomerView, PetSpecies } from '../domain'
import { usePensionStore } from '../usePensionStore'
import { MAX_ALLERGY_NOTE_LENGTH, MAX_FEEDING_PLAN_LENGTH, MAX_MEDICATION_PLAN_LENGTH, MAX_PET_NOTE_LENGTH, MAX_VACCINATION_STATUS_LENGTH } from '../domain/petProfile'
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
    name: props.pet.name, species: props.pet.species, breed: props.pet.breed, note: props.pet.note ?? '',
    feedingPlan: props.pet.feedingPlan ?? '', medicationPlan: props.pet.medicationPlan ?? '', allergyNote: props.pet.allergyNote ?? '',
    vaccinationStatus: props.pet.vaccinationStatus ?? '', veterinaryPracticeName: props.pet.veterinaryContact?.practiceName ?? '', veterinaryPhone: props.pet.veterinaryContact?.phone ?? ''
  }
  : { name: '', species: 'dog' as PetSpecies, breed: '', note: '', feedingPlan: '', medicationPlan: '', allergyNote: '', vaccinationStatus: '', veterinaryPracticeName: '', veterinaryPhone: '' })

function submit() {
  const { veterinaryPracticeName, veterinaryPhone, species, ...input } = form.value
  const veterinaryContact = veterinaryPracticeName || veterinaryPhone ? { practiceName: veterinaryPracticeName, phone: veterinaryPhone } : undefined

  if (props.mode === 'edit' && props.pet) {
    const saved = store.updatePet(props.pet.id, { ...input, ...(veterinaryContact ? { veterinaryContact } : {}) })
    error.value = !saved
    if (saved) emit('saved')
    return
  }

  if (!props.customerId) return
  const created = store.createPet({ customerId: props.customerId, species, ...input, ...(veterinaryContact ? { veterinaryContact } : {}) })
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
      <label>Rasse *<input v-model="form.breed" autocomplete="off" /></label>
      <label class="wide">Hinweis <small>optional, max. {{ MAX_PET_NOTE_LENGTH }} Zeichen</small><textarea v-model="form.note" :maxlength="MAX_PET_NOTE_LENGTH" rows="2" /></label>
      <label class="wide">Fütterungsplan <small>optional, max. {{ MAX_FEEDING_PLAN_LENGTH }} Zeichen</small><textarea v-model="form.feedingPlan" :maxlength="MAX_FEEDING_PLAN_LENGTH" rows="2" placeholder="z. B. Menge, Zeiten und Unverträglichkeiten" /></label>
      <label class="wide">Medikationsplan <small>optional, max. {{ MAX_MEDICATION_PLAN_LENGTH }} Zeichen</small><textarea v-model="form.medicationPlan" :maxlength="MAX_MEDICATION_PLAN_LENGTH" rows="2" placeholder="z. B. Medikament, Menge und Uhrzeit" /></label>
      <label class="wide">Allergien & Unverträglichkeiten <small>optional, max. {{ MAX_ALLERGY_NOTE_LENGTH }} Zeichen</small><textarea v-model="form.allergyNote" :maxlength="MAX_ALLERGY_NOTE_LENGTH" rows="2" placeholder="z. B. Futtermittel oder Stoffe, die vermieden werden müssen" /></label>
      <label class="wide">Impfstatus <small>optional, max. {{ MAX_VACCINATION_STATUS_LENGTH }} Zeichen</small><textarea v-model="form.vaccinationStatus" :maxlength="MAX_VACCINATION_STATUS_LENGTH" rows="2" placeholder="z. B. Impfpass geprüft, gültig bis …" /></label>
      <label>Tierarztpraxis <small>optional</small><input v-model="form.veterinaryPracticeName" autocomplete="organization" placeholder="z. B. Tierarztpraxis am Park" /></label>
      <label>Tierarzttelefon <small>optional</small><input v-model="form.veterinaryPhone" autocomplete="tel" inputmode="tel" placeholder="z. B. 030 123 45 67" /></label>
      <p v-if="error" class="form-error">Bitte Name und Rasse vollständig angeben; operative Angaben dürfen maximal {{ MAX_PET_NOTE_LENGTH }} Zeichen lang sein.</p>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="$emit('close')">Abbrechen</button><button class="primary-button" type="submit">{{ mode === 'edit' ? 'Änderungen speichern' : 'Tierprofil speichern' }}</button></div>
    </form>
  </BaseModal>
</template>
