<template>
  <form ref="form" v-bind="$attrs" @submit="submit">
    <slot/>
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
      abortController: null
    }
  },
  provide() {
    return {
      submittingSeedForm: computed(() => this.submitting)
    }
  },
  props: {
    captcha: Boolean
  },
  methods: {
    async submit(e) {
      e.preventDefault()
      if(this.submitting) return

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
      if(!json) {
        this.$store.state.components.mainView.processNextUrl()
        return
      }
      const statePatches = this.$store.state.parseResponse(json)

      if(json.page) {
        await this.$store.state.updateView(statePatches)
      }
      else if(typeof json.data === 'string') {
        if(json.data.includes('캡챠')) {
          console.log('force enable captcha')
        }
      }

      this.$store.state.viewData.fieldErrors = json.data.fieldErrors;
    }
  }
}
</script>