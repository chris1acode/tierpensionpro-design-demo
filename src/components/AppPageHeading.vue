<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-[29px] flex flex-col items-start gap-[18px] sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="mb-[7px] mt-[5px] text-2xl font-bold tracking-[-0.6px] [font-family:'Manrope',sans-serif] sm:text-[32px]">{{ title }}</h1>
      <p v-if="description" class="m-0 text-base text-[var(--muted)]">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
