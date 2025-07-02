import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

import { useStateStore } from '@/stores/state'

const router = () => {
  let state = null
  return createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
      state ??= useStateStore()

      return new Promise(async resolve => {
        await new Promise(resolve => {
          state.components.mainView.afterLoadView = resolve
        })

        if(savedPosition
            && (savedPosition.left > 0
                || savedPosition.top > 0)) resolve(savedPosition)
        else if(to.hash) switch(to.hash) {
          case '#toc': {
            const toc = document.getElementsByClassName('wiki-macro-toc')[0];
            resolve({
              el: toc ?? to.hash
            })
            break;
          }
          default:
            resolve({
              el: to.hash
            })
        }
        else resolve({ left: 0, top: 0 })
      })
    },

    routes: [
      {
        path: '/:path(.*)',
        name: 'main',
        component: MainView
      }
    ]
  })
}

export default router