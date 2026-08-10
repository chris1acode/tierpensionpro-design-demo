<script setup lang="ts">
import { Home, LockKeyhole, RotateCcw } from '@lucide/vue'
import type { RoomView } from '../domain'
import BaseModal from './BaseModal.vue'

defineProps<{
  rooms: RoomView[]
}>()

defineEmits<{ close: []; changeStatus: [roomId: string, status: 'ready' | 'maintenance'] }>()
</script>

<template>
  <BaseModal labelled-by="rooms-title" modal-class="room-modal" @close="$emit('close')">
    <span class="modal-icon room-modal-icon"><Home /></span>
    <p class="eyebrow">Zimmerstatus</p>
    <h2 id="rooms-title">Belegung und Verfügbarkeit</h2>
    <p>Die Belegung und betriebliche Verfügbarkeit werden direkt aus den aktuellen Zimmerdaten berechnet.</p>
    <div class="room-list">
      <article v-for="room in rooms" :key="room.id">
        <div>
          <strong>{{ room.name }}</strong>
          <span>{{ room.category }} · {{ room.guests.length }} von {{ room.capacity }} belegt</span>
          <small v-if="room.operationalState.status === 'maintenance'">Vorübergehend gesperrt</small>
          <small v-else-if="room.guests.length">Gast: {{ room.guests.map((guest) => guest.pet.name).join(', ') }}</small>
          <small v-else>Aktuell nicht belegt</small>
        </div>
        <div class="room-status-actions">
          <span class="status-badge" :class="room.operationalState.status === 'maintenance' || room.availablePlaces === 0 ? 'full' : 'available'">
            {{ room.operationalState.status === 'maintenance' ? 'Gesperrt' : room.availablePlaces === 0 ? 'Voll belegt' : `${room.availablePlaces} frei` }}
          </span>
          <button v-if="room.operationalState.status === 'maintenance'" class="text-button" @click="$emit('changeStatus', room.id, 'ready')"><RotateCcw :size="14" /> Freigeben</button>
          <button v-else class="text-button" :disabled="room.guests.length > 0" :title="room.guests.length ? 'Belegte Zimmer können nicht gesperrt werden' : undefined" @click="$emit('changeStatus', room.id, 'maintenance')"><LockKeyhole :size="14" /> Sperren</button>
        </div>
      </article>
    </div>
  </BaseModal>
</template>
