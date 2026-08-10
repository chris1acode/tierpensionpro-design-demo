import type { CheckInOutEventType } from '../domain'

/** German labels for the immutable operational event history. */
export const checkInOutEventLabels = {
  'check-in': 'Eingecheckt',
  'check-in-reverted': 'Check-in zurückgenommen',
  'check-out': 'Ausgecheckt'
} satisfies Record<CheckInOutEventType, string>
