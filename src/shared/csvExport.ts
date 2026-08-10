export interface CsvExport {
  fileName: string
  columns: readonly string[]
  rows: readonly (readonly (string | number | undefined | null)[])[]
}

function escapeCsvValue(value: string | number | undefined | null): string {
  const normalized = String(value ?? '')
  return /[;"\r\n]/.test(normalized)
    ? `"${normalized.replaceAll('"', '""')}"`
    : normalized
}

export function createCsvContent(exportData: CsvExport): string {
  return [exportData.columns, ...exportData.rows]
    .map((row) => row.map(escapeCsvValue).join(';'))
    .join('\r\n')
}

export function downloadCsv(exportData: CsvExport): void {
  const blob = new Blob([`\uFEFF${createCsvContent(exportData)}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = exportData.fileName.endsWith('.csv') ? exportData.fileName : `${exportData.fileName}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
