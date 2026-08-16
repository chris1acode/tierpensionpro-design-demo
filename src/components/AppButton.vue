<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    variant: 'primary' | 'secondary' | 'danger' | 'link' | 'text'
    to?: RouteLocationRaw
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { type: 'button' },
)

const variantClasses: Record<string, string> = {
  primary:
    'min-h-10 px-[15px] border border-[var(--primary-button-border)] bg-[var(--primary-button)] text-[var(--primary-button-text)] hover:bg-[var(--primary-button-hover)] hover:border-[var(--primary-button-hover)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[rgba(223,100,32,.35)] focus-visible:outline-offset-2',
  secondary: 'min-h-10 px-[15px] border border-[var(--border)] bg-white text-[#48433f] hover:bg-[#f5f2ee]',
  danger: 'min-h-10 px-[15px] border border-[#c23a3a] bg-[#c23a3a] text-white hover:bg-[#a52f2f]',
  link: 'px-2 border-0 bg-transparent text-[var(--primary)] hover:text-[var(--primary-dark)] hover:underline',
  text: 'px-2 border-0 bg-transparent text-[var(--petrol)] hover:bg-[#f5f2ee] hover:text-[var(--text)]',
}
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="inline-flex items-center justify-center gap-[7px] rounded-lg text-sm font-bold no-underline"
    :class="variantClasses[variant]"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-[7px] rounded-lg text-sm font-bold disabled:cursor-not-allowed disabled:opacity-45"
    :class="variantClasses[variant]"
  >
    <slot />
  </button>
</template>
