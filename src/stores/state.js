import { markRaw } from 'vue';
import { defineStore } from 'pinia'

import Skin from 'skin/layout'

export const useStateStore = defineStore('state', {
  state() {
    return {
      components: {
        mainView: null
      },

      config: {},
      configHash: '',
      session: {},
      sessionHash: '',

      localConfig: {},
      localConfigInitialized: false,
      page: {
        data: {}
      },
      viewData: {}
    }
  },
  actions: {
    parseResponse(json) {
      const statePatches = {}
      if(json.page) {
        Object.assign(statePatches, {
          page: {
            ...json.page,
            data: json.data.publicData
          },
          viewData: {
            ...json.data,
            ...json.data.publicData
          }
        })
      }

      return statePatches
    },
    patchPageData(statePatches) {
      this.$patch(state => {
        state.page = statePatches.page
        state.viewData = statePatches.viewData
      })
    },
    async updateView(statePatches) {
      const contentName = statePatches?.page.contentName || this.page.contentName
      if(!contentName) {
        if(statePatches) this.patchPageData(statePatches)
        this.viewData.viewComponent = null
        return
      }
      let view
      try {
        if(contentName.includes('/')) {
          const splitted = contentName.split('/')
          const dir = splitted[0]
          const name = splitted[1]
          view = await import(`@/views/contents/${dir}/${name}.vue`)
        }
        else view = await import(`@/views/contents/${contentName}.vue`)
      } catch(e) {}
      if(view) {
        if(statePatches) this.patchPageData(statePatches)
        this.viewData.viewComponent = markRaw(view.default)
        this.page.contentHtml = null
      }
      else {
        this.page.title = '오류'
        this.page.contentHtml = `missing view ${contentName}`
      }
      this.components.mainView.skin = markRaw(Skin)

      this.cleanTempState()
    },
    cleanTempState() {
      this.viewData.errorAlert = null
      this.viewData.fieldErrors = null
    },
    localConfigGetValue(key) {

    },
    localConfigSetValue(key, value) {
      this.localConfig[key] = value
      localStorage.setItem('thetree_settings', JSON.stringify(this.localConfig))
    }
  },
  getters: {
    currentTheme() {
      if(import.meta.env.SSR)
        return 'light'

      const theme = this.localConfig['wiki.theme']
      if(!theme || theme === 'auto')
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      return theme
    }
  }
})
