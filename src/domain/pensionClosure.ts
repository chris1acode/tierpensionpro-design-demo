import type { PensionClosure } from '../domain'
import { isValidIsoDate } from './bookingPeriod'

export function isValidPensionClosure(input: Pick<PensionClosure, 'startDate' | 'endDate' | 'reason'>): boolean {
  return isValidIsoDate(input.startDate)
    && isValidIsoDate(input.endDate)
    && input.endDate >= input.startDate
}

export function isDateWithinClosure(date: string, closure: Pick<PensionClosure, 'startDate' | 'endDate'>): boolean {
  return date >= closure.startDate && date <= closure.endDate
}

export function doesStayOverlapClosure(
  arrivalDate: string,
  departureDate: string,
  closures: readonly Pick<PensionClosure, 'startDate' | 'endDate'>[]
): boolean {
  return closures.some((closure) => arrivalDate <= closure.endDate && departureDate > closure.startDate)
}
