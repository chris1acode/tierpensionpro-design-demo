<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Customer } from '../domain'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'

const props = defineProps<{
  customers: readonly Customer[]
  inputId: string
  label: string
  placeholder?: string
  minQueryLength?: number
}>()
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ selected: [customer: Customer]; cleared: [] }>()

const query = ref('')
const isOpen = ref(false)
const activeIndex = ref(-1)
const input = ref<HTMLInputElement | null>(null)
let closeTimer: ReturnType<typeof window.setTimeout> | undefined
const listId = `${props.inputId}-suggestions`
const selectedCustomer = computed(() => props.customers.find((customer) => customer.id === model.value))
const minimumQueryLength = computed(() => Math.max(0, props.minQueryLength ?? 0))
const normalizedQuery = computed(() => resolveSearchTerm(query.value))
const queryIsLongEnough = computed(() => normalizedQuery.value.length >= minimumQueryLength.value)
const matches = computed(() => {
  if (!queryIsLongEnough.value) return []
  const customers = props.customers.filter((customer) => matchesSearchTerm(normalizedQuery.value, [
    customer.firstName, customer.lastName, customer.email, customer.phone
  ]))
  return customers.slice(0, 8)
})

watch(selectedCustomer, (customer) => {
  if (customer && !isOpen.value) query.value = `${customer.firstName} ${customer.lastName}`
  if (!customer && !isOpen.value) query.value = ''
}, { immediate: true })

function open(): void {
  if (closeTimer) window.clearTimeout(closeTimer)
  isOpen.value = true
  activeIndex.value = matches.value.length ? 0 : -1
}

function handleInput(event: Event): void {
  query.value = (event.target as HTMLInputElement).value
  if (model.value) {
    model.value = ''
    emit('cleared')
  }
  open()
}

function select(customer: Customer): void {
  model.value = customer.id
  query.value = `${customer.firstName} ${customer.lastName}`
  isOpen.value = false
  activeIndex.value = -1
  emit('selected', customer)
  void nextTick(() => input.value?.focus())
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) open()
    else activeIndex.value = Math.min(activeIndex.value + 1, matches.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) open()
    else activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && isOpen.value && matches.value[activeIndex.value]) {
    event.preventDefault()
    select(matches.value[activeIndex.value])
  } else if (event.key === 'Escape') {
    isOpen.value = false
    activeIndex.value = -1
    query.value = selectedCustomer.value ? `${selectedCustomer.value.firstName} ${selectedCustomer.value.lastName}` : ''
  }
}

function close(): void {
  if (closeTimer) window.clearTimeout(closeTimer)
  closeTimer = window.setTimeout(() => {
    isOpen.value = false
    activeIndex.value = -1
    query.value = selectedCustomer.value ? `${selectedCustomer.value.firstName} ${selectedCustomer.value.lastName}` : ''
    closeTimer = undefined
  }, 120)
}

onBeforeUnmount(() => {
  if (closeTimer) window.clearTimeout(closeTimer)
})
</script>

<template>
  <div class="relative">
    <input
      :id="inputId"
      ref="input"
      :value="query"
      :aria-label="label"
      :aria-controls="listId"
      :aria-expanded="isOpen"
      :aria-activedescendant="isOpen && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined"
      aria-autocomplete="list"
      autocomplete="off"
      role="combobox"
      type="search"
      :placeholder="placeholder ?? 'Kunden suchen …'"
      @focus="open"
      @input="handleInput"
      @keydown="handleKeydown"
      @blur="close"
      class="h-10 w-full min-w-0 rounded-lg border border-app-border bg-white px-[10px] text-app-text"
    />
    <ul v-if="isOpen" :id="listId" class="absolute inset-x-0 top-[calc(100%+4px)] z-10 m-0 max-h-[244px] list-none overflow-auto rounded-lg border border-app-border bg-white p-1 shadow-[0_8px_20px_rgba(50,37,28,.14)]" role="listbox" :aria-label="`${label}-Vorschläge`">
      <li v-for="(customer, index) in matches" :id="`${listId}-${index}`" :key="customer.id" role="option" :aria-selected="customer.id === model">
        <button type="button" class="grid w-full gap-0.5 rounded-md border-0 bg-transparent px-[10px] py-[9px] text-left text-app-text hover:bg-[#fff3eb]" :class="{ 'bg-[#fff3eb]': index === activeIndex }" @mousedown.prevent @click="select(customer)"><strong class="text-xs">{{ customer.firstName }} {{ customer.lastName }}</strong><span class="text-[11px] text-app-muted">{{ customer.email }} · {{ customer.phone }}</span></button>
      </li>
      <li v-if="!queryIsLongEnough" class="px-[10px] py-[9px] text-[11px] text-app-muted" role="status">{{ minimumQueryLength }} Zeichen eingeben, um Kunden zu suchen.</li>
      <li v-else-if="!matches.length" class="px-[10px] py-[9px] text-[11px] text-app-muted" role="status">Keine Kunden gefunden.</li>
    </ul>
  </div>
</template>
