import { createHead, renderSSRHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url, data) {
    const { app, router, pinia } = createApp(url, data)

    const unhead = createHead()
    app.use(unhead)

    app.config.globalProperties.initialData = data
    router.push(url).then()

    await router.isReady()
    const html = await renderToString(app)
    const head = await renderSSRHead(unhead)

    return {
        head,
        html,
        state: pinia.state.value['state'] }
}