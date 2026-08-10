<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDownToLine, ArrowUpFromLine, Check, ClipboardCheck, Search } from '@lucide/vue'
import type { BookingView, DepartureView } from '../domain'
import { matchesSearchTerm, resolveSearchTerm } from '../shared/search'
import { usePensionStore } from '../usePensionStore'

const props = defineProps<{ query: string }>()
const emit = defineEmits<{ checkIn: [booking: BookingView]; checkOut: [departure: DepartureView] }>()
const store = usePensionStore()
const activeView = ref<'arrivals' | 'departures'>('arrivals')
const localQuery = ref('')

const searchTerm = computed(() => resolveSearchTerm(localQuery.value, props.query))
const matchesSearch = (booking: BookingView) => matchesSearchTerm(searchTerm.value, [
  booking.pet.name,
  booking.pet.breed,
  booking.customer.firstName,
  booking.customer.lastName,
  booking.room.name
])
const arrivals = computed(() => store.arrivals.value.filter(matchesSearch))
const departures = computed(() => store.departures.value.filter(matchesSearch))
const visibleBookings = computed(() => activeView.value === 'arrivals' ? arrivals.value : departures.value)
</script>

<template>
  <main class="operations-page">
    <div class="page-heading">
      <div><p class="eyebrow">Tagesgeschäft</p><h1>Check-in/out</h1><p>Alle anstehenden Anreisen und Abreisen zentral bearbeiten.</p></div>
      <span class="page-count"><ClipboardCheck :size="17" /> {{ store.arrivals.value.length + store.departures.value.length }} offen</span>
    </div>
    <section class="operations-summary" aria-label="Offene Vorgänge">
      <button :class="{ active: activeView === 'arrivals' }" @click="activeView = 'arrivals'"><span class="metric-icon orange"><ArrowDownToLine /></span><span><small>Anreisen</small><strong>{{ store.arrivals.value.length }}</strong><em>noch einzuchecken</em></span></button>
      <button :class="{ active: activeView === 'departures' }" @click="activeView = 'departures'"><span class="metric-icon teal"><ArrowUpFromLine /></span><span><small>Abreisen</small><strong>{{ store.departures.value.length }}</strong><em>noch auszuchecken</em></span></button>
    </section>
    <section class="panel operations-list">
      <header><div><h2>{{ activeView === 'arrivals' ? 'Anstehende Anreisen' : 'Anstehende Abreisen' }}</h2><p>{{ visibleBookings.length }} passende Vorgänge</p></div><label class="directory-search"><Search :size="17" /><input v-model="localQuery" placeholder="Tier, Kunde oder Zimmer suchen …" /></label></header>
      <div v-if="visibleBookings.length" class="operation-rows">
        <article v-for="booking in visibleBookings" :key="booking.id" class="operation-row">
          <div class="pet-avatar" :style="{ background: booking.pet.color }">{{ booking.pet.initials }}</div>
          <div class="pet-info"><strong>{{ booking.pet.name }}</strong><span>{{ booking.pet.breed }} · {{ booking.customer.firstName }} {{ booking.customer.lastName }}</span></div>
          <div class="operation-room"><small>Zimmer</small><strong>{{ booking.room.name }}</strong></div>
          <div class="operation-time"><small>{{ activeView === 'arrivals' ? 'Ankunft' : 'Abholung' }}</small><strong>{{ activeView === 'arrivals' ? `${booking.arrival} Uhr` : 'Heute' }}</strong></div>
          <button v-if="activeView === 'arrivals'" class="primary-button" @click="emit('checkIn', booking)"><ArrowDownToLine :size="16" /> Einchecken</button>
          <button v-else class="primary-button" @click="emit('checkOut', booking as DepartureView)"><ArrowUpFromLine :size="16" /> Auschecken</button>
        </article>
      </div>
      <div v-else class="empty-state"><span><Search v-if="searchTerm" /><Check v-else /></span><strong>{{ searchTerm ? 'Keine passenden Vorgänge.' : 'Alles erledigt.' }}</strong><p>{{ searchTerm ? 'Versuche einen anderen Suchbegriff.' : 'In diesem Bereich sind keine Vorgänge mehr offen.' }}</p></div>
    </section>
  </main>
</template>
