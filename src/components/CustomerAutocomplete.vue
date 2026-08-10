<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Customer } from '../domain'

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
const listId = `${props.inputId}-suggestions`
const selectedCustomer = computed(() => props.customers.find((customer) => customer.id === model.value))
const minimumQueryLength = computed(() => Math.max(0, props.minQueryLength ?? 0))
const normalizedQuery = computed(() => query.value.trim())
const queryIsLongEnough = computed(() => normalizedQuery.value.length >= minimumQueryLength.value)
const matches = computed(() => {
  if (!queryIsLongEnough.value) return []
  const search = normalizedQuery.value.toLocaleLowerCase('de')
  const customers = props.customers.filter((customer) => `${customer.firstName} ${customer.lastName} ${customer.phone}`.toLocaleLowerCase('de').includes(search))
  return customers.slice(0, 8)
})

watch(selectedCustomer, (customer) => {
  if (customer && !isOpen.value) query.value = `${customer.firstName} ${customer.lastName}`
  if (!customer && !isOpen.value) query.value = ''
}, { immediate: true })

function open(): void {
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
  window.setTimeout(() => {
    isOpen.value = false
    activeIndex.value = -1
    query.value = selectedCustomer.value ? `${selectedCustomer.value.firstName} ${selectedCustomer.value.lastName}` : ''
  }, 120)
}
</script>

<template>
  <div class="customer-autocomplete">
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
      :placeholder="placeholder ?? 'Kund:in suchen …'"
      @focus="open"
      @input="handleInput"
      @keydown="handleKeydown"
      @blur="close"
    />
    <ul v-if="isOpen" :id="listId" class="customer-autocomplete-options" role="listbox" :aria-label="`${label}-Vorschläge`">
      <li v-for="(customer, index) in matches" :id="`${listId}-${index}`" :key="customer.id" role="option" :aria-selected="customer.id === model" :class="{ active: index === activeIndex }">
        <button type="button" @mousedown.prevent @click="select(customer)"><strong>{{ customer.firstName }} {{ customer.lastName }}</strong><span>{{ customer.phone }}</span></button>
      </li>
      <li v-if="!queryIsLongEnough" class="customer-autocomplete-empty" role="status">{{ minimumQueryLength }} Zeichen eingeben, um Kundschaft zu suchen.</li>
      <li v-else-if="!matches.length" class="customer-autocomplete-empty" role="status">Keine Kundschaft gefunden.</li>
    </ul>
  </div>
</template>
