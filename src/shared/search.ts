const SEARCH_LOCALE = 'de'

export function resolveSearchTerm(localQuery: string, globalQuery = ''): string {
  return (localQuery || globalQuery).trim().toLocaleLowerCase(SEARCH_LOCALE)
}

export function matchesSearchTerm(searchTerm: string, values: readonly string[]): boolean {
  return !searchTerm || values.some((value) => value.toLocaleLowerCase(SEARCH_LOCALE).includes(searchTerm))
}
