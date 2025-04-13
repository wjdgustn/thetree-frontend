import { markRaw } from 'vue';
import { defineStore } from 'pinia'

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
      page: {},
      viewData: {}
    }
  },
  actions: {
    parseResponse(json) {
      if(json.config) {
        this.$patch({
          config: json.config,
          configHash: json.configHash
        })
      }
      if(json.session) {
        this.$patch({
          session: json.session,
          sessionHash: json.sessionHash
        })
      }

      if(json.page) {
        this.$patch({
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
    },
    async updateView() {
      const contentName = this.page.contentName
      if(!contentName) {
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
      } catch (e) {
        this.page.title = '오류'
        this.page.contentHtml = `missing view ${contentName}`
        this.page.contentName = null
        return
      }
      this.viewData.viewComponent = markRaw(view.default)
      this.page.contentHtml = null
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

    }
  }
})
