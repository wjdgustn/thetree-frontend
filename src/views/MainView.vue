<template>
  <ProgressBar ref="progressBar"/>
  <component :is="skin"/>
</template>

<script>
import { markRaw } from 'vue'
import { isNavigationFailure, NavigationFailureType } from 'vue-router';

import ProgressBar from '@/components/progressBar';
import Skin from 'skin/layout'

export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      skin: null,
      nextUrl: null
    }
  },
  async serverPrefetch() {
    this.$store.state.parseResponse(this.initialData)
    delete this.initialData

    const page = this.$store.state.page
    if(!page.contentName && !page.contentHtml) return

    await this.$store.state.updateView()
    this.skin ??= markRaw(Skin)
  },
  async created() {
    if(import.meta.env.SSR) return

    this.$store.state.components.mainView = this

    if(!this.$store.state.localConfigInitialized) {
      this.$store.state.localConfig = JSON.parse(localStorage.getItem('thetree_settings')) || {}
      this.$store.state.localConfigInitialized = true
    }

    const page = this.$store.state.page
    if(!page.contentName && !page.contentHtml)
    {
      await this.loadView()
      this.processNextUrl()
    }
    else {
      await this.$store.state.updateView()
      this.skin ??= markRaw(Skin)
    }
  },
  async beforeRouteUpdate(to, from, next) {
    await this.loadView(to.fullPath)
    next()
  },
  watch: {
    $route() {
      this.processNextUrl()
    }
  },
  methods: {
    processNextUrl() {
      if(this.nextUrl) {
        this.$router.replace(this.nextUrl)
        this.nextUrl = null
      }
    },
    async routerPush(to) {
      const result = await this.$router.push(to)
      if(isNavigationFailure(result, NavigationFailureType.duplicated)) {
        this.loadView().then()
      }
    },
    async loadView(url) {
      url ||= this.$route.fullPath
      this.$refs.progressBar?.start()
      const res = await fetch('/internal' + url, {
        headers: {
          'X-Chika': import.meta.env.DEV ? 'bypass' : __THETREE_VERSION_HEADER__,
          'X-Riko': this.$store.state.sessionHash,
          'X-You': this.$store.state.configHash
        }
      })

      if(res.status !== 200)
        return location.reload()

      const json = await res.json()

      this.$refs.progressBar?.finish()

      this.$store.state.parseResponse(json)

      const strCode = json.code?.toString() || ''
      if(strCode.startsWith('3')) {
        this.nextUrl = json.url
        return
      }

      if(json.page) {
        await this.$store.state.updateView()
        this.skin ??= markRaw(Skin)
      }
    }
  }
}
</script>