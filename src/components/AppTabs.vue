<script setup lang="ts">
withDefaults(defineProps<{ growMobile?: boolean }>(), { growMobile: false })
</script>

<template>
  <div
    class="inline-flex gap-0 rounded-lg bg-[#f3f0ec] p-[3px]"
    :class="growMobile ? 'max-sm:flex max-sm:w-full' : ''"
  >
    <slot />
  </div>
</template>
