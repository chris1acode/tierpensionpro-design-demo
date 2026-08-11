<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarOff, CalendarPlus, ChevronLeft, ChevronRight, Download, Lock, LockKeyhole, Pencil, Trash2 } from '@lucide/vue'
import type { DailyOccupancy, OccupancyLevel, OccupancyRangeDays, PensionClosure } from '../domain'
import { formatDayAndMonth, formatShortWeekday } from '../presentation/dateFormat'
import { usePensionStore } from '../usePensionStore'
import OccupancyReservationModal from './OccupancyReservationModal.vue'
import ClosureFormModal from './ClosureFormModal.vue'
import { downloadCsv } from '../shared/csvExport'

const store = usePensionStore()
const rangeOptions: { value: OccupancyRangeDays; label: string }[] = [
  { value: 7, label: '7 Tage' },
  { value: 14, label: '14 Tage' },
  { value: 30, label: '30 Tage' }
]

const todayIso = computed(() => store.businessDate.value)
const reservationOpen = ref(false)
const closureModalMode = ref<'create' | 'edit' | null>(null)
const closureBeingEdited = ref<PensionClosure | null>(null)

function openClosureCreate(): void {
  closureBeingEdited.value = null
  closureModalMode.value = 'create'
}

function openClosureEdit(closure: PensionClosure): void {
  closureBeingEdited.value = closure
  closureModalMode.value = 'edit'
}

function closeClosureModal(): void {
  closureModalMode.value = null
  closureBeingEdited.value = null
}

function onStartDateChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (value) store.setOccupancyStartDate(value)
}
const gridStyle = computed(() => ({
  gridTemplateColumns: `200px repeat(${store.occupancyDates.value.length}, minmax(64px, 1fr))`
}))

function occupancyLabel(day: DailyOccupancy): string {
  if (day.level === 'unavailable') return 'Keine Plätze verfügbar'
  if (day.level === 'overbooked') return `Überbucht · ${day.occupied - day.capacity} Plätze zu viel`
  if (day.level === 'full') return 'Ausgebucht'
  if (day.level === 'high') return 'Wenig freie Plätze'
  return `${day.availablePlaces} ${day.availablePlaces === 1 ? 'Platz' : 'Plätze'} frei`
}

function levelClass(level: OccupancyLevel): string {
  return level
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

function closureLabel(startDate: string, endDate: string): string {
  return startDate === endDate
    ? formatDayAndMonth(startDate)
    : `${formatDayAndMonth(startDate)} – ${formatDayAndMonth(endDate)}`
}
</script>

<template>
  <main class="occupancy-page">
    <div class="page-heading">
      <div><p class="eyebrow">Kapazitätsplanung</p><h1>Belegung</h1><p>Zimmerbelegung als kompakte Tages-Spaltenansicht.</p></div>
    </div>

    <div class="occupancy-controls">
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

      <div class="range-filters" aria-label="Zeitraum">
        <button
          v-for="option in rangeOptions"
          :key="option.value"
          :class="{ active: store.occupancyRangeDays.value === option.value }"
          @click="store.setOccupancyRangeDays(option.value)"
        >{{ option.label }}</button>
      </div>

      <button class="primary-button occupancy-reservation-button" @click="reservationOpen = true"><CalendarPlus :size="17" /> Reservierung anlegen</button>
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
          <span><i class="legend-swatch closed" /> Geschlossen</span>
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
            <span class="occupancy-weekday">{{ formatShortWeekday(day.date) }}</span>
            <span class="occupancy-daynum">{{ formatDayAndMonth(day.date) }}</span>
            <span class="occupancy-rate" :class="levelClass(day.level)" :aria-label="`${occupancyLabel(day)}: ${occupancyCount(day.occupied, day.capacity)} belegt`">
              <i aria-hidden="true"><b :style="{ width: `${Math.min(100, day.rate)}%` }" /></i>
              {{ day.isClosed ? 'Zu' : occupancyCount(day.occupied, day.capacity) }}
            </span>
          </div>

          <template v-for="room in store.roomTimelines.value" :key="room.id">
            <div class="occupancy-room-label">
              <strong>{{ room.name }}</strong>
              <span>{{ room.category }} · {{ room.capacity }} {{ room.capacity === 1 ? 'Platz' : 'Plätze' }}</span>
              <span v-if="room.operationalState.status === 'maintenance'" class="status-badge locked"><Lock :size="11" /> Gesperrt</span>
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
            <span>{{ formatShortWeekday(day.date) }} · {{ formatDayAndMonth(day.date) }}</span>
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
              <span class="mobile-room-state closed"><CalendarOff :size="13" /> Geschlossen</span>
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
      <header>
        <div><h2 id="closures-heading">Schließzeiten</h2><p>Während einer Schließzeit stehen keine Plätze für Reservierungen zur Verfügung.</p></div>
        <button class="secondary-button" type="button" @click="openClosureCreate"><LockKeyhole :size="15" /> Schließzeit anlegen</button>
      </header>
      <p v-if="!store.pensionClosures.length" class="empty-state">Keine Schließzeiten hinterlegt.</p>
      <ul v-else class="closure-list">
        <li v-for="closure in store.pensionClosures" :key="closure.id">
          <div><strong>{{ closureLabel(closure.startDate, closure.endDate) }}</strong><span>{{ closure.reason || 'Ohne Hinweis' }}</span></div>
          <div class="closure-actions">
            <button class="icon-button" type="button" :aria-label="`Schließzeit ${closureLabel(closure.startDate, closure.endDate)} bearbeiten`" @click="openClosureEdit(closure)"><Pencil :size="15" /></button>
            <button class="icon-button" type="button" :aria-label="`Schließzeit ${closureLabel(closure.startDate, closure.endDate)} entfernen`" @click="store.deletePensionClosure(closure.id)"><Trash2 :size="15" /></button>
          </div>
        </li>
      </ul>
    </section>
    <OccupancyReservationModal v-if="reservationOpen" :start-date="store.occupancyStartDate.value" @close="reservationOpen = false" />
    <ClosureFormModal
      v-if="closureModalMode"
      :mode="closureModalMode"
      :closure="closureBeingEdited ?? undefined"
      @close="closeClosureModal"
      @saved="closeClosureModal"
    />
  </main>
</template>
