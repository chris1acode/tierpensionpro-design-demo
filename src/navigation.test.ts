import { describe, expect, it } from 'vitest'
import { navigationItems } from './navigation'

describe('navigation configuration', () => {
  it('keeps route names and paths unique', () => {
    expect(new Set(navigationItems.map((item) => item.name)).size).toBe(navigationItems.length)
    expect(new Set(navigationItems.map((item) => item.path)).size).toBe(navigationItems.length)
  })

  it('provides all metadata needed by router and sidebar', () => {
    expect(navigationItems).toHaveLength(6)
    expect(navigationItems.every((item) => item.title && item.description && item.icon)).toBe(true)
  })
})
