<script setup lang="ts">
defineProps<{
  initials: string
  color: string
}>()
</script>

<template>
  <span
    class="pet-avatar grid h-[42px] w-[42px] flex-none place-items-center rounded-full text-xs font-bold text-[#4b504e]"
    :style="{ background: color }"
    aria-hidden="true"
  >{{ initials }}</span>
</template>
