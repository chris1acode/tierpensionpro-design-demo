<script setup lang="ts">
withDefaults(
  defineProps<{
    currentPage: number
    pageCount: number
    ariaLabel: string
    pageItems?: Array<number | 'ellipsis-left' | 'ellipsis-right'>
  }>(),
  { pageItems: undefined },
)

const emit = defineEmits<{ select: [page: number] }>()

const buttonClasses =
  'grid h-8 min-w-8 place-items-center rounded-[7px] border border-[var(--border)] bg-white px-2 font-bold text-[var(--text)] enabled:hover:border-[var(--primary)] enabled:hover:bg-[#fff4ec] enabled:hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40'
const activeButtonClasses = 'border-[var(--primary)] bg-[#fff4ec] text-[var(--primary)]'
</script>

<template>
  <nav v-if="pageCount > 1" class="flex flex-wrap items-center justify-center gap-1.5 border-t border-[var(--border)] px-4 py-3.5" :aria-label="ariaLabel">
    <button v-if="pageItems" type="button" :class="buttonClasses" :disabled="currentPage === 1" aria-label="Erste Seite" @click="emit('select', 1)">«</button>
    <button type="button" :class="buttonClasses" :disabled="currentPage === 1" aria-label="Vorherige Seite" @click="emit('select', currentPage - 1)">
      <slot name="prev">‹</slot>
    </button>
    <template v-if="pageItems">
      <template v-for="item in pageItems" :key="item">
        <span v-if="typeof item === 'string'" class="min-w-[12px] text-[var(--muted)] tracking-[.08em]" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          :class="[buttonClasses, item === currentPage ? activeButtonClasses : '']"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click="emit('select', item)"
        >{{ item }}</button>
      </template>
    </template>
    <span v-else class="min-w-[105px] text-center text-xs font-bold text-[var(--muted)]">Seite {{ currentPage }} von {{ pageCount }}</span>
    <button type="button" :class="buttonClasses" :disabled="currentPage === pageCount" aria-label="Nächste Seite" @click="emit('select', currentPage + 1)">
      <slot name="next">›</slot>
    </button>
    <button v-if="pageItems" type="button" :class="buttonClasses" :disabled="currentPage === pageCount" aria-label="Letzte Seite" @click="emit('select', pageCount)">»</button>
  </nav>
</template>
