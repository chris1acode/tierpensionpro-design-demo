const SEARCH_LOCALE = 'de'

export function resolveSearchTerm(query: string): string {
  return query.trim().toLocaleLowerCase(SEARCH_LOCALE)
}

export function matchesSearchTerm(searchTerm: string, values: readonly string[]): boolean {
  return !searchTerm || values.some((value) => value.toLocaleLowerCase(SEARCH_LOCALE).includes(searchTerm))
}
