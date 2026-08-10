import type { BookingRequestStatus } from '../domain'

export const requestStatusLabels = {
  pending: 'Offen',
  accepted: 'Angenommen',
  declined: 'Abgelehnt'
} satisfies Record<BookingRequestStatus, string>
