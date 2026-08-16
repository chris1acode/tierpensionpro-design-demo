<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'inline' }>(), { variant: 'default' })
</script>

<template>
  <div class="text-center" :class="variant === 'inline' ? 'px-[22px] py-[18px] text-left' : 'px-5 py-[45px]'">
    <span v-if="$slots.icon" class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#e7f2eb] text-[#3f7a5c]">
      <slot name="icon" />
    </span>
    <strong v-if="$slots.title" class="block"><slot name="title" /></strong>
    <p v-if="$slots.description" class="m-0 text-[13px] text-app-muted"><slot name="description" /></p>
    <slot />
  </div>
</template>
