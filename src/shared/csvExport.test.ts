import { describe, expect, it } from 'vitest'
import { createCsvContent } from './csvExport'

describe('CSV export', () => {
  it('writes a semicolon-separated table and escapes spreadsheet-sensitive cell content', () => {
    expect(createCsvContent({
      fileName: 'irrelevant',
      columns: ['Name', 'Hinweis'],
      rows: [['Mia; Müller', 'Bringt "Lieblingsdecke"\nmit'], ['Balu', undefined]]
    })).toBe('Name;Hinweis\r\n"Mia; Müller";"Bringt ""Lieblingsdecke""\nmit"\r\nBalu;')
  })
})
