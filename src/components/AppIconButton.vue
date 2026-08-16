<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    variant?: 'default' | 'danger'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'default', type: 'button' },
)

const variantClasses: Record<string, string> = {
  default: 'border-0 bg-transparent p-2 text-[#625d58] hover:bg-[#f1efeb]',
  danger: 'h-[38px] w-[38px] border border-[#ecc6c6] bg-white text-[#a52f2f] hover:bg-[#f1efeb]',
}

const button = ref<HTMLButtonElement | null>(null)
defineExpose({ focus: () => button.value?.focus() })
</script>

<template>
  <button
    ref="button"
    :type="type"
    :disabled="disabled"
    class="inline-grid place-items-center rounded-lg disabled:cursor-not-allowed disabled:opacity-45"
    :class="variantClasses[variant]"
  >
    <slot />
  </button>
</template>
