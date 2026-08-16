import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { navigationItems } from './navigation'

export interface NavigationPage {
  title: string
  description: string
}

const routes: RouteRecordRaw[] = [
  ...navigationItems.filter((item) => item.name !== 'settings').map(({ path, name, title, description }) => ({
    path,
    name,
    component: {},
    meta: { title, description }
  })),
  { path: '/settings', redirect: '/settings/general' },
  { path: '/settings/general', name: 'settings-general', component: {}, meta: { title: 'Einstellungen', description: 'Passe Standort, Team und Abläufe an deine Pension an.' } },
  { path: '/settings/rates', name: 'settings-rates', component: {}, meta: { title: 'Einstellungen', description: 'Tagespreise je Tierart verwalten.' } },
  { path: '/settings/rooms', name: 'settings-rooms', component: {}, meta: { title: 'Einstellungen', description: 'Zimmer für Belegung und Buchungen verwalten.' } },
  { path: '/account', name: 'account', component: {}, meta: { title: 'Konto', description: 'Persönliche Kontodaten und Vertragsverwaltung.' } },
  { path: '/login', name: 'login', component: {}, meta: { title: 'Anmelden', description: 'Melde dich bei Tierpension Pro an.' } },
  { path: '/register', name: 'register', component: {}, meta: { title: 'Registrieren', description: 'Fordere deinen Registrierungscode an.' } },
  { path: '/register/verify', name: 'register-verify', component: {}, meta: { title: 'Code bestätigen', description: 'Bestätige deinen Registrierungscode.' } },
  { path: '/register/pension', name: 'register-pension', component: {}, meta: { title: 'Pension einrichten', description: 'Vervollständige deine Benutzer- und Pensionsdaten.' } },
  { path: '/request-demo', name: 'request-demo', component: {}, meta: { title: 'Betreuungsanfrage', description: 'Unverbindliche Anfrage an die Tierpension senden.' } },
  { path: '/', name: 'intro', component: {}, meta: { title: 'Intro', description: 'Willkommen bei Tierpension Pro' } },
  { path: '/intro', redirect: '/' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: {}, meta: { title: 'Seite nicht gefunden', description: 'Die aufgerufene Adresse gibt es in Tierpension Pro nicht.' } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
