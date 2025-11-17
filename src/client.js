import { createApp, useStore } from './main'
import { createHead } from '@unhead/vue/client'

const { app, router } = createApp()

const head = createHead()
app.use(head)

router.isReady().then(async () => {
    const store = useStore()
    const page = store.state.page
    if(page.contentName || page.contentHtml)
        await store.state.updateView()
    app.mount('#app')
})