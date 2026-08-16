<script setup lang="ts">
import type { BookingStatus } from '../domain'

withDefaults(defineProps<{
  status: BookingStatus | 'accepted'
}>(), {
  status: 'confirmed'
})

const statusClasses: Record<BookingStatus | 'accepted', string> = {
  confirmed: 'bg-[#faf0d9] text-[#84601c]',
  'checked-in': 'bg-[#e4eff0] text-[#2f5d62]',
  'checked-out': 'bg-[#eeeae6] text-[#67615c]',
  accepted: 'bg-[#e7f2eb] text-[#315f48]'
}
</script>

<template>
  <span class="inline-flex w-fit items-center rounded-full px-2 py-[5px] text-[9px] font-bold" :class="statusClasses[status]">
    <slot />
  </span>
</template>
