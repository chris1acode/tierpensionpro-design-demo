<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    active?: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    growMobile?: boolean
  }>(),
  { size: 'sm', growMobile: false },
)

defineEmits<{ click: [] }>()

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-[10px] py-[6px] text-[11px]',
  md: 'px-[13px] py-2 text-xs',
  lg: 'px-4 py-2 text-xs',
}
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="rounded-md border-0 bg-transparent font-bold text-app-muted no-underline"
    active-class="bg-white text-app-text shadow-[0_1px_3px_rgba(36,33,31,.12)]"
    :class="[sizeClasses[size], growMobile ? 'max-sm:flex-1 max-sm:text-center' : '']"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    type="button"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-[5px] rounded-md border-0 bg-transparent font-bold text-app-muted disabled:cursor-not-allowed disabled:opacity-45"
    :class="[sizeClasses[size], active ? 'bg-white text-app-text shadow-[0_1px_3px_rgba(36,33,31,.12)]' : '', growMobile ? 'max-sm:flex-1' : '']"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
