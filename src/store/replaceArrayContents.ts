/**
 * Replaces an array's items without replacing its reference.
 *
 * Vue consumers retain their reactive collection while a fresh demo snapshot is
 * applied.
 */
export function replaceArrayContents<T>(target: T[], source: readonly T[]): void {
  target.splice(0, target.length, ...source)
}
