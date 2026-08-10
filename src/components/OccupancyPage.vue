<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarOff, CalendarPlus, ChevronLeft, ChevronRight, Download, Lock, LockKeyhole, Trash2 } from '@lucide/vue'
import type { DailyOccupancy, OccupancyLevel, OccupancyRangeDays } from '../domain'
import { formatDayAndMonth, formatShortWeekday } from '../presentation/dateFormat'
import { usePensionStore } from '../usePensionStore'
import OccupancyReservationModal from './OccupancyReservationModal.vue'
import { downloadCsv } from '../shared/csvExport'

const store = usePensionStore()
const rangeOptions: { value: OccupancyRangeDays; label: string }[] = [
  { value: 7, label: '7 Tage' },
  { value: 14, label: '14 Tage' },
  { value: 30, label: '30 Tage' }
]

const todayIso = computed(() => store.businessDate.value)
const reservationOpen = ref(false)
const closureError = ref('')
const closureDraft = ref({
  startDate: '',
  endDate: '',
  reason: ''
})

function onStartDateChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (value) store.setOccupancyStartDate(value)
}
const gridStyle = computed(() => ({
  gridTemplateColumns: `200px repeat(${store.occupancyDates.value.length}, minmax(64px, 1fr))`
}))

function formatWeekday(date: string): string {
  return formatShortWeekday(date)
}

function formatDay(date: string): string {
  return formatDayAndMonth(date)
}

function occupancyLabel(day: DailyOccupancy): string {
  if (day.level === 'unavailable') return 'Keine Plätze verfügbar'
  if (day.level === 'overbooked') return `Überbucht · ${day.occupied - day.capacity} Plätze zu viel`
  if (day.level === 'full') return 'Ausgebucht'
  if (day.level === 'high') return 'Wenig freie Plätze'
  return `${day.availablePlaces} ${day.availablePlaces === 1 ? 'Platz' : 'Plätze'} frei`
}

function levelClass(level: OccupancyLevel): string {
  return level === 'medium' ? 'mid' : level
}

function occupancyCount(occupied: number, capacity: number): string {
  return `${occupied}/${capacity}`
}

function exportOccupancy() {
  downloadCsv({
    fileName: `belegung-${store.occupancyStartDate.value}.csv`,
    columns: ['Datum', 'Belegt', 'Kapazität', 'Freie Plätze', 'Auslastung', 'Status'],
    rows: store.dailyOccupancy.value.map((day) => [
      day.date, day.occupied, day.capacity, day.availablePlaces, `${day.rate} %`, occupancyLabel(day)
    ])
  })
}

function saveClosure(): void {
  closureError.value = ''
  if (!store.createPensionClosure(closureDraft.value)) {
    closureError.value = 'Bitte einen gültigen Zeitraum für die Schließzeit angeben.'
    return
  }
  closureDraft.value = { startDate: '', endDate: '', reason: '' }
}

function closureLabel(startDate: string, endDate: string): string {
  return startDate === endDate ? formatDay(startDate) : `${formatDay(startDate)} – ${formatDay(endDate)}`
}
</script>

