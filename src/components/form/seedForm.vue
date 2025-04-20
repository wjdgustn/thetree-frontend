<template>
  <form ref="form" v-bind="$attrs" @submit="submit">
    <slot/>
    <div ref="captcha" v-if="useCaptcha" class="captcha"></div>
  </form>
</template>
<script>
import { computed } from 'vue'

import Common from '@/mixins/common'

export default {
  mixins: [Common],
  data() {
    return {
      submitting: false,
      abortController: null,
      useCaptcha: !this.$store.state.session.disable_captcha
          && this.$store.state.config.captcha
          && this.captcha,
      captchaId: null,
      captchaLock: []
    }
  },
  provide() {
    return {
      submittingSeedForm: computed(() => this.submitting)
    }
  },
  props: {
    captcha: Boolean,
    beforeSubmit: Function
  },
  computed: {
    captchaConfig() {
      return this.$store.state.config.captcha
    }
  },
  mounted() {
    if(this.useCaptcha) this.loadCaptcha()
  },
  watch: {
    useCaptcha(newValue) {
      if(newValue) this.loadCaptcha()
    }
  },
  methods: {
    getCaptchaLib() {
      return this.captchaConfig && {
        recaptcha: window.grecaptcha,
        turnstile: window.turnstile
      }[this.captchaConfig.type]
    },
    async loadCaptcha() {
      if(this.getCaptchaLib()) return

      window.captchaOnLoad = async () => {
        delete window.captchaOnLoad

        this.captchaId = this.getCaptchaLib().render(this.$refs.captcha, {
          sitekey: this.captchaConfig.site_key,
          theme: this.$store.state.currentTheme,
          callback: () => {
            for(let { resolve } of this.captchaLock) resolve()
            this.captchaLock.length = 0
          },
          ...{
            recaptcha: {
              badge: 'inline',
              size: 'invisible'
            },
            turnstile: {
              execution: 'execute'
            }
          }[this.captchaConfig.type]
        })
      }

      const script = document.createElement('script')
      script.src = {
        recaptcha: 'https://www.google.com/recaptcha/api.js?render=explicit&onload=captchaOnLoad',
        turnstile: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=captchaOnLoad'
      }[this.captchaConfig.type]
      document.head.appendChild(script)
    },
    async submit(e) {
      e.preventDefault()
      if(this.submitting) return

      if((await this.beforeSubmit?.(e)) === false) return

      if(this.captchaId) {
        for(let { reject } of this.captchaLock) reject()
        this.captchaLock.length = 0

        const captchaLib = this.getCaptchaLib()
        captchaLib.reset(this.captchaId)
        captchaLib.execute(this.captchaId)
        try {
          await new Promise((resolve, reject) => {
            this.captchaLock.push({ resolve, reject })
          })
        } catch(e) {
          return
        }
      }

      this.submitting = true

      const form = this.$refs.form
      const data = new FormData(form)

      const url = new URL(form.action)
      if(form.method === 'get')
        url.search = new URLSearchParams(data).toString()

      url.pathname = '/internal' + url.pathname

      const isMultipartForm = form.enctype === 'multipart/form-data'

      const json = await this.internalRequest(url, {
        method: form.method,
        ...(form.method === 'get' ? {} : {
          ...(isMultipartForm ? {} : {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }),
          body: isMultipartForm
              ? data
              : new URLSearchParams(data).toString()
        })
      })
      this.submitting = false

      this.$store.state.components.mainView.beforeLeave = null

      await this.processInternalResponse(json, this.$refs.form)

      if(typeof json?.data === 'string') {
        if(json.data.includes('캡챠')) {
          this.useCaptcha = true
        }
      }
    }
  }
}
</script>
<style scoped>
.captcha {
  clear: both;
}
</style>