<script setup lang="ts">
import AppEyebrow from './AppEyebrow.vue'

defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-[29px] flex flex-col items-start gap-[18px] sm:flex-row sm:items-end sm:justify-between">
    <div>
      <AppEyebrow v-if="eyebrow">{{ eyebrow }}</AppEyebrow>
      <h1 class="mb-[7px] mt-[5px] text-2xl font-bold tracking-[-0.6px] [font-family:'Manrope',sans-serif] sm:text-[32px]">{{ title }}</h1>
      <p v-if="description" class="m-0 text-base text-app-muted">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
