import type { BookingStatus } from '../domain'

export const bookingStatusLabels = {
  confirmed: 'Bestätigt',
  'checked-in': 'Eingecheckt',
  'checked-out': 'Abgeschlossen'
} satisfies Record<BookingStatus, string>

export const bookingStatusFilters = [
  { value: 'all', label: 'Alle' },
  ...Object.entries(bookingStatusLabels).map(([value, label]) => ({
    value: value as BookingStatus,
    label
  }))
] as const
