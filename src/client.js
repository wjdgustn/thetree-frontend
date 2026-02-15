import { createApp, useStore } from './main'
import { createHead } from '@unhead/vue/client'
import i18next from 'i18next'
import i18nBackend from 'i18next-http-backend'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'

const { app, router } = createApp()

const head = createHead()
app.use(head)

i18next
    .use(i18nBackend)
    .use(LanguageDetector)
    .init({
        supportedLngs: ['ko', 'en'],
        fallbackLng: 'ko',
        backend: {
            loadPath: '/locale/{{lng}}.json'
        },
        detection: {
            order: ['cookie', 'navigator'],
            lookupCookie: 'thetree.lang',
            caches: ['cookie']
        },
        convertDetectedLanguage: a => a.slice(0, 2)
    })

app.use(I18NextVue, { i18next })

router.isReady().then(async () => {
    const store = useStore()
    const page = store.state.page
    if(page.contentName || page.contentHtml)
        await store.state.updateView()
    app.mount('#app')
})