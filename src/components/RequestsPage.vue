<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Cat, Check, CircleAlert, CircleCheck, Dog, Download, Inbox, ThumbsDown, ThumbsUp } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import DeclineRequestModal from './DeclineRequestModal.vue'
import { getCustomerRequestMatch } from '../domain/customerProfile'
import { getRequestRoomOptions } from '../domain/roomAvailability'
import { requestStatusLabels } from '../presentation/requestStatus'
import { selectRoomOccupancyForPeriod } from '../store/pensionSelectors'
import { usePensionStore } from '../usePensionStore'
import { downloadCsv } from '../shared/csvExport'

const store = usePensionStore()
const roomSelection = reactive<Record<string, string>>(
  Object.fromEntries(store.pendingRequests.value.map((request) => [request.id, '']))
)
const customerSelection = reactive<Record<string, string>>(
  Object.fromEntries(store.pendingRequests.value.map((request) => [request.id, '']))
)
const requestError = reactive<Record<string, string>>({})
const requestToDecline = ref<BookingRequest | null>(null)

const pendingRequestDetails = computed(() => store.pendingRequests.value.map((request) => {
  const roomOptions = getRequestRoomOptions(
    store.roomViews.value,
    store.bookingViews.value,
    request,
    request.arrivalDate,
    request.arrival,
    request.departure,
    store.pensionClosures
  )
  const selectedRoom = store.rooms.find((room) => room.id === roomSelection[request.id])
  return {
    request,
    availableRooms: roomOptions.rooms,
    availability: roomOptions.availability,
    matchingCustomers: store.customers.flatMap((customer) => {
      const match = getCustomerRequestMatch(customer, request)
      return match ? [{ customer, match }] : []
    }),
    selectedRoomOccupancy: selectedRoom
      ? selectRoomOccupancyForPeriod(selectedRoom, store.bookingViews.value, request.arrivalDate, request.departure)
      : null
  }
}))

function accept(request: BookingRequest) {
  const roomId = roomSelection[request.id]
  const customerAssignment = customerSelection[request.id]
  if (!roomId || !customerAssignment || !store.acceptRequest(request.id, roomId, customerAssignment === 'new' ? 'new' : customerAssignment)) {
    requestError[request.id] = 'Bitte ordne einen Kunden zu und wähle ein verfügbares Zimmer.'
    return
  }
  delete requestError[request.id]
  delete roomSelection[request.id]
  delete customerSelection[request.id]
}

function decline(reason: string) {
  const request = requestToDecline.value
  if (!request || !store.declineRequest(request.id, reason)) return
  requestToDecline.value = null
}

function exportRequests(scope: 'pending' | 'history') {
  const requests = scope === 'pending' ? store.pendingRequests.value : store.requestHistory.value
  downloadCsv({
    fileName: scope === 'pending' ? 'offene-anfragen.csv' : 'anfragen-verlauf.csv',
    columns: ['Kund:in', 'Telefon', 'Tier', 'Tierart', 'Rasse', 'Anreise', 'Ankunftszeit', 'Abreise', 'Status', 'Hinweis', 'Ablehnungsgrund'],
    rows: requests.map((request) => [
      `${request.customerFirstName} ${request.customerLastName}`, request.phone, request.petName,
      request.species === 'dog' ? 'Hund' : 'Katze', request.breed, request.arrivalDate, request.arrival,
      request.departure, requestStatusLabels[request.status], request.note, request.declineReason
    ])
  })
}
</script>

