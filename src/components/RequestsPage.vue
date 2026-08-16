<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Cat, Check, CircleAlert, CircleCheck, Dog, Download, Inbox, ThumbsDown, ThumbsUp } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import AppButton from './AppButton.vue'
import AppContainer from './AppContainer.vue'
import AppEmptyState from './AppEmptyState.vue'
import AppPageHeading from './AppPageHeading.vue'
import DeclineRequestModal from './DeclineRequestModal.vue'
import RequestAssignModal from './RequestAssignModal.vue'
import { getRequestRoomOptions } from '../domain/roomAvailability'
import { requestStatusLabels } from '../presentation/requestStatus'
import { usePensionStore } from '../usePensionStore'
import { downloadCsv } from '../shared/csvExport'

const store = usePensionStore()
const requestToDecline = ref<BookingRequest | null>(null)
const requestToAssign = ref<BookingRequest | null>(null)

const pendingRequestDetails = computed(() => store.pendingRequests.value.map((request) => ({
  request,
  availability: getRequestRoomOptions(
    store.roomViews.value,
    store.bookingViews.value,
    request,
    request.arrivalDate,
    request.arrival,
    request.departure,
    store.pensionClosures
  ).availability
})))

function decline(reason: string) {
  const request = requestToDecline.value
  if (!request || !store.declineRequest(request.id, reason)) return
  requestToDecline.value = null
}

function exportRequests(scope: 'pending' | 'history') {
  const requests = scope === 'pending' ? store.pendingRequests.value : store.requestHistory.value
  downloadCsv({
    fileName: scope === 'pending' ? 'offene-anfragen.csv' : 'anfragen-verlauf.csv',
    columns: ['Kunde', 'Telefon', 'Tier', 'Tierart', 'Anreise', 'Ankunftszeit', 'Abreise', 'Status', 'Hinweis', 'Ablehnungsgrund'],
    rows: requests.map((request) => [
      `${request.customerFirstName} ${request.customerLastName}`, request.phone, request.petName,
      request.species === 'dog' ? 'Hund' : 'Katze', request.arrivalDate, request.arrival,
      request.departure, requestStatusLabels[request.status], request.note, request.declineReason
    ])
  })
}
</script>

<template>
  <AppContainer class="requests-page">
    <AppPageHeading eyebrow="Externe Anfragen" title="Anfragen" description="Buchungsanfragen prüfen, Kunde zuordnen und anschließend als Reservierung übernehmen.">
      <span class="page-count"><Inbox :size="17" /> {{ store.pendingRequests.value.length }} offen</span>
    </AppPageHeading>

    <div v-if="!store.settings.requestsEnabled" class="panel">
      <AppEmptyState>
        <template #icon><Inbox /></template>
        <template #title>Anfragen ist derzeit deaktiviert.</template>
        <template #description>Aktiviere das Feature unter Einstellungen, um externe Buchungsanfragen zu empfangen.</template>
      </AppEmptyState>
    </div>

    <template v-else>
      <section class="panel requests-list">
        <header><div><h2>Offene Anfragen</h2><p>{{ store.pendingRequests.value.length }} Anfragen warten auf eine Entscheidung</p></div><AppButton variant="text" type="button" aria-label="Offene Anfragen als CSV exportieren" @click="exportRequests('pending')"><Download :size="15" /> Exportieren</AppButton></header>
        <div v-if="store.pendingRequests.value.length" class="request-cards">
          <article v-for="requestDetail in pendingRequestDetails" :key="requestDetail.request.id" class="request-card">
            <template v-for="request in [requestDetail.request]" :key="request.id">
            <div class="request-summary">
              <span class="request-species-icon" :class="{ cat: request.species === 'cat' }"><Cat v-if="request.species === 'cat'" :size="19" /><Dog v-else :size="19" /></span>
              <div class="request-info">
                <strong>{{ request.customerFirstName }} {{ request.customerLastName }} · {{ request.phone }}</strong>
                <span>{{ request.petName }}</span>
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
              <div class="request-buttons">
                <AppButton variant="primary" @click="requestToAssign = request"><ThumbsUp :size="15" /> Annehmen</AppButton>
                <AppButton variant="secondary" @click="requestToDecline = request"><ThumbsDown :size="15" /> Ablehnen</AppButton>
              </div>
            </div>
            </template>
          </article>
        </div>
        <AppEmptyState v-else>
          <template #icon><Check /></template>
          <template #title>Keine offenen Anfragen.</template>
          <template #description>Neue externe Anfragen erscheinen automatisch hier.</template>
        </AppEmptyState>
      </section>

      <section class="panel requests-list">
        <header><div><h2>Verlauf</h2><p>Bereits entschiedene Anfragen</p></div><AppButton variant="text" type="button" aria-label="Anfragenverlauf als CSV exportieren" @click="exportRequests('history')"><Download :size="15" /> Exportieren</AppButton></header>
        <div v-if="store.requestHistory.value.length" class="request-history">
          <article v-for="request in store.requestHistory.value" :key="request.id">
            <div class="request-history-customer">
              <RouterLink v-if="request.customerId" class="customer-profile-link" :to="{ name: 'customers', query: { customerId: request.customerId } }">{{ request.customerFirstName }} {{ request.customerLastName }}</RouterLink>
              <strong v-else>{{ request.customerFirstName }} {{ request.customerLastName }}</strong>
              <span>{{ request.petName }}</span>
            </div>
            <div class="request-history-dates"><small>Aufenthalt</small><span>{{ request.arrivalDate }} – {{ request.departure }}</span></div>
            <span class="booking-status" :class="request.status === 'accepted' ? 'accepted' : 'checked-out'">{{ requestStatusLabels[request.status] }}</span>
            <div v-if="request.declineReason || request.declineNotification" class="request-history-notes">
              <span v-if="request.declineReason" class="note-badge">Grund: {{ request.declineReason }}</span>
              <span v-if="request.declineNotification" class="request-notification">E-Mail-Benachrichtigung an {{ request.declineNotification.recipient }} vorgemerkt</span>
            </div>
          </article>
        </div>
        <AppEmptyState v-else>
          <template #icon><Inbox /></template>
          <template #title>Noch keine entschiedenen Anfragen.</template>
          <template #description>Angenommene und abgelehnte Anfragen erscheinen hier.</template>
        </AppEmptyState>
      </section>
    </template>
    <DeclineRequestModal v-if="requestToDecline" :request="requestToDecline" @close="requestToDecline = null" @confirm="decline" />
    <RequestAssignModal v-if="requestToAssign" :request="requestToAssign" @close="requestToAssign = null" @accepted="requestToAssign = null" />
  </AppContainer>
</template>
