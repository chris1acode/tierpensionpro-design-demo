interface Identifiable {
  id: string
}

export function nextEntityId(entities: readonly Identifiable[], prefix: string): string {
  const idPrefix = `${prefix}-`
  const highestNumber = entities.reduce((highest, entity) => {
    if (!entity.id.startsWith(idPrefix)) return highest

    const suffix = entity.id.slice(idPrefix.length)
    if (!/^\d+$/.test(suffix)) return highest

    const number = Number(suffix)
    if (!Number.isSafeInteger(number) || number < 1) return highest

    return Math.max(highest, number)
  }, 0)

  return `${idPrefix}${highestNumber + 1}`
}
