const euroFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
})

/** Formats an integer cent amount for display in the German interface. */
export function formatEuroCents(amountCents: number): string {
  return euroFormatter.format(amountCents / 100)
}
