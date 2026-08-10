const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

/** A collection time is deliberately optional, but never stored in an invalid format. */
export function isValidOptionalTime(value: string | undefined): boolean {
  return value === undefined || value === '' || timePattern.test(value)
}

export function isValidIsoDate(value: string): boolean {
  if (!isoDatePattern.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function isValidBookingPeriod(arrivalDate: string, arrivalTime: string, departureDate: string): boolean {
  return isValidIsoDate(arrivalDate)
    && isValidIsoDate(departureDate)
    && timePattern.test(arrivalTime)
    && departureDate >= arrivalDate
}

export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isDateWithinStay(date: string, arrivalDate: string, departureDate: string): boolean {
  return date >= arrivalDate && date < departureDate
}

export function buildDateRange(start: Date, days: number): string[] {
  return Array.from({ length: Math.max(0, days) }, (_, offset) => {
    const date = new Date(start)
    date.setDate(date.getDate() + offset)
    return toLocalIsoDate(date)
  })
}

export function fromLocalIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDaysToIsoDate(date: string, days: number): string {
  const shifted = fromLocalIsoDate(date)
  shifted.setDate(shifted.getDate() + days)
  return toLocalIsoDate(shifted)
}

export function enumerateStayDates(arrivalDate: string, departureDate: string): string[] {
  const dates: string[] = []
  let cursor = arrivalDate
  while (cursor < departureDate) {
    dates.push(cursor)
    const [year, month, day] = cursor.split('-').map(Number)
    cursor = toLocalIsoDate(new Date(year, month - 1, day + 1))
  }
  return dates
}
