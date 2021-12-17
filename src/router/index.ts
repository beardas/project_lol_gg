import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import lol from '../views/LOL.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/lol',
    name: 'LOL',
    component: lol
  },
  {
    path: '/tft',
    name: 'TFT',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TFT.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
