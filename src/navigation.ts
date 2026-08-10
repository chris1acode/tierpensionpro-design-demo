import type { Component } from 'vue'
import { CalendarDays, CalendarRange, ClipboardCheck, LayoutDashboard, Settings, Users } from '@lucide/vue'

export type AppRouteName = 'dashboard' | 'customers' | 'check-in-out' | 'bookings' | 'occupancy' | 'settings'

export interface NavigationItem {
  name: AppRouteName
  path: string
  title: string
  description: string
  icon: Component
}

export const navigationItems: readonly NavigationItem[] = [
  {
    name: 'dashboard',
    path: '/',
    title: 'Dashboard',
    description: 'Der operative Überblick für den heutigen Pensionstag.',
    icon: LayoutDashboard
  },
  {
    name: 'customers',
    path: '/kunden-tiere',
    title: 'Kunden & Tiere',
    description: 'Verwalte hier künftig Kunden- und Tierstammdaten.',
    icon: Users
  },
  {
    name: 'check-in-out',
    path: '/check-in-out',
    title: 'Check-in/out',
    description: 'Alle anstehenden Anreisen und Abreisen auf einen Blick.',
    icon: ClipboardCheck
  },
  {
    name: 'bookings',
    path: '/buchungen',
    title: 'Buchungen',
    description: 'Plane und verwalte Aufenthalte deiner Tiergäste.',
    icon: CalendarDays
  },
  {
    name: 'occupancy',
    path: '/belegung',
    title: 'Belegung',
    description: 'Tages-Spaltenansicht mit Auslastung je Zimmer und Zeitraum.',
    icon: CalendarRange
  },
  {
    name: 'settings',
    path: '/einstellungen',
    title: 'Einstellungen',
    description: 'Passe Standort, Team und Abläufe an deine Pension an.',
    icon: Settings
  }
]
