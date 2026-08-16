<script setup lang="ts">
import type { Pet } from '../domain'

const selectedPetIds = defineModel<string[]>({ required: true })

defineProps<{
  pets: Pick<Pet, 'id' | 'name'>[]
  description: string
  disabled?: boolean
}>()

const emit = defineEmits<{ change: [] }>()

function togglePet(petId: string, checked: boolean) {
  selectedPetIds.value = checked
    ? [...selectedPetIds.value, petId]
    : selectedPetIds.value.filter((id) => id !== petId)
  emit('change')
}
</script>

<template>
  <fieldset
    :disabled="disabled"
    class="m-0 min-w-0 rounded-lg border border-app-border px-[10px] pb-[9px] pt-0"
  >
    <legend class="px-[3px] text-[11px] font-bold text-app-muted">Tiere</legend>
    <p class="mb-[7px] mt-0 text-[11px] leading-[1.35] text-app-muted">{{ description }}</p>
    <label
      v-for="pet in pets"
      :key="pet.id"
      class="!mt-[5px] !flex !grid-cols-none items-center gap-[7px] !text-xs !font-semibold !text-app-text"
    >
      <input
        :checked="selectedPetIds.includes(pet.id)"
        type="checkbox"
        :value="pet.id"
        class="!h-[15px] !w-[15px] accent-[#a74613]"
        @change="togglePet(pet.id, ($event.target as HTMLInputElement).checked)"
      />
      <span>{{ pet.name }}</span>
    </label>
  </fieldset>
</template>
