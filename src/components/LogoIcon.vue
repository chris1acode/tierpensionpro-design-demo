<script setup lang="ts">
defineProps<{
  size?: number | string
  color?: string
}>()
</script>

<template>
  <img
    src="/assets/logo.svg"
    :width="size || 24"
    :height="size || 24"
    alt="Tierpension Logo"
    :style="{ color: color || 'inherit' }"
  />
</template>
