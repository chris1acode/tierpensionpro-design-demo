<script setup lang="ts">
const model = defineModel<boolean | undefined>()
</script>

<template>
  <label class="flex items-start gap-[9px] rounded-lg border border-[#dfb2b9] bg-[#f9e6e8] px-3 py-[10px] text-xs leading-[1.4] text-[#7a1f2c]">
    <input v-model="model" type="checkbox" class="mt-[2px] size-auto accent-[var(--primary)]" />
    <span class="min-w-0"><strong><slot name="title" /></strong>&nbsp;<slot /></span>
  </label>
</template>
