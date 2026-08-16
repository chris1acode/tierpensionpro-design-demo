<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'orange' | 'teal' | 'rose'
  }>(),
  { variant: 'teal' },
)

const variantClasses: Record<'orange' | 'teal' | 'rose', string> = {
  orange: 'bg-[#fbe8dd] text-[#b94b12]',
  teal: 'bg-[#e4eff0] text-[#2f5d62]',
  rose: 'bg-[#f6e5e5] text-[#9b4444]',
}
</script>

<template>
  <span class="grid size-[43px] flex-none place-items-center rounded-[10px] [&>svg]:size-[21px]" :class="variantClasses[variant]">
    <slot />
  </span>
</template>
