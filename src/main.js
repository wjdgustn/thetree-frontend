import { createApp as createCSRApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useStateStore } from '~/stores/state'
import GlobalMixin from './mixins/global'

export function createApp(url, initialData = {}) {
    const app = import.meta.env.SSR
        ? createSSRApp(App)
        : createCSRApp(App)

    const pinia = createPinia()
    app.use(pinia)
    app.use(router)

    const store = app.config.globalProperties.$store = {
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

    if(import.meta.env.SSR) {
        app.config.globalProperties.initialData = initialData
        router.push(url).then()
    }

    return { app, router, pinia }
}