<template>
  <main class="occupancy-page">
    <div class="page-heading">
      <div><p class="eyebrow">Kapazitätsplanung</p><h1>Belegung</h1><p>Zimmerbelegung als kompakte Tages-Spaltenansicht.</p></div>
      <button class="primary-button occupancy-reservation-button" @click="reservationOpen = true"><CalendarPlus :size="17" /> Reservierung anlegen</button>
      <div class="range-filters" aria-label="Zeitraum">
        <button
          v-for="option in rangeOptions"
          :key="option.value"
          :class="{ active: store.occupancyRangeDays.value === option.value }"
          @click="store.setOccupancyRangeDays(option.value)"
        >{{ option.label }}</button>
      </div>
    </div>

    <div class="occupancy-date-nav" role="group" aria-label="Startdatum">
      <button type="button" aria-label="Eine Woche zurück" @click="store.shiftOccupancyStartDate(-7)">
        <ChevronLeft :size="16" />
      </button>
      <label class="occupancy-start-date">
        <span>Start</span>
        <input type="date" :value="store.occupancyStartDate.value" @change="onStartDateChange" />
      </label>
      <button type="button" aria-label="Eine Woche vor" @click="store.shiftOccupancyStartDate(7)">
        <ChevronRight :size="16" />
      </button>
      <button type="button" class="occupancy-today" :disabled="store.occupancyStartDate.value === todayIso" @click="store.jumpOccupancyToToday()">Heute</button>
    </div>

    <section class="panel occupancy-panel-wide">
      <header>
        <div><h2>Zimmer × Zeitraum</h2><p>{{ store.roomTimelines.value.length }} Zimmer über {{ store.occupancyDates.value.length }} Tage</p></div>
        <div class="list-header-actions"><button class="text-button" type="button" aria-label="Belegung als CSV exportieren" @click="exportOccupancy"><Download :size="15" /> Exportieren</button><div class="occupancy-legend">
          <span><i class="legend-swatch free" /> Frei</span>
          <span><i class="legend-swatch occupied" /> Teilbelegt</span>
          <span><i class="legend-swatch full" /> Ausgebucht</span>
          <span><i class="legend-swatch overbooked" /> Überbucht</span>
          <span><i class="legend-swatch maintenance" /> Gesperrt</span>
        </div></div>
      </header>

      <div class="occupancy-scroll">
        <div class="occupancy-grid" :style="gridStyle">
          <div class="occupancy-corner">Zimmer</div>
          <div
            v-for="day in store.dailyOccupancy.value"
            :key="day.date"
            class="occupancy-day-header"
            :class="[levelClass(day.level), { today: day.date === todayIso }]"
            :data-date="day.date"
            :data-occupancy-level="day.level"
          >
            <span class="occupancy-weekday">{{ formatWeekday(day.date) }}</span>
            <span class="occupancy-daynum">{{ formatDay(day.date) }}</span>
            <span class="occupancy-rate" :class="levelClass(day.level)" :aria-label="`${occupancyLabel(day)}: ${occupancyCount(day.occupied, day.capacity)} belegt`">
              <i aria-hidden="true"><b :style="{ width: `${Math.min(100, day.rate)}%` }" /></i>
              {{ day.isClosed ? 'Zu' : occupancyCount(day.occupied, day.capacity) }}
            </span>
          </div>

          <template v-for="room in store.roomTimelines.value" :key="room.id">
            <div class="occupancy-room-label">
              <strong>{{ room.name }}</strong>
              <span>{{ room.category }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }}</span>
              <span v-if="room.operationalState.status === 'maintenance'" class="status-badge full"><Lock :size="11" /> Gesperrt</span>
            </div>
            <div
              v-for="segment in room.segments"
              :key="segment.date"
              class="occupancy-cell"
              :class="[levelClass(segment.level), { maintenance: room.operationalState.status === 'maintenance', closed: segment.isClosed, today: segment.date === todayIso }]"
              :data-date="segment.date"
              :data-occupancy-level="segment.level"
            >
              <template v-if="segment.isClosed">
                <CalendarOff :size="13" />
              </template>
              <template v-else-if="room.operationalState.status === 'maintenance'">
                <Lock :size="13" />
              </template>
              <template v-else-if="segment.bookings.length">
                <span class="occupancy-count" :aria-label="`${segment.bookings.length} von ${room.capacity} Plätzen belegt`">
                  <i aria-hidden="true"><b :style="{ width: `${Math.min(100, (segment.bookings.length / room.capacity) * 100)}%` }" /></i>
                  {{ occupancyCount(segment.bookings.length, room.capacity) }}
                </span>
              </template>
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="mobile-occupancy" aria-labelledby="mobile-occupancy-heading">
      <header>
        <div>
          <h2 id="mobile-occupancy-heading">Zimmer pro Tag</h2>
          <p>Für kleine Bildschirme als gut lesbare Tagesliste.</p>
        </div>
        <button class="text-button" type="button" aria-label="Belegung als CSV exportieren" @click="exportOccupancy"><Download :size="15" /> Exportieren</button>
      </header>
      <article
        v-for="day in store.dailyOccupancy.value"
        :key="day.date"
        class="mobile-occupancy-day"
        :class="[levelClass(day.level), { today: day.date === todayIso }]"
        :data-date="day.date"
        :data-occupancy-level="day.level"
      >
        <header>
          <div>
            <span>{{ formatWeekday(day.date) }} · {{ formatDay(day.date) }}</span>
            <strong>{{ occupancyLabel(day) }}</strong>
          </div>
          <b>{{ day.rate }} %</b>
        </header>
        <ul>
          <li v-for="room in store.roomTimelines.value" :key="room.id">
            <div>
              <strong>{{ room.name }}</strong>
              <span>{{ room.category }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }}</span>
            </div>
            <template v-if="room.segments.find((segment) => segment.date === day.date)?.isClosed">
              <span class="mobile-room-state maintenance"><CalendarOff :size="13" /> Geschlossen</span>
            </template>
            <template v-else-if="room.operationalState.status === 'maintenance'">
              <span class="mobile-room-state maintenance"><Lock :size="13" /> Gesperrt</span>
            </template>
            <template v-else>
              <span
                v-if="room.segments.find((segment) => segment.date === day.date)?.bookings.length"
                class="mobile-room-count"
                :class="levelClass(room.segments.find((segment) => segment.date === day.date)?.level ?? 'low')"
                :aria-label="`${room.segments.find((segment) => segment.date === day.date)?.bookings.length} von ${room.capacity} Plätzen belegt`"
              >
                {{ occupancyCount(room.segments.find((segment) => segment.date === day.date)?.bookings.length ?? 0, room.capacity) }} belegt
              </span>
              <span v-else class="mobile-room-state free">Frei</span>
            </template>
          </li>
        </ul>
      </article>
    </section>
    <section class="panel occupancy-closures" aria-labelledby="closures-heading">
      <header><div><h2 id="closures-heading">Schließzeiten</h2><p>Während einer Schließzeit stehen keine Plätze für Reservierungen zur Verfügung.</p></div></header>
      <form class="closure-form" @submit.prevent="saveClosure">
        <label>Von<input v-model="closureDraft.startDate" aria-label="Schließzeit von" type="date" required /></label>
        <label>Bis<input v-model="closureDraft.endDate" aria-label="Schließzeit bis" type="date" :min="closureDraft.startDate" required /></label>
        <label class="closure-reason">Hinweis <input v-model="closureDraft.reason" aria-label="Hinweis zur Schließzeit" type="text" placeholder="z. B. Betriebsferien" /></label>
        <button class="secondary-button" type="submit"><LockKeyhole :size="15" /> Schließzeit hinterlegen</button>
      </form>
      <p v-if="closureError" class="form-error" role="alert">{{ closureError }}</p>
      <p v-if="!store.pensionClosures.length" class="empty-state">Keine Schließzeiten hinterlegt.</p>
      <ul v-else class="closure-list">
        <li v-for="closure in store.pensionClosures" :key="closure.id">
          <div><strong>{{ closureLabel(closure.startDate, closure.endDate) }}</strong><span>{{ closure.reason || 'Ohne Hinweis' }}</span></div>
          <button class="icon-button" type="button" :aria-label="`Schließzeit ${closureLabel(closure.startDate, closure.endDate)} entfernen`" @click="store.deletePensionClosure(closure.id)"><Trash2 :size="15" /></button>
        </li>
      </ul>
    </section>
    <OccupancyReservationModal v-if="reservationOpen" :start-date="store.occupancyStartDate.value" @close="reservationOpen = false" />
  </main>
</template>
