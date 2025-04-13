import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url, data) {
    const { app, router, pinia } = createApp(url, data)

    await router.isReady()
    const html = await renderToString(app)

    return { html, state: pinia.state.value['state'] }
}