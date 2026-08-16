<script setup lang="ts">
const items = [
  { label: 'Frei', classes: 'border border-[var(--border)] bg-[#f3f0ec]' },
  { label: 'Teilbelegt', classes: 'bg-[var(--petrol)]' },
  { label: 'Ausgebucht', classes: 'bg-[#4c5f99]' },
  { label: 'Überbucht', classes: 'bg-[#8f2f3c]' },
  { label: 'Gesperrt', classes: 'bg-[#e7e2dc]' },
  { label: 'Geschlossen', classes: 'border border-[#e3b8a8] bg-[#f7ece8]' }
]
</script>

<template>
  <div class="flex gap-[14px] text-[11px] font-semibold text-[var(--muted)]" aria-label="Legende zur Zimmerbelegung">
    <span v-for="item in items" :key="item.label" class="inline-flex items-center gap-[6px]">
      <i class="inline-block size-[11px] rounded-[3px]" :class="item.classes" aria-hidden="true" />
      {{ item.label }}
    </span>
  </div>
</template>
