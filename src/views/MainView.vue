<template>
  <ProgressBar ref="progressBar"/>
  <component :is="skin"/>
  <Toaster :theme="$store.state.currentTheme" :richColors="true"/>
</template>

<script>
import { isNavigationFailure, NavigationFailureType } from 'vue-router'
import { Toaster } from 'vue-sonner'

import Common from '@/mixins/common'
import ProgressBar from '@/components/progressBar'

export default {
  mixins: [Common],
  components: {
    ProgressBar,
    Toaster
  },
  computed: {
    pageTitle() {
      const page = this.$store.state.page
      const doc = page.data?.document
      if(!doc) return page.title

      return this.doc_fulltitle(doc) + this.getTitleDescription(page)
    }
  },
  head() {
    const state = this.$store.state
    const siteName = state.config['wiki.site_name'] || 'the tree'
    const fullUrl = state.config['base_url'] + this.$route.fullPath

    return {
      htmlAttrs: { lang: state.config.lang || 'ko' },
      title: this.pageTitle,
      titleTemplate: '%s - ' + siteName,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=no'
        },
        { name: 'generator', content: 'the tree' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'application-name', content: siteName },
        { name: 'application-tooltip', content: siteName },
        { name: 'application-starturl', content: `/w/${state.config['wiki.front_page']}` },

        ...(state.page.data?.date ? [
          { name: 'og:description', content: this.removeHtmlTags(state.viewData.contentHtml).slice(0, 200) },
          { name: 'og:type', content: 'article' }
        ] : []),
        { name: 'og:title', content: this.pageTitle },
        { name: 'og:site_name', content: siteName },
        { name: 'og:url', content: fullUrl },
        ...(state.config['embed_image'] ? [
          { name: 'og:image', content: state.config['embed_image'] }
        ] : [])
      ],
      link: [
        { rel: 'canonical', content: fullUrl },
        {
          rel: 'search',
          type: 'application/opensearchdescription+xml',
          title: siteName,
          href: '/opensearch.xml'
        }
      ]
    }
  },
  data() {
    return {
      skin: null,
      nextUrl: null,
      beforeLeave: null
    }
  },
  async serverPrefetch() {
    this.afterInternalRequest(this.initialData)
    const statePatches = this.$store.state.parseResponse(this.initialData)
    delete this.initialData

    const page = statePatches.page
    if(!page.contentName && !page.contentHtml) return

    await this.$store.state.updateView(statePatches)
  },
  async created() {
    this.$store.state.components.mainView = this
    if(import.meta.env.SSR) return

    this.updateThemeClass()

    if(!this.$store.state.localConfigInitialized) {
      this.$store.state.localConfig = JSON.parse(localStorage.getItem('thetree_settings')) || {}
      this.$store.state.localConfigInitialized = true
    }

    const page = this.$store.state.page
    if(!page.contentName && !page.contentHtml) {
      await this.loadView()
      this.processNextUrl()
    }
    else {
      await this.$store.state.updateView()
    }

    const canMove = (to, from) => {
      if(!this.beforeLeave || this.nextUrl) return true
      const result = this.beforeLeave(to, from)
      if(result) this.beforeLeave = null
      return result
    }
    this.$router.beforeEach(canMove)
    window.addEventListener('beforeunload', e => {
      if(!canMove()) e.preventDefault()
    })
  },
  async beforeRouteUpdate(to, from, next) {
    let prevPath = from.fullPath
    if(prevPath.includes('#'))
        prevPath = prevPath.slice(0, from.fullPath.lastIndexOf('#'))
    let nextPath = to.fullPath
    if(nextPath.includes('#'))
        nextPath = nextPath.slice(0, to.fullPath.lastIndexOf('#'))
    if(prevPath !== nextPath)
      await this.loadView(to.fullPath)
    next()
  },
  mounted() {
    window.addEventListener('keypress', async e => {
      if([
        'INPUT', 'TEXTAREA'
      ].includes(document.activeElement.tagName)) return

      if(e.key === 'c') await this.routerPush('/RecentChanges')
      if(e.key === 'd') await this.routerPush('/RecentDiscuss')
      if(e.key === 'a') await this.routerPush('/random')
      if(e.key === 'f') await this.routerPush(this.doc_action_link(this.$store.state.config['wiki.front_page'], 'w'))
      if(e.key === 'e') {
        const doc = this.$store.state.page.data.document
        if(doc) await this.routerPush(this.doc_action_link(doc, 'edit'))
      }
    })
  },
  watch: {
    $route() {
      this.processNextUrl()
    },
    '$store.state.currentTheme'() {
      this.updateThemeClass()
    }
  },
  methods: {
    updateThemeClass() {
      const theme = this.$store.state.currentTheme
      const className = `theseed-${theme}-mode`
      const otherClassName = `theseed-${theme === 'dark' ? 'light' : 'dark'}-mode`
      document.body.classList.add(className)
      document.body.classList.remove(otherClassName)
    },
    processNextUrl() {
      if(this.nextUrl) {
        if(this.$route.fullPath === this.nextUrl) this.loadView()
        else this.$router.replace(this.nextUrl)
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

      const json = await this.internalRequest(url, { userUrl: url })
      if(!json) return
      const statePatches = this.$store.state.parseResponse(json)

      if(json.page) {
        await this.$store.state.updateView(statePatches)
      }
    }
  }
}
</script>