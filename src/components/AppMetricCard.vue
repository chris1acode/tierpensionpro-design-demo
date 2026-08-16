<script setup lang="ts">
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { ArrowRight } from '@lucide/vue'

defineProps<{
  to: RouteLocationRaw
  ariaLabel: string
  icon: Component
  color: 'orange' | 'teal'
  label: string
  hint: string
}>()

const iconColorClasses: Record<'orange' | 'teal', string> = {
  orange: 'bg-[#fbe8dd] text-[#b94b12]',
  teal: 'bg-[#e4eff0] text-[#2f5d62]',
}
</script>

<template>
  <RouterLink
    :to="to"
    :aria-label="ariaLabel"
    class="relative flex items-start gap-[15px] rounded-xl border border-[#ded9d3] bg-white py-5 pl-5 pr-12 text-inherit no-underline transition hover:-translate-y-px hover:border-[#c9bcb2] hover:shadow-[0_6px_18px_rgba(36,33,31,.07)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[rgba(184,75,18,.24)] focus-visible:outline-offset-2"
  >
    <span class="grid h-[43px] w-[43px] flex-none place-items-center rounded-[10px] [&>svg]:w-[21px]" :class="iconColorClasses[color]">
      <component :is="icon" />
    </span>
    <div class="min-w-0">
      <small class="block font-semibold text-[#6d6762]">{{ label }}</small>
      <strong class="mb-0.5 mt-[3px] block text-[27px] font-bold [font-family:'Manrope',sans-serif]"><slot /></strong>
      <p class="m-0 text-xs text-[#6d6762]">{{ hint }}</p>
    </div>
    <ArrowRight class="absolute right-5 top-[22px] text-[#df6420]" :size="18" />
  </RouterLink>
</template>
