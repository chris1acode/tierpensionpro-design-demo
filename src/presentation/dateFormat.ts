const shortWeekdayFormatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short' })
const dayMonthFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' })
const eventTimestampFormatter = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Berlin'
})
const cancellationDateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' })

/** Formats an ISO calendar date without letting UTC conversion shift the displayed day. */
function asLocalCalendarDate(date: string): Date {
  return new Date(`${date}T12:00:00`)
}

export function formatShortWeekday(date: string): string {
  return shortWeekdayFormatter.format(asLocalCalendarDate(date))
}

export function formatDayAndMonth(date: string): string {
  return dayMonthFormatter.format(asLocalCalendarDate(date))
}

export function formatEventTimestamp(timestamp: string): string {
  return eventTimestampFormatter.format(new Date(timestamp))
}

export function formatCancellationDate(timestamp: string): string {
  return cancellationDateFormatter.format(new Date(timestamp))
}
