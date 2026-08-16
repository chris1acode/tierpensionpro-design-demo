<script setup lang="ts">
withDefaults(defineProps<{
  as?: 'article' | 'aside' | 'div' | 'section'
}>(), {
  as: 'section',
})
</script>

<template>
  <component :is="as" class="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
    <slot />
  </component>
</template>

<style scoped>
:slotted(header) { @apply flex items-center justify-between gap-[10px] border-b border-[#e8e4df] px-4 py-[18px] max-[680px]:items-start sm:px-[22px] sm:py-[21px]; }
:slotted(header h2) { @apply mb-[5px] text-[18px] font-bold [font-family:'Manrope',sans-serif]; }
:slotted(header p) { @apply m-0 text-sm text-[var(--muted)]; }
</style>