<template>
  <main class="requests-page">
    <div class="page-heading">
      <div><p class="eyebrow">Externe Anfragen</p><h1>Anfragen</h1><p>Buchungsanfragen prüfen, Kunde zuordnen und anschließend als Reservierung übernehmen.</p></div>
      <span class="page-count"><Inbox :size="17" /> {{ store.pendingRequests.value.length }} offen</span>
    </div>

    <div v-if="!store.settings.requestsEnabled" class="panel">
      <div class="empty-state">
        <span><Inbox /></span>
        <strong>Anfragen ist derzeit deaktiviert.</strong>
        <p>Aktiviere das Feature unter Einstellungen, um externe Buchungsanfragen zu empfangen.</p>
      </div>
    </div>

    <template v-else>
      <section class="panel requests-list">
        <header><div><h2>Offene Anfragen</h2><p>{{ store.pendingRequests.value.length }} Anfragen warten auf eine Entscheidung</p></div><button class="text-button" type="button" aria-label="Offene Anfragen als CSV exportieren" @click="exportRequests('pending')"><Download :size="15" /> Exportieren</button></header>
        <div v-if="store.pendingRequests.value.length" class="request-cards">
          <article v-for="requestDetail in pendingRequestDetails" :key="requestDetail.request.id" class="request-card">
            <template v-for="request in [requestDetail.request]" :key="request.id">
            <div class="request-summary">
              <span class="request-species-icon" :class="{ cat: request.species === 'cat' }"><Cat v-if="request.species === 'cat'" :size="19" /><Dog v-else :size="19" /></span>
              <div class="request-info">
                <strong>{{ request.customerFirstName }} {{ request.customerLastName }} · {{ request.phone }}</strong>
                <span>{{ request.petName }} · {{ request.breed }}</span>
                <span v-if="request.note" class="note-badge">{{ request.note }}</span>
              </div>
              <div class="request-dates"><small>Aufenthalt</small><strong>{{ request.arrivalDate }} · {{ request.arrival }} Uhr – {{ request.departure }}</strong></div>
              <p
                class="request-availability"
                :class="requestDetail.availability.status"
                :aria-label="`Verfügbarkeit: ${requestDetail.availability.status === 'available' ? 'frei' : 'nicht frei'}`"
              >
                <CircleCheck v-if="requestDetail.availability.status === 'available'" :size="15" />
                <CircleAlert v-else :size="15" />
                <template v-if="requestDetail.availability.status === 'available'">
                  Zeitraum frei · {{ requestDetail.availability.availableRoomCount }} passende {{ requestDetail.availability.availableRoomCount === 1 ? 'Option' : 'Optionen' }}
                </template>
                <template v-else-if="requestDetail.availability.status === 'closed'">Zeitraum wegen Schließzeit nicht frei</template>
                <template v-else>Zeitraum derzeit nicht frei</template>
              </p>
            </div>
            <div class="request-actions">
              <select v-model="customerSelection[request.id]" :aria-label="`Kunde für Anfrage von ${request.customerFirstName} ${request.customerLastName}`">
                <option value="" disabled>Kunde zuordnen</option>
                <option value="new">Als neuen Kunden anlegen</option>
                <optgroup v-if="requestDetail.matchingCustomers.length" label="Passende bestehende Kunden">
                  <option v-for="{ customer } in requestDetail.matchingCustomers" :key="customer.id" :value="customer.id">{{ customer.firstName }} {{ customer.lastName }} · {{ customer.email }}</option>
                </optgroup>
              </select>
              <p v-if="requestDetail.matchingCustomers.length" class="customer-match-hint">
                Passender Kunde: {{ requestDetail.matchingCustomers.map(({ customer }) => `${customer.firstName} ${customer.lastName}`).join(', ') }}
                <template v-if="requestDetail.matchingCustomers.some(({ match }) => match === 'email')"> · gleiche E-Mail-Adresse</template><template v-else-if="requestDetail.matchingCustomers.some(({ match }) => match === 'phone')"> · gleiche Telefonnummer</template>.
                Mit der Auswahl wird die Anfrage diesem Kunden zugeordnet.
              </p>
              <select v-model="roomSelection[request.id]" :aria-label="`Zimmer für Anfrage von ${request.customerFirstName} ${request.customerLastName}`">
                <option value="" disabled>Zimmer wählen</option>
                <option v-for="room in requestDetail.availableRooms" :key="room.id" :value="room.id">{{ room.name }}</option>
              </select>
              <p
                v-if="requestDetail.selectedRoomOccupancy"
                class="room-occupancy-hint"
                :class="{ full: requestDetail.selectedRoomOccupancy.availablePlaces === 0 }"
              >
                Auslastung im Zeitraum: {{ requestDetail.selectedRoomOccupancy.peakOccupied }}/{{ requestDetail.selectedRoomOccupancy.capacity }} Plätze
                <template v-if="requestDetail.selectedRoomOccupancy.peakDate"> · engster Tag {{ requestDetail.selectedRoomOccupancy.peakDate }}</template>
                <template v-if="requestDetail.selectedRoomOccupancy.availablePlaces === 0"> · bereits ausgebucht</template>
              </p>
              <div class="request-buttons">
                <button class="primary-button" :disabled="!roomSelection[request.id] || !customerSelection[request.id]" @click="accept(request)"><ThumbsUp :size="15" /> Annehmen</button>
                <button class="secondary-button" @click="requestToDecline = request"><ThumbsDown :size="15" /> Ablehnen</button>
              </div>
              <p v-if="requestError[request.id]" class="form-error" role="alert">{{ requestError[request.id] }}</p>
            </div>
            </template>
          </article>
        </div>
        <div v-else class="empty-state"><span><Check /></span><strong>Keine offenen Anfragen.</strong><p>Neue externe Anfragen erscheinen automatisch hier.</p></div>
      </section>

      <section class="panel requests-list">
        <header><div><h2>Verlauf</h2><p>Bereits entschiedene Anfragen</p></div><button class="text-button" type="button" aria-label="Anfragenverlauf als CSV exportieren" @click="exportRequests('history')"><Download :size="15" /> Exportieren</button></header>
        <div v-if="store.requestHistory.value.length" class="request-history">
          <article v-for="request in store.requestHistory.value" :key="request.id">
            <div class="request-history-customer">
              <strong>{{ request.customerFirstName }} {{ request.customerLastName }}</strong>
              <span>{{ request.petName }} · {{ request.breed }}</span>
            </div>
            <div class="request-history-dates"><small>Aufenthalt</small><span>{{ request.arrivalDate }} – {{ request.departure }}</span></div>
            <span class="booking-status" :class="request.status === 'accepted' ? 'checked-in' : 'checked-out'">{{ requestStatusLabels[request.status] }}</span>
            <div v-if="request.declineReason || request.declineNotification" class="request-history-notes">
              <span v-if="request.declineReason" class="note-badge">Grund: {{ request.declineReason }}</span>
              <span v-if="request.declineNotification" class="request-notification">E-Mail-Benachrichtigung an {{ request.declineNotification.recipient }} vorgemerkt</span>
            </div>
          </article>
        </div>
        <div v-else class="empty-state"><span><Inbox /></span><strong>Noch keine entschiedenen Anfragen.</strong><p>Angenommene und abgelehnte Anfragen erscheinen hier.</p></div>
      </section>
    </template>
    <DeclineRequestModal v-if="requestToDecline" :request="requestToDecline" @close="requestToDecline = null" @confirm="decline" />
  </main>
</template>
