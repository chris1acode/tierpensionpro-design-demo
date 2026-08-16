<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="flex flex-wrap items-center gap-[9px] text-[13px] font-semibold text-app-text">
    <input v-model="model" type="checkbox" class="size-[17px] accent-primary" />
    <span><slot /></span>
    <small v-if="$slots.description" class="basis-full ml-[26px] text-[11px] font-normal text-app-muted"><slot name="description" /></small>
  </label>
</template>
