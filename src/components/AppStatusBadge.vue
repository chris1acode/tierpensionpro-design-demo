<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'locked'
}>(), {
  variant: 'locked'
})

const variantClasses = {
  locked: 'bg-[#e7e2dc] text-[#8b847e]'
}
</script>

<template>
  <span class="inline-flex w-fit items-center gap-1 rounded-full px-[9px] py-[5px] text-[10px] font-bold" :class="variantClasses[variant]">
    <slot />
  </span>
</template>
