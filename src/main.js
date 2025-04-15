import { createApp as createCSRApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { VueHeadMixin } from '@unhead/vue'

import App from './App.vue'
import router from './router'

import { useStateStore } from '~/stores/state'
import GlobalMixin from './mixins/global'

let store

export function useStore() {
    return store
}

export function createApp() {
    const app = import.meta.env.SSR
        ? createSSRApp(App)
        : createCSRApp(App)

    const pinia = createPinia()
    app.use(pinia)
    app.use(router)

    store = app.config.globalProperties.$store = {
        state: useStateStore(),
        commit(action, value) {
            switch(action) {
                case 'localConfigSetValue':
                    this.state.localConfigSetValue(value.key, value.value)
                    break;
            }
        }
    }

    // pinia.state.value['state'] = {
    //     components: {},
    //     config: {},
    //     session: {},
    //     localConfig: {},
    //     page: {
    //         contentHtml: 'sans',
    //         data: {}
    //     },
    //     viewData: {}
    // }

    const globalComponents = import.meta.glob('./components/global/*.vue', {
        eager: true
    })
    for(let [path, def] of Object.entries(globalComponents)) {
        const name = path.split('/').pop().replace('.vue', '')
        app.component(name, def.default)
    }

    app.mixin(GlobalMixin)
    app.mixin(VueHeadMixin)

    return { app, router, pinia }
}