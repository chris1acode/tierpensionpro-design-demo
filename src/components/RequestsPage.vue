<script setup lang="ts">
import { computed, ref } from 'vue'
import { Cat, Check, CircleAlert, CircleCheck, Dog, Download, Inbox, ThumbsDown, ThumbsUp } from '@lucide/vue'
import type { BookingRequest } from '../domain'
import AppButton from './AppButton.vue'
import AppBookingStatus from './AppBookingStatus.vue'
import AppCustomerLink from './AppCustomerLink.vue'
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
      <span class="inline-flex items-center gap-[7px] rounded-lg border border-[var(--border)] bg-white px-3 py-[9px] text-xs font-bold text-[var(--muted)]"><Inbox :size="17" /> {{ store.pendingRequests.value.length }} offen</span>
    </AppPageHeading>

    <div v-if="!store.settings.requestsEnabled" class="panel">
      <AppEmptyState>
        <template #icon><Inbox /></template>
        <template #title>Anfragen ist derzeit deaktiviert.</template>
        <template #description>Aktiviere das Feature unter Einstellungen, um externe Buchungsanfragen zu empfangen.</template>
      </AppEmptyState>
    </div>

    <template v-else>
      <section class="panel mb-[22px]">
        <header><div><h2>Offene Anfragen</h2><p>{{ store.pendingRequests.value.length }} Anfragen warten auf eine Entscheidung</p></div><AppButton variant="text" type="button" aria-label="Offene Anfragen als CSV exportieren" @click="exportRequests('pending')"><Download :size="15" /> Exportieren</AppButton></header>
        <div v-if="store.pendingRequests.value.length" class="grid gap-px bg-[#eeeae6]">
          <article v-for="requestDetail in pendingRequestDetails" :key="requestDetail.request.id" class="request-card grid grid-cols-1 items-stretch gap-6 bg-white p-4 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(270px,340px)] min-[900px]:p-[18px_22px]">
            <template v-for="request in [requestDetail.request]" :key="request.id">
            <div class="request-summary grid min-w-0 items-center gap-x-4 gap-y-3 grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] min-[900px]:grid-cols-[auto_minmax(190px,1fr)_minmax(175px,.9fr)] min-[900px]:grid-rows-[auto_auto]">
              <span
                class="row-start-1 row-span-2 col-start-1 grid h-[42px] w-[42px] place-items-center self-center rounded-full"
                :class="request.species === 'cat' ? 'bg-[#f3e8dd] text-[#8e582b]' : 'bg-[#e4eff0] text-[var(--petrol)]'"
              ><Cat v-if="request.species === 'cat'" :size="19" /><Dog v-else :size="19" /></span>
              <div class="row-start-1 col-start-2 min-w-0">
                <strong class="block text-sm">{{ request.customerFirstName }} {{ request.customerLastName }} · {{ request.phone }}</strong>
                <span class="block text-[13px] text-[var(--muted)] mt-[3px]">{{ request.petName }}</span>
                <span v-if="request.note" class="note-badge mt-1.5 inline-block">{{ request.note }}</span>
              </div>
              <div class="row-start-2 col-start-2 min-[900px]:row-start-1 min-[900px]:col-start-3">
                <small class="block text-xs text-[var(--muted)] mb-1">Aufenthalt</small>
                <strong class="block text-[13px]">{{ request.arrivalDate }} · {{ request.arrival }} Uhr – {{ request.departure }}</strong>
              </div>
              <p
                class="request-availability row-start-3 col-start-1 col-span-2 min-[900px]:row-start-2 min-[900px]:col-start-2 min-[900px]:col-span-2 flex items-center gap-[5px] rounded-[7px] px-[9px] py-[7px] text-xs font-bold leading-[1.35]"
                :class="requestDetail.availability.status === 'available' ? 'bg-[#e7f2eb] text-[#315f48]' : 'bg-[#fdf2f2] text-[#9b4444]'"
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
            <div class="request-actions grid content-center items-stretch justify-items-stretch gap-2 rounded-[10px] border border-[#e7e3de] bg-[#fafaf8] p-3 max-[900px]:mt-[2px]">
              <div class="flex gap-2 max-[900px]:flex-col [&>*]:flex-1">
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

      <section class="panel">
        <header><div><h2>Verlauf</h2><p>Bereits entschiedene Anfragen</p></div><AppButton variant="text" type="button" aria-label="Anfragenverlauf als CSV exportieren" @click="exportRequests('history')"><Download :size="15" /> Exportieren</AppButton></header>
        <div v-if="store.requestHistory.value.length" class="request-history">
          <article
            v-for="request in store.requestHistory.value"
            :key="request.id"
            class="grid items-start gap-3 border-b border-[#eeeae6] px-[22px] py-[15px] last:border-0 grid-cols-[1fr_auto] min-[900px]:grid-cols-[1fr_1fr_minmax(105px,auto)]"
          >
            <div>
              <AppCustomerLink v-if="request.customerId" :customer-id="request.customerId">{{ request.customerFirstName }} {{ request.customerLastName }}</AppCustomerLink>
              <strong v-else class="block text-[15px]">{{ request.customerFirstName }} {{ request.customerLastName }}</strong>
              <span class="block text-[13px] text-[var(--muted)] mt-0.5">{{ request.petName }}</span>
            </div>
            <div class="col-start-1 row-start-2 min-[900px]:col-start-2 min-[900px]:row-start-1">
              <small class="block text-[10px] text-[var(--muted)] mb-[3px]">Aufenthalt</small>
              <span class="block text-[13px] text-[var(--muted)] mt-0.5">{{ request.arrivalDate }} – {{ request.departure }}</span>
            </div>
            <AppBookingStatus
              class="col-start-2 row-start-1 row-span-2 min-[900px]:col-start-3 min-[900px]:row-span-1 self-center justify-self-end"
              :status="request.status === 'accepted' ? 'accepted' : 'checked-out'"
            >{{ requestStatusLabels[request.status] }}</AppBookingStatus>
            <div v-if="request.declineReason || request.declineNotification" class="col-span-full mt-1">
              <span v-if="request.declineReason" class="note-badge mt-1">Grund: {{ request.declineReason }}</span>
              <span v-if="request.declineNotification" class="mt-1.5 block text-[10px] font-bold text-[#466b62]">E-Mail-Benachrichtigung an {{ request.declineNotification.recipient }} vorgemerkt</span>
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
