<script setup lang="ts">
import { computed } from 'vue'
import { Lock } from '@lucide/vue'
import type { OccupancyRangeDays } from '../domain'
import { toLocalIsoDate } from '../domain/bookingPeriod'
import { usePensionStore } from '../usePensionStore'

const store = usePensionStore()
const rangeOptions: { value: OccupancyRangeDays; label: string }[] = [
  { value: 7, label: '7 Tage' },
  { value: 14, label: '14 Tage' },
  { value: 30, label: '30 Tage' }
]

const todayIso = computed(() => toLocalIsoDate(new Date()))
const gridStyle = computed(() => ({
  gridTemplateColumns: `200px repeat(${store.occupancyDates.value.length}, minmax(64px, 1fr))`
}))

const weekdayFormatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short' })
const dayFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' })

function formatWeekday(date: string): string {
  return weekdayFormatter.format(new Date(`${date}T00:00:00`))
}

function formatDay(date: string): string {
  return dayFormatter.format(new Date(`${date}T00:00:00`))
}

function rateClass(rate: number): string {
  if (rate >= 90) return 'high'
  if (rate >= 60) return 'mid'
  return 'low'
}
</script>

<template>
  <main class="occupancy-page">
    <div class="page-heading">
      <div><p class="eyebrow">Kapazitätsplanung</p><h1>Belegung</h1><p>Zimmerbelegung als Tages-Spaltenansicht mit Auslastungsanzeige.</p></div>
      <div class="range-filters" aria-label="Zeitraum">
        <button
          v-for="option in rangeOptions"
          :key="option.value"
          :class="{ active: store.occupancyRangeDays.value === option.value }"
          @click="store.setOccupancyRangeDays(option.value)"
        >{{ option.label }}</button>
      </div>
    </div>

    <section class="panel occupancy-panel-wide">
      <header>
        <div><h2>Zimmer × Zeitraum</h2><p>{{ store.roomTimelines.value.length }} Zimmer über {{ store.occupancyDates.value.length }} Tage</p></div>
        <div class="occupancy-legend">
          <span><i class="legend-swatch free" /> Frei</span>
          <span><i class="legend-swatch occupied" /> Belegt</span>
          <span><i class="legend-swatch maintenance" /> Gesperrt</span>
        </div>
      </header>

      <div class="occupancy-scroll">
        <div class="occupancy-grid" :style="gridStyle">
          <div class="occupancy-corner">Zimmer</div>
          <div
            v-for="day in store.dailyOccupancy.value"
            :key="day.date"
            class="occupancy-day-header"
            :class="{ today: day.date === todayIso }"
          >
            <span class="occupancy-weekday">{{ formatWeekday(day.date) }}</span>
            <span class="occupancy-daynum">{{ formatDay(day.date) }}</span>
            <span class="occupancy-rate" :class="rateClass(day.rate)">{{ day.rate }} %</span>
          </div>

          <template v-for="room in store.roomTimelines.value" :key="room.id">
            <div class="occupancy-room-label">
              <strong>{{ room.name }}</strong>
              <span>{{ room.category }} · {{ room.capacity }} Plätze</span>
              <span v-if="room.operationalState.status === 'maintenance'" class="status-badge full"><Lock :size="11" /> Gesperrt</span>
            </div>
            <div
              v-for="segment in room.segments"
              :key="segment.date"
              class="occupancy-cell"
              :class="{ maintenance: room.operationalState.status === 'maintenance', today: segment.date === todayIso }"
            >
              <template v-if="room.operationalState.status === 'maintenance'">
                <Lock :size="13" />
              </template>
              <template v-else-if="segment.bookings.length">
                <span
                  v-for="booking in segment.bookings"
                  :key="booking.id"
                  class="occupancy-chip"
                  :style="{ background: booking.pet.color }"
                  :title="`${booking.pet.name} · ${booking.customer.firstName} ${booking.customer.lastName}`"
                >{{ booking.pet.initials }}</span>
              </template>
            </div>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>
