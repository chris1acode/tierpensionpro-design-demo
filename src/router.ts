import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { navigationItems } from './navigation'

export interface NavigationPage {
  title: string
  description: string
}

const routes: RouteRecordRaw[] = [
  ...navigationItems.map(({ path, name, title, description }) => ({
    path,
    name,
    component: {},
    meta: { title, description }
  })),
  { path: '/:pathMatch(.*)*', name: 'not-found', component: {}, meta: { title: 'Seite nicht gefunden', description: 'Die aufgerufene Adresse gibt es in Tierpension Pro nicht.' } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
