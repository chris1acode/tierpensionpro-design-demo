import { describe, expect, it } from 'vitest'
import type { CheckInOutEventType } from '../domain'
import { checkInOutEventLabels } from './checkInOutEvent'

describe('check-in/out event presentation', () => {
  it('provides one consistent label for every history event type', () => {
    const eventTypes: CheckInOutEventType[] = ['check-in', 'check-in-reverted', 'check-out']

    expect(Object.keys(checkInOutEventLabels)).toEqual(eventTypes)
    expect(checkInOutEventLabels).toEqual({
      'check-in': 'Eingecheckt',
      'check-in-reverted': 'Check-in zurückgenommen',
      'check-out': 'Ausgecheckt'
    })
  })
})
