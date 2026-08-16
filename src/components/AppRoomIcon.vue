<script setup lang="ts">
import { Cat, Dog } from '@lucide/vue'

defineProps<{
  category: 'Hundezimmer' | 'Katzenzimmer'
  size?: number
}>()
</script>

<template>
  <span
    class="grid size-[35px] flex-none place-items-center rounded-lg bg-[#e4eff0] text-[var(--petrol)]"
    :class="category === 'Katzenzimmer' && 'bg-[#f3e8dd] text-[#8e582b]'"
  >
    <Dog v-if="category === 'Hundezimmer'" :size="size ?? 19" />
    <Cat v-else :size="size ?? 19" />
  </span>
</template>
