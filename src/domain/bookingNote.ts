/** Keeps operational notes concise and prevents whitespace-only persistence. */
export function normalizeBookingNote(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized || undefined
}

export function isValidBookingNote(value: string | undefined): boolean {
  return value === undefined || (normalizeBookingNote(value)?.length ?? 0) <= 300
}
