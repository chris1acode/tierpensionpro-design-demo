import { describe, expect, it } from 'vitest'
import { createDemoState } from './demoState'

describe('createDemoState', () => {
  it('creates isolated fixture snapshots', () => {
    const firstState = createDemoState()
    const secondState = createDemoState()

    firstState.customers[0].firstName = 'Geändert'
    firstState.bookingReservations.push({
      id: 'reservation-test', customerId: 'c-1', petIds: ['p-1'], roomId: 'r-1',
      arrivalDate: '2026-08-15', arrival: '10:00', departure: '2026-08-16', createdAt: '2026-08-10T10:00:00.000Z'
    })

    expect(secondState.customers[0].firstName).toBe('Sofia')
    expect(secondState.bookingReservations).toEqual([])
  })
})
