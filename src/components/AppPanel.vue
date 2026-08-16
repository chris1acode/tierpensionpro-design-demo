<script setup lang="ts">
withDefaults(defineProps<{
  as?: 'article' | 'aside' | 'div' | 'section'
}>(), {
  as: 'section',
})
</script>

<template>
  <component
    :is="as"
    class="overflow-hidden rounded-xl border border-[var(--border)] bg-white [&>header]:flex [&>header]:items-center [&>header]:justify-between [&>header]:gap-[10px] [&>header]:border-b [&>header]:border-[#e8e4df] [&>header]:px-4 [&>header]:py-[18px] max-[680px]:[&>header]:items-start sm:[&>header]:px-[22px] sm:[&>header]:py-[21px] [&>header_h2]:mb-[5px] [&>header_h2]:text-[18px] [&>header_h2]:font-bold [&>header_h2]:[font-family:'Manrope',sans-serif] [&>header_p]:m-0 [&>header_p]:text-sm [&>header_p]:text-[var(--muted)]"
  >
    <slot />
  </component>
</template>
