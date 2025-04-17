import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if(to.hash) return {
      el: to.hash
    }
    else return savedPosition
  },

  routes: [
    {
      path: '/:path(.*)',
      name: 'main',
      component: MainView
    }
  ]
})

export default router