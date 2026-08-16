<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  customerId: string
  compact?: boolean
}>(), {
  compact: false
})
</script>

<template>
  <RouterLink
    :to="{ name: 'customers', query: { customerId } }"
    class="block font-bold leading-[inherit] no-underline hover:underline"
    :class="compact ? 'mt-[3px] text-[11px] text-petrol' : 'text-petrol'"
  ><slot /></RouterLink>
</template>
