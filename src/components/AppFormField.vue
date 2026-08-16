<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <label class="grid gap-[6px] text-[11px] font-bold text-[var(--muted)]">
    <span>{{ label }}</span>
    <slot />
  </label>
</template>
